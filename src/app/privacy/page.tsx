import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                At Foji Sports, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy outlines how we collect, use, and protect your data when you use our website and services.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We may collect the following types of information when you interact with our website:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Shipping and billing addresses</li>
                <li>Order history and preferences</li>
                <li>Website usage data and cookies</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use your personal information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support</li>
                <li>Send order updates and marketing communications</li>
                <li>Improve our products and services</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We may use third-party service providers to assist us in operating our website and conducting our business. 
                These providers have access to your personal information only to perform these tasks on our behalf.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to access, update, or delete your personal information. 
                Please contact us if you wish to exercise these rights.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />Email: info@fojisports.com
                <br />Phone: +91 9877490621
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
