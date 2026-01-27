import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Welcome to Foji Sports. These Terms & Conditions govern your use of our website and services. 
                By accessing or using our website, you agree to be bound by these terms.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Products and Services</h2>
              <p className="text-gray-600 mb-4">
                Foji Sports offers sports equipment, apparel, and accessories. We strive to provide accurate product 
                descriptions and pricing, but we reserve the right to correct any errors and make changes without notice.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Orders and Payment</h2>
              <p className="text-gray-600 mb-4">
                All orders are subject to product availability. We accept Cash on Delivery (COD) as the primary payment method. 
                Payment is due upon delivery of your order.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Shipping and Delivery</h2>
              <p className="text-gray-600 mb-4">
                We aim to deliver orders within 3-5 business days within Pilani and 5-7 business days for other locations. 
                Delivery times may vary based on product availability and location.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Returns and Exchanges</h2>
              <p className="text-gray-600 mb-4">
                We offer a 7-day return policy for unused products in original packaging. 
                Returns are subject to inspection and approval. Shipping costs for returns may apply.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Product Warranty</h2>
              <p className="text-gray-600 mb-4">
                Many of our products come with manufacturer warranties. Warranty claims should be directed to our customer service team 
                with proof of purchase.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content on this website, including text, images, and designs, is the property of Foji Sports and is protected 
                by copyright and other intellectual property laws.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Foji Sports shall not be liable for any indirect, incidental, or consequential damages arising from your use 
                of our products or website.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms & Conditions, please contact us:
                <br />Foji Sports
                <br />Indane Gas Godam Road, near Sabu College
                <br />Pilani, Rajasthan – 333031
                <br />Phone: +91 9877490621
                <br />Email: info@fojisports.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
