import { cookies } from 'next/headers';

export default async function TestSimplePage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
          <div className="text-lg">
            {auth ? (
              <div className="text-green-600">
                ✅ Logged In: {auth.value}
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Not Logged In
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Links</h2>
          <div className="space-y-4">
            <a href="/login" className="block p-3 bg-blue-100 rounded hover:bg-blue-200">
              Go to Login
            </a>
            <a href="/" className="block p-3 bg-green-100 rounded hover:bg-green-200">
              Go to Home
            </a>
            <a href="/profile" className="block p-3 bg-purple-100 rounded hover:bg-purple-200">
              Go to Profile
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <div className="text-sm space-y-2">
            <div><strong>Page Type:</strong> Server Component</div>
            <div><strong>Auth Cookie:</strong> {auth ? 'Present' : 'Missing'}</div>
            <div><strong>Current Time:</strong> {new Date().toISOString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
