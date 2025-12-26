'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddressSelection from '@/components/checkout/AddressSelection';
import { Button } from '@/components/ui/button';
import { loadRazorpay } from '@/lib/razorpay';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items: cartItems, clearCart } = useCartStore();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!selectedAddressId) {
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        setIsProcessing(false);
        return;
      }

      // Create Order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: cartItems.map(item => ({
            variantId: item.id, // Assuming cart item id is the variant id
            quantity: item.quantity
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to create order' }));
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await res.json();

      // Fetch address to get mobile number for prefill
      let addressData = null;
      try {
        const addressRes = await fetch('/api/address');
        if (addressRes.ok) {
          const addresses = await addressRes.json();
          addressData = addresses.find((addr: { id: string; mobile?: string }) => addr.id === selectedAddressId);
        }
      } catch (error) {
        console.error('Failed to fetch address for prefill', error);
      }

      // Fetch user session for name and email
      let userData = null;
      try {
        const userRes = await fetch('/api/auth/session');
        if (userRes.ok) {
          userData = await userRes.json();
        }
      } catch (error) {
        console.error('Failed to fetch user data for prefill', error);
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Kind Cotton',
        description: 'Purchase from Kind Cotton',
        order_id: data.razorpayOrderId,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          // Verify Payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            router.push('/checkout/success');
          } else {
            const errorData = await verifyRes.json().catch(() => ({ message: 'Payment verification failed' }));
            alert(errorData.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userData?.user?.name || undefined,
          email: userData?.user?.email || undefined,
          contact: addressData?.mobile || undefined,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new (window as unknown as { Razorpay: new (options: Record<string, unknown>) => any }).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        console.error('Payment failed', response);
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (error: unknown) {
      console.error('Payment failed', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';

      // Handle "Variant not found" error (stale cart)
      if (errorMessage.includes('Variant not found')) {
        alert('Some items in your cart are no longer available. Your cart has been cleared.');
        clearCart();
        router.push('/products');
        return;
      }

      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <AddressSelection onSelect={setSelectedAddressId} />
        </div>

        <div className="md:col-span-1">
          <div className="border rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.title} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessing || !selectedAddressId || cartItems.length === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
