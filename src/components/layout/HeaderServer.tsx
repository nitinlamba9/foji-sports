import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HeaderClient from './HeaderClient';

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  
  // Check if user is authenticated
  const isLoggedIn = !!authCookie;
  
  // Fetch user data if authenticated
  let userData = null;
  if (isLoggedIn) {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/me`, {
        cache: 'no-store',
        headers: {
          'Cookie': `auth=${authCookie.value}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        userData = data.user;
      }
    } catch (error) {
      console.error('Error fetching user data in header:', error);
    }
  }

  return <HeaderClient isLoggedIn={isLoggedIn} userData={userData} />;
}
