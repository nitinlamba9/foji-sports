import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function TestAuthStatusPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Status Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cookie Status</h2>
          <div className="space-y-2">
            <div>
              <strong>Auth Cookie:</strong> {authCookie ? authCookie.value : 'Not found'}
            </div>
            <div>
              <strong>All Cookies:</strong>
            </div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(cookieStore.getAll(), null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </a>
            {' '}
            <a
              href="/profile"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Profile
            </a>
            {' '}
            <a
              href="/api/auth/logout"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>If auth cookie exists: You should see user menu in header</li>
            <li>If auth cookie is missing: You should see Login/Sign Up buttons</li>
            <li>Profile page should work when auth cookie exists</li>
            <li>Logout should clear the auth cookie</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
