import Link from 'next/link';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Unleash Your
              <span className="text-yellow-400"> Athletic</span>
              <br />
              Potential
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              Premium sports equipment and apparel for champions. 
              Gear up with the best in sports technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-sm text-blue-100">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">10K+</div>
                <div className="text-sm text-blue-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">24/7</div>
                <div className="text-sm text-blue-100">Support</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&h=600&fit=crop"
              alt="Sports equipment"
              className="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
