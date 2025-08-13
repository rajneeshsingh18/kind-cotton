"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "../_actions/products";
import { Loader2, Trash2 } from "lucide-react";

export function ProductActions({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteProduct(productId);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/products/${productId}/edit`}>Edit</Link>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}