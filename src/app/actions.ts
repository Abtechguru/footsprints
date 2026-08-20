"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";


export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const imageFile = formData.get("imageFile") as File;
  const size = formData.get("size") as string;

  if (!name || !category || !imageFile || !size) return;

  // Upload image to Supabase Storage
  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(fileName, imageFile, { contentType: imageFile.type });
      
    if (uploadError) {
      console.error(uploadError);
      return;
    }
    
    const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
    imageUrl = data.publicUrl;
  }

  const { error } = await supabaseAdmin.from("products").insert([
    { name, category, image: imageUrl, size }
  ]);

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function addTeamMember(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const email = formData.get("email") as string;
  const imageFile = formData.get("imageFile") as File;

  if (!name || !role || !imageFile) return { success: false, error: "Missing required fields" };

  // Upload image to Supabase Storage
  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(fileName, imageFile, { contentType: imageFile.type });
      
    if (uploadError) {
      console.error(uploadError);
      return { success: false, error: "Image upload failed: " + uploadError.message };
    }
    
    const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
    imageUrl = data.publicUrl;
  }

  const { error } = await supabaseAdmin.from("team_members").insert([
    { name, role, email: email || null, image: imageUrl }
  ]);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/our-team");
  revalidatePath("/admin/team");
  return { success: true };
}

export async function updateTeamMember(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const email = formData.get("email") as string;
  const imageFile = formData.get("imageFile") as File;
  const existingImage = formData.get("existingImage") as string;

  if (!id || !name || !role) return { success: false, error: "Missing required fields" };

  let imageUrl = existingImage;

  // If a new file is uploaded, upload it to storage
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(fileName, imageFile, { contentType: imageFile.type });
      
    if (uploadError) {
      console.error(uploadError);
      return { success: false, error: "Image upload failed: " + uploadError.message };
    }
    
    const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
    imageUrl = data.publicUrl;
  }

  const { error } = await supabaseAdmin
    .from("team_members")
    .update({ name, role, email: email || null, image: imageUrl })
    .eq("id", id);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/our-team");
  revalidatePath("/admin/team");
  return { success: true };
}


export async function deleteTeamMember(id: string) {
  const { error } = await supabaseAdmin.from("team_members").delete().eq("id", id);
  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/");
  revalidatePath("/our-team");
  revalidatePath("/admin/team");
}

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { success: false, error: "Email is required" };

  const { error } = await supabaseAdmin.from("subscribers").insert([{ email }]);
  if (error) {
    console.error(error);
    if (error.code === "23505") {
      return { success: false, error: "You are already subscribed!" };
    }
    return { success: false, error: "Subscription failed. Please try again." };
  }

  return { success: true };
}

export async function sendNewsletter(formData: FormData) {
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  if (!subject || !content) {
    return { success: false, error: "Subject and content are required." };
  }

  // Get all subscribers
  const { data: subscribers, error: fetchError } = await supabaseAdmin
    .from("subscribers")
    .select("email");

  if (fetchError || !subscribers || subscribers.length === 0) {
    return { success: false, error: "No subscribers found or failed to fetch." };
  }

  const emails = subscribers.map((sub) => sub.email);

  // Send via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { 
      success: false, 
      error: "RESEND_API_KEY is not configured in your environment variables. Please add it to your .env.local file to send live emails." 
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    // Resend free tier sends up to 100 emails at once or to a list
    const { error: sendError } = await resend.emails.send({
      from: "FootprintsEnergy <newsletter@footprints-energy.com>", // Make sure to verify domain in Resend
      to: "newsletter@footprints-energy.com", // Send to self
      bcc: emails, // Send to all subscribers via BCC
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1d1d1d/5; rounded: 8px;">
          <h2 style="color: #FD630A; font-weight: bold; margin-bottom: 20px;">FootprintsEnergy Newsletter</h2>
          <div style="font-size: 16px; line-height: 1.6; color: #1d1d1d;">
            ${content.replace(/\n/g, "<br />")}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">
            You are receiving this because you subscribed to FootprintsEnergy updates.<br />
            To unsubscribe, please contact us.
          </p>
        </div>
      `
    });

    if (sendError) {
      console.error(sendError);
      return { success: false, error: sendError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function sendReceiptEmail(receiptData: any) {
  const { origin, buyerEmail, buyerName, receiptNo, date, items, payments, totalCharges, footnotes, companyName, companyLogo, companyAddress, companyContact, bankDetails } = receiptData;

  if (!buyerEmail) {
    return { success: false, error: "Buyer's email is required." };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { 
      success: false, 
      error: "RESEND_API_KEY is not configured in your environment variables. Please add it to your .env.local file to send live emails." 
    };
  }

  // Construct items HTML rows
  const itemRows = items.map((item: any) => `
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 10px; font-size: 13px;">${item.date}</td>
      <td style="padding: 10px; font-size: 13px;">${item.type}</td>
      <td style="padding: 10px; font-size: 13px;">${item.productType}</td>
      <td style="padding: 10px; font-size: 13px; font-weight: bold;">${item.productName}</td>
      <td style="padding: 10px; font-size: 13px;">${item.term}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right;">USD${item.amount.toFixed(2)}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right;">USD${item.tax.toFixed(2)}</td>
      <td style="padding: 10px; font-size: 13px;">${item.taxType}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: bold;">USD${item.total.toFixed(2)}</td>
    </tr>
  `).join("");

  // Construct payments HTML rows
  const paymentRows = payments.map((pmt: any) => `
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 10px; font-size: 13px;">${pmt.date}</td>
      <td style="padding: 10px; font-size: 13px;">${pmt.orderNo}</td>
      <td style="padding: 10px; font-size: 13px; font-weight: bold;">${pmt.method}</td>
      <td style="padding: 10px; font-size: 13px;">${pmt.details}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: bold;">USD${pmt.total.toFixed(2)}</td>
    </tr>
  `).join("");

  const namePart1 = companyName ? companyName.split(' ')[0] : 'Footprints';
  const namePart2 = companyName ? companyName.split(' ').slice(1).join(' ') : 'Energy';

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    const { error: sendError } = await resend.emails.send({
      from: "FootprintsEnergy <receipts@footprints-energy.com>", 
      to: buyerEmail,
      subject: `Receipt for Order #${receiptNo} - ${namePart1} ${namePart2}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; color: #1D1D1D;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FD630A; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              ${companyLogo ? `<img src="${companyLogo}" alt="Logo" style="width: 60px; height: 60px; object-fit: contain;" />` : ''}
              <div>
                <h1 style="color: #1D1D1D; font-size: 28px; font-weight: 800; margin: 0;">${namePart1}<span style="color: #FD630A;">${namePart2}</span></h1>
                <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Global Commodity & Energy Trade Partner</p>
                <div style="font-size: 10px; color: #777; margin-top: 8px;">
                  ${(companyAddress || '').replace(/\n/g, '<br/>')}
                  <br/>
                  ${(companyContact || '').replace(/\n/g, '<br/>')}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 20px; font-weight: 700; color: #666; margin: 0;">RECEIPT</h2>
              <p style="font-size: 12px; margin: 5px 0 0 0;"><strong>No:</strong> ${receiptNo}</p>
              <p style="font-size: 12px; margin: 2px 0 0 0;"><strong>Date:</strong> ${date}</p>
            </div>
          </div>

          <!-- Recipient -->
          <div style="margin-bottom: 30px; background-color: #F7F3E6; padding: 15px; border-radius: 6px;">
            <h3 style="font-size: 14px; text-transform: uppercase; color: #FD630A; margin: 0 0 8px 0; font-weight: bold; letter-spacing: 0.05em;">Billed To</h3>
            <p style="font-size: 14px; font-weight: bold; margin: 0;">${buyerName}</p>
            <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">${buyerEmail}</p>
          </div>

          <!-- Charges and Credits Table -->
          <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #1D1D1D;">Charges and Credits:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: left;">
            <thead>
              <tr style="background-color: #7f7f7f; color: #ffffff;">
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Date</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Type</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Product Type</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Product Name</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Term</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase; text-align: right;">Amount</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase; text-align: right;">Tax</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Tax Type</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase; text-align: right;">Total Charges</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
              <!-- Subtotals -->
              <tr style="border-top: 2px solid #ddd; background-color: #f9f9f9;">
                <td colspan="7" style="padding: 10px; font-size: 13px; font-weight: bold; text-align: right;">Total Invoice Amount</td>
                <td colspan="2" style="padding: 10px; font-size: 14px; font-weight: bold; text-align: right; color: #FD630A;">USD${totalCharges.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Payments Table -->
          <h3 style="font-size: 16px; font-weight: bold; margin: 30px 0 10px 0; color: #1D1D1D;">Payments:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; text-align: left;">
            <thead>
              <tr style="background-color: #7f7f7f; color: #ffffff;">
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Date</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Order Number</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Payment Method</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase;">Check/Card#/PayPal ID</th>
                <th style="padding: 10px; font-size: 12px; text-transform: uppercase; text-align: right;">Total Payments</th>
              </tr>
            </thead>
            <tbody>
              ${paymentRows}
            </tbody>
          </table>

          <!-- Bank Details -->
          ${bankDetails ? `
          <div style="background-color: #F0F4F8; padding: 15px; border-radius: 6px; margin-bottom: 30px;">
            <h4 style="font-size: 12px; text-transform: uppercase; color: #1D1D1D; margin: 0 0 8px 0;">Payment / Bank Details</h4>
            <p style="font-size: 12px; color: #555; line-height: 1.5; margin: 0; white-space: pre-line;">
              ${bankDetails}
            </p>
          </div>
          ` : ''}

          <!-- Signature -->
          <div style="margin-top: 40px; text-align: right; padding-right: 20px;">
            <img src="${origin || 'https://footprints-energy.com'}/images/signaturee.png" alt="Signature" style="height: 60px; object-fit: contain;" />
            <h4 style="font-size: 14px; font-weight: bold; color: #1D1D1D; margin: 10px 0 2px 0;">Moyosore Atobatele</h4>
            <p style="font-size: 11px; color: #555; margin: 0;">Executive Director</p>
          </div>

          <!-- Footnotes -->
          <div style="border-top: 1px dashed #ddd; padding-top: 20px;">
            <h4 style="font-size: 12px; text-transform: uppercase; color: #666; margin: 0 0 8px 0;">Please Note:</h4>
            <p style="font-size: 11px; color: #777; line-height: 1.5; margin: 0;">
              ${footnotes.replace(/\n/g, "<br />")}
            </p>
          </div>
        </div>
      `
    });

    if (sendError) {
      console.error(sendError);
      return { success: false, error: sendError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function saveReceipt(receiptData: any) {
  const { receiptNo, buyerName, buyerEmail, date, items, payments, totalCharges, footnotes } = receiptData;

  const { data, error } = await supabaseAdmin.from("receipts").insert([{
    receipt_no: receiptNo,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    date: date,
    items: items,
    payments: payments,
    total_charges: totalCharges,
    footnotes: footnotes
  }]).select();

  if (error) {
    console.error(error);
    // If it already exists, let's update it!
    if (error.code === "23505") {
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from("receipts")
        .update({
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          date: date,
          items: items,
          payments: payments,
          total_charges: totalCharges,
          footnotes: footnotes
        })
        .eq("receipt_no", receiptNo)
        .select();
      
      if (updateError) {
        console.error(updateError);
        return { success: false, error: updateError.message };
      }
      revalidatePath("/admin/receipts");
      return { success: true, receipt: updateData[0] };
    }

    return { success: false, error: error.message };
  }

  revalidatePath("/admin/receipts");
  return { success: true, receipt: data[0] };
}

export async function deleteReceipt(id: string) {
  const { error } = await supabaseAdmin.from("receipts").delete().eq("id", id);
  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/receipts");
  return { success: true };
}

export async function saveInvoice(invoiceData: any) {
  const { headerTitle, invoiceNo, clientName, clientAddress, date, items, totalAmount, notes } = invoiceData;

  const headerVal = headerTitle || "PROFORMA INVOICE";

  const payload: any = {
    invoice_no: invoiceNo,
    client_name: clientName,
    client_address: clientAddress,
    date: date,
    items: items,
    total_amount: totalAmount,
    notes: notes,
    header_title: headerVal
  };

  let { data, error } = await supabaseAdmin.from("invoices").insert([payload]).select();

  // If column doesn't exist in database schema, strip header_title and retry
  if (error && (error.message?.includes("header_title") || error.code === "PGRST204")) {
    delete payload.header_title;
    const retry = await supabaseAdmin.from("invoices").insert([payload]).select();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error(error);
    if (error.code === "23505") {
      const updatePayload: any = {
        client_name: clientName,
        client_address: clientAddress,
        date: date,
        items: items,
        total_amount: totalAmount,
        notes: notes,
        header_title: headerVal
      };

      let { data: updateData, error: updateError } = await supabaseAdmin
        .from("invoices")
        .update(updatePayload)
        .eq("invoice_no", invoiceNo)
        .select();

      if (updateError && (updateError.message?.includes("header_title") || updateError.code === "PGRST204")) {
        delete updatePayload.header_title;
        const retryUpdate = await supabaseAdmin
          .from("invoices")
          .update(updatePayload)
          .eq("invoice_no", invoiceNo)
          .select();
        updateData = retryUpdate.data;
        updateError = retryUpdate.error;
      }

      if (updateError) {
        console.error(updateError);
        return { success: false, error: updateError.message };
      }
      revalidatePath("/admin/invoices");
      return { success: true, invoice: updateData?.[0] };
    }

    return { success: false, error: error.message };
  }

  revalidatePath("/admin/invoices");
  return { success: true, invoice: data?.[0] };
}

export async function deleteInvoice(id: string) {
  const { error } = await supabaseAdmin.from("invoices").delete().eq("id", id);
  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/invoices");
  return { success: true };
}

export async function deleteSubscriber(id: string) {
  const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id);
  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/subscribers");
  return { success: true };
}

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabaseServer = await createClient();
  const { error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  } else {
    redirect("/admin");
  }
}

export async function updateLandingSettings(formData: FormData) {
  // Read standard text fields
  const hero_badge = formData.get("hero_badge") as string;
  const hero_title = formData.get("hero_title") as string;
  const hero_subtitle = formData.get("hero_subtitle") as string;
  const hero_button_text = formData.get("hero_button_text") as string;
  const hero_button_link = formData.get("hero_button_link") as string;
  const hero_stat1_value = formData.get("hero_stat1_value") as string;
  const hero_stat1_label = formData.get("hero_stat1_label") as string;
  const hero_stat2_value = formData.get("hero_stat2_value") as string;
  const hero_stat2_label = formData.get("hero_stat2_label") as string;
  const hero_stat3_value = formData.get("hero_stat3_value") as string;
  const hero_stat3_label = formData.get("hero_stat3_label") as string;

  const about_label = formData.get("about_label") as string;
  const about_title = formData.get("about_title") as string;
  const about_text_p1 = formData.get("about_text_p1") as string;
  const about_text_p2 = formData.get("about_text_p2") as string;
  const about_quote = formData.get("about_quote") as string;
  const about_accent_title = formData.get("about_accent_title") as string;
  const about_accent_subtitle = formData.get("about_accent_subtitle") as string;

  const value_props_label = formData.get("value_props_label") as string;
  const value_props_title = formData.get("value_props_title") as string;
  const value_props_desc = formData.get("value_props_desc") as string;

  const process_label = formData.get("process_label") as string;
  const process_title = formData.get("process_title") as string;

  const contact_phone_primary = formData.get("contact_phone_primary") as string;
  const contact_phone_secondary = formData.get("contact_phone_secondary") as string;
  const contact_email_primary = formData.get("contact_email_primary") as string;
  const contact_email_secondary = formData.get("contact_email_secondary") as string;
  const contact_address_line1 = formData.get("contact_address_line1") as string;
  const contact_address_line2 = formData.get("contact_address_line2") as string;
  const document_letterhead_url = formData.get("document_letterhead_url") as string;
  const document_signature_url = formData.get("document_signature_url") as string;

  // Handle lists
  const valuePropsJson = formData.get("value_props_list_json") as string;
  const processStepsJson = formData.get("process_steps_list_json") as string;

  let value_props_list = [];
  try {
    if (valuePropsJson) value_props_list = JSON.parse(valuePropsJson);
  } catch (e) {
    console.error("Error parsing value_props_list", e);
  }

  let process_steps_list = [];
  try {
    if (processStepsJson) process_steps_list = JSON.parse(processStepsJson);
  } catch (e) {
    console.error("Error parsing process_steps_list", e);
  }

  // Handle file uploads
  const heroImage1File = formData.get("hero_image1_file") as File;
  const heroImage2File = formData.get("hero_image2_file") as File;
  const aboutImageFile = formData.get("about_image_file") as File;

  let hero_image1 = formData.get("existing_hero_image1") as string;
  let hero_image2 = formData.get("existing_hero_image2") as string;
  let about_image = formData.get("existing_about_image") as string;

  const uploadFile = async (file: File) => {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('images')
        .upload(fileName, file, { contentType: file.type });
      if (uploadError) {
        console.error(uploadError);
        return null;
      }
      const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
      return data.publicUrl;
    }
    return null;
  };

  if (heroImage1File && heroImage1File.size > 0) {
    const url = await uploadFile(heroImage1File);
    if (url) hero_image1 = url;
  }
  if (heroImage2File && heroImage2File.size > 0) {
    const url = await uploadFile(heroImage2File);
    if (url) hero_image2 = url;
  }
  if (aboutImageFile && aboutImageFile.size > 0) {
    const url = await uploadFile(aboutImageFile);
    if (url) about_image = url;
  }

  const updatePayload = {
    hero_badge,
    hero_title,
    hero_subtitle,
    hero_button_text,
    hero_button_link,
    hero_stat1_value,
    hero_stat1_label,
    hero_stat2_value,
    hero_stat2_label,
    hero_stat3_value,
    hero_stat3_label,
    hero_image1,
    hero_image2,
    about_label,
    about_title,
    about_text_p1,
    about_text_p2,
    about_quote,
    about_image,
    about_accent_title,
    about_accent_subtitle,
    value_props_label,
    value_props_title,
    value_props_desc,
    value_props_list,
    process_label,
    process_title,
    process_steps_list,
    contact_phone_primary,
    contact_phone_secondary,
    contact_email_primary,
    contact_email_secondary,
    contact_address_line1,
    contact_address_line2,
    document_letterhead_url,
    document_signature_url,
  };

  const { error } = await supabaseAdmin
    .from("landing_page_settings")
    .update(updatePayload)
    .eq("id", 1);

  if (error) {
    console.error("Error upserting landing_page_settings:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateDocumentAssets(letterheadUrl: string | null, signatureUrl: string | null) {
  const updatePayload: any = {};
  if (letterheadUrl !== null) updatePayload.document_letterhead_url = letterheadUrl;
  if (signatureUrl !== null) updatePayload.document_signature_url = signatureUrl;

  const { error } = await supabaseAdmin
    .from("landing_page_settings")
    .update(updatePayload)
    .eq("id", 1);

  if (error) {
    console.error("Error updating document assets:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/documents");
  return { success: true };
}

export async function addMediaSession(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const files = formData.getAll("mediaFiles") as File[];

  if (!title || !date) {
    return { success: false, error: "Title and Date are required" };
  }

  const media_urls: Array<{ url: string; type: "image" | "video" }> = [];

  for (const file of files) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('images')
        .upload(fileName, file, { contentType: file.type });
      
      if (uploadError) {
        console.error("Failed to upload file in session:", file.name, uploadError);
        continue;
      }

      const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
      const isVideo = file.type.startsWith("video/");
      media_urls.push({
        url: data.publicUrl,
        type: isVideo ? "video" : "image"
      });
    }
  }

  const { error } = await supabaseAdmin.from("media_sessions").insert([
    { title, description, date, media_urls }
  ]);

  if (error) {
    console.error("Error inserting media session:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/sessions");
  revalidatePath("/admin/sessions");
  return { success: true };
}

export async function deleteMediaSession(id: string) {
  const { error } = await supabaseAdmin.from("media_sessions").delete().eq("id", id);
  if (error) {
    console.error("Error deleting media session:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/sessions");
  revalidatePath("/admin/sessions");
  return { success: true };
}

export async function updateMediaSession(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const existingMediaStr = formData.get("existingMedia") as string;
  const files = formData.getAll("mediaFiles") as File[];

  if (!id || !title || !date) {
    return { success: false, error: "ID, Title and Date are required" };
  }

  let media_urls: Array<{ url: string; type: "image" | "video" }> = [];
  try {
    if (existingMediaStr) {
      media_urls = JSON.parse(existingMediaStr);
    }
  } catch (e) {
    console.error("Failed to parse existing media");
  }

  for (const file of files) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('images')
        .upload(fileName, file, { contentType: file.type });
      
      if (uploadError) {
        console.error("Failed to upload file in session:", file.name, uploadError);
        continue;
      }

      const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
      const isVideo = file.type.startsWith("video/");
      media_urls.push({
        url: data.publicUrl,
        type: isVideo ? "video" : "image"
      });
    }
  }

  const { error } = await supabaseAdmin
    .from("media_sessions")
    .update({ title, description, date, media_urls })
    .eq("id", id);

  if (error) {
    console.error("Error updating media session:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/sessions");
  revalidatePath("/admin/sessions");
  return { success: true };
}

export async function uploadLogo(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { success: false, error: "No file provided" };
  
  const fileExt = file.name.split('.').pop();
  const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error: uploadError } = await supabaseAdmin.storage
    .from('images')
    .upload(fileName, file, { contentType: file.type });
    
  if (uploadError) {
    console.error("Failed to upload logo:", uploadError);
    return { success: false, error: uploadError.message };
  }

  const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
  return { success: true, url: data.publicUrl };
}

export async function uploadDocumentAsset(formData: FormData) {
  const file = formData.get("file") as File;
  const type = formData.get("type") as string || "asset";
  if (!file || file.size === 0) return { success: false, error: "No file provided" };
  
  const fileExt = file.name.split('.').pop();
  const fileName = `doc-${type}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error: uploadError } = await supabaseAdmin.storage
    .from('images')
    .upload(fileName, file, { contentType: file.type });
    
  if (uploadError) {
    console.error(`Failed to upload ${type}:`, uploadError);
    return { success: false, error: uploadError.message };
  }

  const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);
  return { success: true, url: data.publicUrl };
}

import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY || "foodprints-secret-vault-key", "salt", 32); 
const IV_LENGTH = 16;

export async function uploadEncryptedVaultDocument(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { success: false, error: "No file provided" };
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Encrypt the buffer
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(buffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Prefix IV to encrypted data so we can decrypt later
    const encryptedFileBuffer = Buffer.concat([iv, encrypted]);
    const fileExt = file.name.split('.').pop();
    const encryptedFileName = `vault-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}.enc`;

    // Upload to Supabase 
    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(encryptedFileName, encryptedFileBuffer, { contentType: 'application/octet-stream' });
      
    if (uploadError) throw uploadError;

    return { success: true, fileName: encryptedFileName, originalName: file.name };
  } catch (err: any) {
    console.error("Vault Encryption Error:", err);
    return { success: false, error: err.message };
  }
}

export async function signUpClient(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabaseServer = await createClient();
  const { data, error } = await supabaseServer.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function signInClient(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabaseServer = await createClient();
  const { error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function signOutClient() {
  const supabaseServer = await createClient();
  await supabaseServer.auth.signOut();
  redirect("/portal");
}

export async function createOrder(productId: string, productName: string, quantity: string, notes: string) {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  
  const { data, error } = await supabaseAdmin.from("orders").insert([
    {
      user_id: user.id,
      user_email: user.email,
      product_id: productId,
      product_name: productName,
      quantity: quantity,
      notes: notes,
      status: "pending"
    }
  ]).select();
  
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, order: data[0] };
}

export async function sendChatMessage(message: string) {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };
  
  const { data, error } = await supabaseAdmin.from("chat_messages").insert([
    {
      user_id: user.id,
      user_email: user.email,
      sender: "visitor",
      message: message
    }
  ]).select();
  
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, chat: data[0] };
}

export async function sendAdminChatMessage(userId: string, message: string) {
  const supabaseServer = await createClient();
  const { data: { user: adminUser } } = await supabaseServer.auth.getUser();
  if (!adminUser) return { success: false, error: "Not authenticated" };
  
  const { data: profile } = await supabaseAdmin
    .from("staff_profiles")
    .select("is_active, email")
    .eq("id", adminUser.id)
    .single();
    
  if (!profile || profile.is_active === false) {
    return { success: false, error: "Restricted access." };
  }
  
  const { data, error } = await supabaseAdmin.from("chat_messages").insert([
    {
      user_id: userId,
      user_email: profile.email || "admin",
      sender: "admin",
      message: message
    }
  ]).select();
  
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, chat: data[0] };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabaseServer = await createClient();
  const { data: { user: adminUser } } = await supabaseServer.auth.getUser();
  if (!adminUser) return { success: false, error: "Not authenticated" };
  
  const { data: profile } = await supabaseAdmin
    .from("staff_profiles")
    .select("is_active")
    .eq("id", adminUser.id)
    .single();
    
  if (!profile || profile.is_active === false) {
    return { success: false, error: "Restricted access." };
  }
  
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", orderId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function saveDocumentDraft(formData: FormData) {
  const mode = formData.get("mode") as string;
  const content = formData.get("content") as string;
  const signatureUrl = formData.get("signatureUrl") as string;
  const signaturePos = formData.get("signaturePos") as string;
  
  if (!mode) return { success: false, error: "Mode is required" };

  try {
    const { error } = await supabaseAdmin
      .from("document_drafts")
      .upsert({ 
        id: mode,
        mode,
        content,
        signature_url: signatureUrl,
        signature_pos: signaturePos,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error saving document draft:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}







