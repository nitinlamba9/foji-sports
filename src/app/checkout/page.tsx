import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CheckoutDisplay from '@/components/checkout/CheckoutDisplay';
import OrderSummary from '@/components/checkout/OrderSummary';

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth');

  if (!auth) {
    redirect('/login');
  }

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutDisplay />
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary className="sticky top-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
