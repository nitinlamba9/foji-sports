'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    // Check authentication
    const authCookie = document.cookie.split(';').find(cookie => 
      cookie.trim().startsWith('auth=')
    );
    setAuth(!!authCookie);
  }, []);


  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-blue-900 to-black text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Unleash Your
                <span className="text-blue-400"> Athletic Potential</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Premium sports equipment and apparel for champions. Elevate your game with our curated selection of high-performance gear.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!auth ? (
                  <>
                    <Link
                      href="/shop"
                      className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/signup"
                      className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all transform hover:scale-105"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/shop"
                      className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/profile"
                      className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all transform hover:scale-105"
                    >
                      My Account
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-8 mt-8">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 8a1 1 0 001.169 1.409l5.5-6.317a1 1 0 001.414-1.414l-5.5 6.317a1 1 0 00-.169-1.409z"/>
                    <path d="M9.75 2.08a1 1 0 00-.788 0l-7 8a1 1 0 001.169 1.409l5.5-6.317a1 1 0 001.414-1.414l-5.5 6.317a1 1 0 00-.169-1.409z"/>
                  </svg>
                  <span className="text-sm text-gray-300">Free Shipping</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.446 2.293l1.414 1.414c.63.63 1.707.184 2.293-.446L7 13m0 0l2.293 2.293c.63.63 1.707.184 2.293-.446l1.414-1.414c.63-.63.184-1.707-.446-2.293L7 13m0 0l-2.293-2.293c-.63-.63-1.707-.184-2.293.446l-1.414-1.414c-.63-.63-.184-1.707.446-2.293L7 13"/>
                  </svg>
                  <span className="text-sm text-gray-300">Easy Returns</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 001.745.723 3.066 3.066 0 00-.482 1.07 3.066 3.066 0 001.474 0 2.931-2.931 3.066 3.066 0 00-2.931 2.931zm-7.44 5.668a3.066 3.066 0 00-1.745.723 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 00-.482-1.07 3.066 3.066 0 001.474 0 2.931 2.931 3.066 3.066 0 002.931-2.931z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10 10S2 17.523 2 12zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-gray-300">24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative">
                <img
                  src="/athlete-image.jpg"
                  alt="Athlete"
                  className="rounded-lg shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                  New Collection
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find exactly what you need for your sport</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Link href="/shop?category=footwear" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-square relative">
                  <img
                    src="/category-footwear.jpg"
                    alt="Footwear"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Footwear</h3>
                  <p className="text-gray-600">Running shoes, sneakers, and athletic footwear</p>
                  <div className="mt-4">
                    <span className="text-blue-600 font-semibold">Shop Now →</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=apparel" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-square relative">
                  <img
                    src="/category-apparel.jpg"
                    alt="Apparel"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Apparel</h3>
                  <p className="text-gray-600">Performance clothing and sportswear</p>
                  <div className="mt-4">
                    <span className="text-green-600 font-semibold">Shop Now →</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=equipment" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-square relative">
                  <img
                    src="/category-equipment.jpg"
                    alt="Equipment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Equipment</h3>
                  <p className="text-gray-600">Training gear and accessories</p>
                  <div className="mt-4">
                    <span className="text-purple-600 font-semibold">Shop Now →</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=accessories" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-square relative">
                  <img
                    src="/category-accessories.jpg"
                    alt="Accessories"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessories</h3>
                  <p className="text-gray-600">Bags, bottles, and more</p>
                  <div className="mt-4">
                    <span className="text-red-600 font-semibold">Shop Now →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Game?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of athletes who trust Foji Sports for their equipment
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </main>
  );
}
