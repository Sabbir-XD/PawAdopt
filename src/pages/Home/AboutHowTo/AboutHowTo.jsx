import { FaPaw, FaHeart, FaHandsHelping, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutHowTo = () => {
  const features = [
    {
      icon: <FaSearch className="text-4xl mb-4" />,
      title: "Easy Search",
      description: "Find pets based on breed, age, size, and location with our smart filters."
    },
    {
      icon: <FaHeart className="text-4xl mb-4" />,
      title: "Save Lives",
      description: "Each adoption creates room for more animals in need at shelters."
    },
    {
      icon: <FaHandsHelping className="text-4xl mb-4" />,
      title: "Support System",
      description: "We provide guidance and resources for smooth post-adoption experiences."
    },
    {
      icon: <FaPaw className="text-4xl mb-4" />,
      title: "Verified Listings",
      description: "All pets come from trusted shelters and verified organizations."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold mb-4 tracking-wide text-teal-800 dark:text-teal-300">Our Mission</h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-teal-500 rounded"></div>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
            At <span className="font-semibold">PawAdopt</span>, we believe every pet deserves a loving home. Our platform bridges the gap between 
            shelters overflowing with animals and people eager to adopt. We’ve simplified the adoption process to make finding your 
            perfect companion simple, transparent, and rewarding.
          </p>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500 bg-white hover:bg-teal-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex justify-center text-teal-600 dark:text-teal-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-teal-800 dark:text-teal-300">
                {feature.title}
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-20 rounded-xl p-8 md:p-12 shadow-lg bg-teal-100 dark:bg-gray-800 dark:border dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-3xl font-bold mb-6 text-teal-900 dark:text-teal-300">Why We Started</h3>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                After volunteering at local shelters, our founders witnessed how many pets remain unnoticed for months—sometimes years—due to limited visibility.
              </p>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                PawAdopt was created to ensure every adoptable pet gets the exposure they deserve, connecting them with their forever families through an easy, caring process.
              </p>
            </div>
            <div className="md:w-1/2 p-6 rounded-lg shadow-md bg-white dark:bg-gray-700">
              <h4 className="text-2xl font-semibold mb-6 flex items-center text-teal-800 dark:text-teal-300">
                <FaPaw className="mr-2" /> How It Works
              </h4>
              <ul className="space-y-4">
                {[
                  "Browse pets from verified shelters in your area",
                  "Connect directly with the shelter or foster family",
                  "Schedule a meet-and-greet with your potential pet",
                  "Complete adoption paperwork with the shelter",
                  "Welcome your new family member home!"
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="rounded-full w-7 h-7 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-semibold bg-teal-500 text-white">
                      {idx + 1}
                    </span>
                    <span className="leading-snug text-gray-700 dark:text-gray-300">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHowTo;
