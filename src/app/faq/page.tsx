import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">What payment methods do you accept?</h2>
                <p className="text-gray-600">We currently accept Cash on Delivery (COD) for all orders. We're working on adding online payment methods soon.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">How long does delivery take?</h2>
                <p className="text-gray-600">Standard delivery takes 3-5 business days within Pilani. For other locations, delivery may take 5-7 business days.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Can I return or exchange products?</h2>
                <p className="text-gray-600">Yes, we offer a 7-day return policy. Products must be unused and in original packaging. Contact us for return arrangements.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Do you offer discounts on bulk orders?</h2>
                <p className="text-gray-600">Yes, we offer special pricing for bulk orders and team purchases. Please contact us directly for custom quotes.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">How can I track my order?</h2>
                <p className="text-gray-600">Once your order is shipped, we'll send you tracking information via email or SMS. You can also call us at +91 9877490621 for order status.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Do you have a physical store?</h2>
                <p className="text-gray-600">Yes! Visit our store at Indane Gas Godam Road, near Sabu College, Pilani, Rajasthan – 333031. We're open Monday-Saturday 9 AM - 8 PM.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
