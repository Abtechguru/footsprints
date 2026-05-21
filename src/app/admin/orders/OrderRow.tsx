"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface OrderRowProps {
  order: any;
  updateOrderStatus: (orderId: string, status: string) => Promise<{ success: boolean; error?: string }>;
}

export default function OrderRow({ order, updateOrderStatus }: OrderRowProps) {
  const [status, setStatus] = useState(order.status);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    startTransition(async () => {
      const res = await updateOrderStatus(order.id, newStatus);
      if (!res.success) {
        alert("Failed to update status: " + res.error);
        setStatus(order.status); // revert
      }
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <tr className="hover:bg-[#F7F3E6]/25 transition-colors">
      <td className="p-4 font-semibold text-[#1D1D1D]/70 font-mono text-xs whitespace-nowrap">
        {formatDate(order.created_at)}
      </td>
      <td className="p-4 font-medium text-xs text-[#DAA35D] break-all">
        {order.user_email}
      </td>
      <td className="p-4 font-bold text-[#1D1D1D]">
        {order.product_name}
      </td>
      <td className="p-4 font-semibold text-[#1D1D1D]/80">
        {order.quantity}
      </td>
      <td className="p-4 text-xs font-medium text-[#1D1D1D]/60 max-w-xs break-words">
        {order.notes || <span className="text-gray-300">N/A</span>}
      </td>
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center justify-center space-x-2">
          {isPending && <Loader2 className="animate-spin text-[#FD630A]" size={14} />}
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={isPending}
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border focus:outline-none transition-colors ${
              status === "pending"
                ? "bg-amber-50 text-amber-800 border-amber-250 focus:border-amber-500"
                : status === "processing"
                ? "bg-blue-50 text-blue-800 border-blue-250 focus:border-blue-500"
                : status === "completed"
                ? "bg-green-50 text-green-800 border-green-250 focus:border-green-500"
                : "bg-red-50 text-red-800 border-red-250 focus:border-red-500"
            }`}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </td>
    </tr>
  );
}
