"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

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
  const imageFile = formData.get("imageFile") as File;

  if (!name || !role || !imageFile) return;

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

  const { error } = await supabaseAdmin.from("team_members").insert([
    { name, role, image: imageUrl }
  ]);

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(id: string) {
  const { error } = await supabaseAdmin.from("team_members").delete().eq("id", id);
  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/");
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
      from: "Footprints Energy <newsletter@footprints-energy.com>", // Make sure to verify domain in Resend
      to: "newsletter@footprints-energy.com", // Send to self
      bcc: emails, // Send to all subscribers via BCC
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1d1d1d/5; rounded: 8px;">
          <h2 style="color: #FD630A; font-weight: bold; margin-bottom: 20px;">Footprints Energy Newsletter</h2>
          <div style="font-size: 16px; line-height: 1.6; color: #1d1d1d;">
            ${content.replace(/\n/g, "<br />")}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">
            You are receiving this because you subscribed to Footprints Energy updates.<br />
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
  const { buyerEmail, buyerName, receiptNo, date, items, payments, totalCharges, footnotes } = receiptData;

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

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    const { error: sendError } = await resend.emails.send({
      from: "FootprintsEnergy <receipts@footprints-energy.com>", 
      to: buyerEmail,
      subject: `Receipt for Order #${receiptNo} - FootprintsEnergy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 8px; color: #1D1D1D;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FD630A; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
              <h1 style="color: #1D1D1D; font-size: 28px; font-weight: 800; margin: 0;">Footprints<span style="color: #FD630A;">Energy</span></h1>
              <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Global Commodity & Energy Trade Partner</p>
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



