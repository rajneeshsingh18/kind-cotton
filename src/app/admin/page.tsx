import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to a default page in the admin dashboard
  redirect('/admin/products');
}