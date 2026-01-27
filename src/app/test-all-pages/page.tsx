import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function TestAllPagesPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth');

  const pages = [
    { path: '/', name: 'Home', public: true },
    { path: '/shop', name: 'Shop', public: true },
    { path: '/login', name: 'Login', public: true },
    { path: '/signup', name: 'Signup', public: true },
    { path: '/profile', name: 'Profile', public: false },
    { path: '/orders', name: 'Orders', public: false },
    { path: '/wishlist', name: 'Wishlist', public: false },
    { path: '/cart', name: 'Cart', public: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Pages Status</h1>
        
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          <div className="text-sm">
            <div><strong>Auth Cookie:</strong> {auth ? `✅ Present (${auth.value})` : '❌ Missing'}</div>
            <div><strong>Status:</strong> {auth ? '🟢 Logged In' : '🔴 Logged Out'}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pages.map((page) => (
            <div key={page.path} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{page.name}</h3>
              <div className="text-sm text-gray-600 mb-2">{page.path}</div>
              <div className="text-xs mb-3">
                <span className={`px-2 py-1 rounded ${page.public ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {page.public ? 'Public' : 'Protected'}
                </span>
              </div>
              <Link
                href={page.path}
                className="inline-block w-full text-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Visit
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Instructions</h2>
          <ol className="text-sm space-y-1">
            <li>1. Visit Login page and log in</li>
            <li>2. Come back to this test page</li>
            <li>3. Try visiting protected pages (Profile, Orders, Wishlist, Cart)</li>
            <li>4. They should all work when logged in</li>
            <li>5. Logout and try again - they should redirect to login</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
