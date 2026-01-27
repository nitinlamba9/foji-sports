import Link from 'next/link';
import Button from '../ui/Button';

export default function OffersBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-white font-semibold">Limited Time Offer</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Mega Sale Event
          </h2>
          
          <p className="text-xl lg:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Get up to 50% off on selected sports equipment and apparel. 
            Don't miss out on these amazing deals!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold text-white mb-2">50% OFF</div>
              <div className="text-orange-100">Selected Items</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold text-white mb-2">FREE</div>
              <div className="text-orange-100">Shipping Above ₹999</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold text-white mb-2">24HRS</div>
              <div className="text-orange-100">Flash Sale</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop?sale=true">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                Shop Sale Items
              </Button>
            </Link>
            <Link href="/coupons">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600">
                View All Coupons
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
