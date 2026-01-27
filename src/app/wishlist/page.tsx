import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import WishlistDisplay from '@/components/wishlist/WishlistDisplay';

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth');

  if (!auth) {
    redirect('/login');
  }

  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          
          {/* Wishlist Items */}
          <WishlistDisplay />
        </div>
      </div>
    </main>
  );
}
