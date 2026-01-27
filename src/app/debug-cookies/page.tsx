import { cookies } from 'next/headers';

export default async function DebugCookiesPage() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const authCookie = cookieStore.get('auth');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie Debug</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">All Cookies ({allCookies.length})</h2>
          <div className="space-y-2">
            {allCookies.map((cookie, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded">
                <div><strong>Name:</strong> {cookie.name}</div>
                <div><strong>Value:</strong> {cookie.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Auth Cookie Status</h2>
          <div className="text-lg">
            {authCookie ? (
              <div className="text-green-600">
                ✅ Auth Cookie Found: <strong>{authCookie.value}</strong>
              </div>
            ) : (
              <div className="text-red-600">
                ❌ No Auth Cookie Found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <a
              href="/api/auth/logout"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </a>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </a>
            <a
              href="/profile"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
