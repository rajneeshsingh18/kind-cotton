'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip Code is required'),
  country: z.string().min(1, 'Country is required'),
  mobile: z.string().min(10, 'Mobile number is required').regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
});

type Address = z.infer<typeof addressSchema> & { id: string; isDefault: boolean; mobile?: string };

interface AddressSelectionProps {
  onSelect: (addressId: string) => void;
}

export default function AddressSelection({ onSelect }: AddressSelectionProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch('/api/address');
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
          const defaultAddress = data.find((a: Address) => a.isDefault);
          if (defaultAddress) {
            setSelectedId(defaultAddress.id);
            onSelect(defaultAddress.id);
          } else if (data.length > 0) {
            setSelectedId(data[0].id);
            onSelect(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch addresses', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [onSelect]);

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    try {
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, isDefault: addresses.length === 0 }),
      });

      if (res.ok) {
        const newAddress = await res.json();
        setAddresses([...addresses, newAddress]);
        setSelectedId(newAddress.id);
        onSelect(newAddress.id);
        setIsAddingNew(false);
        form.reset();
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Failed to add address' }));
        console.error('Failed to add address', errorData);
        alert(errorData.message || 'Failed to add address. Please try again.');
      }
    } catch (error) {
      console.error('Failed to add address', error);
      alert('Failed to add address. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        {!isAddingNew && (
          <Button variant="outline" size="sm" onClick={() => setIsAddingNew(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        )}
      </div>

      {isAddingNew ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" {...form.register('street')} />
                  {form.formState.errors.street && (
                    <p className="text-sm text-red-500">{form.formState.errors.street.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register('city')} />
                  {form.formState.errors.city && (
                    <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...form.register('state')} />
                  {form.formState.errors.state && (
                    <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" {...form.register('zipCode')} />
                  {form.formState.errors.zipCode && (
                    <p className="text-sm text-red-500">{form.formState.errors.zipCode.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...form.register('country')} />
                  {form.formState.errors.country && (
                    <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" type="tel" placeholder="10 digit mobile number" {...form.register('mobile')} />
                  {form.formState.errors.mobile && (
                    <p className="text-sm text-red-500">{form.formState.errors.mobile.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Address
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">No addresses found. Please add a new address.</p>
            <Button variant="outline" onClick={() => setIsAddingNew(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm cursor-pointer transition-colors ${selectedId === address.id ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => {
                setSelectedId(address.id);
                onSelect(address.id);
              }}
            >
              <div className="mt-1">
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  id={address.id}
                  checked={selectedId === address.id}
                  onChange={() => {
                    setSelectedId(address.id);
                    onSelect(address.id);
                  }}
                  className="h-4 w-4 cursor-pointer"
                />
              </div>
              <Label
                htmlFor={address.id}
                className="font-normal cursor-pointer w-full"
              >
                <div className="font-medium">{address.street}</div>
                <div className="text-muted-foreground">
                  {address.city}, {address.state} {address.zipCode}
                </div>
                <div className="text-muted-foreground">{address.country}</div>
                {address.mobile && (
                  <div className="text-muted-foreground">Mobile: {address.mobile}</div>
                )}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
