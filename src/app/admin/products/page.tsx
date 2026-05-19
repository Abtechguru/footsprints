import { supabaseAdmin } from "@/lib/supabase";
import { deleteProduct, addProduct } from "@/app/actions";
import Image from "next/image";
import SubmitButton from "@/components/SubmitButton";

export const revalidate = 0;

export default async function AdminProducts() {
  const { data: products } = await supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1D1D1D] mb-8">Manage Products</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#1D1D1D]/5 mb-12">
        <h2 className="text-xl font-bold text-[#1D1D1D] mb-4">Add New Product</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Product Name</label>
            <input type="text" name="name" required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A]" placeholder="e.g. Premium Rice" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Category</label>
            <input type="text" name="category" required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A]" placeholder="e.g. Grains" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Product Image</label>
            <input type="file" name="imageFile" accept="image/*" required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#1D1D1D]/5 file:text-[#1D1D1D] hover:file:bg-[#1D1D1D]/10 transition-all cursor-pointer" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#1D1D1D]/70">Display Size</label>
            <select name="size" required className="border border-[#1D1D1D]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#FD630A] bg-white">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="tall">Tall</option>
            </select>
          </div>
          <div className="md:col-span-2 pt-4">
            <SubmitButton defaultText="Add Product" loadingText="Uploading..." className="bg-[#1D1D1D] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#FD630A] transition-colors w-auto inline-flex" />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1D1D1D]/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F3E6] text-[#1D1D1D] text-sm uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-[#1D1D1D]/5">Image</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Name</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Category</th>
              <th className="p-4 border-b border-[#1D1D1D]/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-[#F7F3E6]/50 transition-colors">
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-4 border-b border-[#1D1D1D]/5 font-bold text-[#1D1D1D]">{product.name}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5 text-[#1D1D1D]/60">{product.category}</td>
                <td className="p-4 border-b border-[#1D1D1D]/5">
                  <form action={async () => {
                    "use server";
                    await deleteProduct(product.id);
                  }}>
                    <button type="submit" className="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#1D1D1D]/50 font-medium">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
