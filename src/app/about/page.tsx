export default function AboutPage() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Foji Sports</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Welcome to Foji Sports, your premier destination for high-quality sports equipment and apparel in Pilani, Rajasthan. 
              Founded with a passion for sports and fitness, we are committed to providing athletes and sports enthusiasts with 
              the best gear to help them achieve their goals.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To empower athletes and fitness enthusiasts by providing premium sports equipment and apparel that combines 
              quality, performance, and style.affordability. We believe everyone deserves access to the best sports gear, 
              regardless of their skill level or budget.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Foji Sports started as a small shop in Pilani with a simple vision: to bring world-class sports equipment 
              to local athletes. Over the years, we've grown into a trusted name in the sports community, serving 
              thousands of customers across Rajasthan and beyond.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Premium sports shoes for running, training, and specific sports</li>
              <li>High-performance sports apparel and activewear</li>
              <li>Professional-grade sports equipment for cricket, football, and more</li>
              <li>Fitness accessories and gym equipment</li>
              <li>Expert advice and personalized service</li>
            </ul>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-blue-600 text-3xl font-bold mb-2">Quality</div>
                <p className="text-gray-600">We only stock products that meet our high standards for quality and performance.</p>
              </div>
              <div className="text-center">
                <div className="text-blue-600 text-3xl font-bold mb-2">Service</div>
                <p className="text-gray-600">Our knowledgeable team is always ready to help you find the perfect gear.</p>
              </div>
              <div className="text-center">
                <div className="text-blue-600 text-3xl font-bold mb-2">Community</div>
                <p className="text-gray-600">We're proud to support local sports teams and events in our community.</p>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Visit Us</h2>
            <p className="text-gray-600">
              Come visit our store at Indane Gas Godam Road, near Sabu College, Pilani, Rajasthan – 333031. 
              Our friendly staff is ready to help you find exactly what you need to take your game to the next level.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
