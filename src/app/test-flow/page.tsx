import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function TestFlowPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Flow Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="text-lg">
            {auth ? (
              <div className="text-green-600">
                ✅ Logged In: <strong>{auth.value}</strong>
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Not Logged In
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Steps</h2>
          <ol className="space-y-2 text-sm">
            <li>1. Click "Login" below</li>
            <li>2. Enter any email and password (6+ chars)</li>
            <li>3. Submit the form</li>
            <li>4. You should be redirected back to this page</li>
            <li>5. Status should show "Logged In"</li>
            <li>6. Test protected pages (Profile, Orders, etc.)</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/" className="text-center p-3 bg-blue-100 rounded hover:bg-blue-200">
              Home
            </Link>
            <Link href="/login" className="text-center p-3 bg-green-100 rounded hover:bg-green-200">
              Login
            </Link>
            <Link href="/profile" className="text-center p-3 bg-purple-100 rounded hover:bg-purple-200">
              Profile
            </Link>
            <Link href="/orders" className="text-center p-3 bg-orange-100 rounded hover:bg-orange-200">
              Orders
            </Link>
            <Link href="/wishlist" className="text-center p-3 bg-pink-100 rounded hover:bg-pink-200">
              Wishlist
            </Link>
            <Link href="/cart" className="text-center p-3 bg-yellow-100 rounded hover:bg-yellow-200">
              Cart
            </Link>
            <Link href="/shop" className="text-center p-3 bg-gray-100 rounded hover:bg-gray-200">
              Shop
            </Link>
            <Link href="/api/auth/logout" className="text-center p-3 bg-red-100 rounded hover:bg-red-200">
              Logout
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
          <div className="text-sm space-y-2">
            <div><strong>Logged Out:</strong> Protected pages redirect to login</div>
            <div><strong>Logged In:</strong> All pages accessible</div>
            <div><strong>Logout:</strong> Clears cookies and redirects to login</div>
          </div>
        </div>
      </div>
    </div>
  );
}
