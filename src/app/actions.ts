"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  const size = formData.get("size") as string;

  if (!name || !category || !image || !size) return;

  const { error } = await supabaseAdmin.from("products").insert([
    { name, category, image, size }
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
  const image = formData.get("image") as string;

  if (!name || !role || !image) return;

  const { error } = await supabaseAdmin.from("team_members").insert([
    { name, role, image }
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
