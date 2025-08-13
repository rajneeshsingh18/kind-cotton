"use client";

import { useState } from "react";
// ✅ Corrected: All form hooks are now imported from 'react' in React 19
import { useActionState} from "react"; 
import { useFormStatus } from "react-dom";

import { Category, Size } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { addProduct } from "../../_actions/products";
import { Trash2 } from "lucide-react";

type Variant = {
  id: number;
  color: string;
  size: Size;
  price: number;
  stock: number;
  images: string;
};

type FormState = {
  name?: string[];
  description?: string[];
  categoryId?: string[];
  generalError?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}

export function AddProductForm({ categories }: { categories: Category[] }) {
  const [formState, action] = useActionState(addProduct, {});
  const [variants, setVariants] = useState<Variant[]>([
    { id: Date.now(), color: "Black", size: "M", price: 999, stock: 100, images: "" },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now(), color: "", size: "M", price: 0, stock: 0, images: "" },
    ]);
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleVariantChange = (id: number, field: keyof Variant, value: any) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const typedFormState = formState as FormState;

  return (
    <form action={action} className="space-y-8">
      {/* Product Name, Description, and Category fields */}
      <div className="space-y-2">
        <label htmlFor="name">Product Name</label>
        <input type="text" id="name" name="name" required className="w-full p-2 border rounded-md" />
        {typedFormState?.name && <div className="text-red-500 text-sm">{typedFormState.name[0]}</div>}
      </div>
      <div className="space-y-2">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required className="w-full p-2 border rounded-md min-h-24" />
        {typedFormState?.description && <div className="text-red-500 text-sm">{typedFormState.description[0]}</div>}
      </div>
      <div className="space-y-2">
        <label htmlFor="categoryId">Category</label>
        <select id="categoryId" name="categoryId" required className="w-full p-2 border rounded-md">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {typedFormState?.categoryId && <div className="text-red-500 text-sm">{typedFormState.categoryId[0]}</div>}
      </div>

      <hr/>
      <h3 className="text-lg font-semibold">Product Variants</h3>
      
      {/* Dynamic Variant fields */}
      {variants.map((variant) => (
        <div key={variant.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end p-4 border rounded-lg bg-gray-50">
          <div className="space-y-1 md:col-span-2"><label className="text-sm">Image URL</label><input type="text" value={variant.images} onChange={(e) => handleVariantChange(variant.id, "images", e.target.value)} className="w-full p-2 border rounded-md" placeholder="https://..." /></div>
          <div className="space-y-1"><label className="text-sm">Color</label><input type="text" value={variant.color} onChange={(e) => handleVariantChange(variant.id, "color", e.target.value)} className="w-full p-2 border rounded-md" /></div>
          <div className="space-y-1"><label className="text-sm">Size</label><select value={variant.size} onChange={(e) => handleVariantChange(variant.id, "size", e.target.value)} className="w-full p-2 border rounded-md">{Object.values(Size).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div className="space-y-1"><label className="text-sm">Price (INR)</label><input type="number" value={variant.price} onChange={(e) => handleVariantChange(variant.id, "price", parseInt(e.target.value) || 0)} className="w-full p-2 border rounded-md" /></div>
          <div className="space-y-1"><label className="text-sm">Stock</label><input type="number" value={variant.stock} onChange={(e) => handleVariantChange(variant.id, "stock", parseInt(e.target.value) || 0)} className="w-full p-2 border rounded-md" /></div>
          <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(variant.id)} className="text-red-500 hover:bg-red-100"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
      
      <Button type="button" variant="outline" onClick={addVariant}>Add Another Variant</Button>

      <input type="hidden" name="variants" value={JSON.stringify(variants)} />

      {typedFormState?.generalError && <div className="text-red-500">{typedFormState.generalError}</div>}

      <SubmitButton />
    </form>
  );
}