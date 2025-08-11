import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-16">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
      <p className="max-w-md text-lg text-gray-600 mb-8">
        Thank you for your order. We've received your payment and a confirmation email will be sent to you shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/account/orders">View Orders</Link>
        </Button>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}