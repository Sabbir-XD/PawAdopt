import { FaPaw, FaHandsHelping, FaHeartbeat, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/50 px-4 py-2 rounded-full mb-4"
          >
            <FaPaw className="text-teal-600 dark:text-teal-400" />
            <span className="font-medium text-teal-800 dark:text-teal-200">Our Story</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Connecting <span className="text-teal-600 dark:text-teal-400">Loving Homes</span> with <br /> Pets in Need
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            PawAdopt was born from a simple belief - every pet deserves a loving home, and every home deserves the joy of a pet.
          </motion.p>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                <FaHandsHelping className="text-teal-600 dark:text-teal-400 text-xl" />
              </div>
              How PawAdopt Works
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Browse Pets</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explore our verified listings of pets needing homes, with detailed profiles and photos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Connect</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Message shelters or foster families to learn more about the pet you're interested in.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Meet & Adopt</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Arrange a meeting and complete the adoption process with our guidance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-2xl p-8 shadow-lg text-white"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaHeartbeat className="text-xl" />
              </div>
              Our Mission
            </h3>
            
            <div className="space-y-6">
              <p>
                We created PawAdopt to revolutionize pet adoption by making it easier, more transparent, and more accessible for everyone involved.
              </p>
              
              <div className="bg-white/10 p-4 rounded-xl">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <FaUsers className="text-amber-200" />
                  Why We Do It
                </h4>
                <p className="text-white/90">
                  Over 6.5 million pets enter shelters each year. We're reducing that number by connecting adopters directly with pets in need, while supporting shelters with our platform.
                </p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-xl">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <FaPaw className="text-amber-200" />
                  Our Promise
                </h4>
                <p className="text-white/90">
                  Every pet on our platform is vet-checked, and every adoption center is verified. We maintain the highest standards to ensure happy matches.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center"
        >
          <div className="p-4">
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">10,000+</div>
            <p className="text-gray-600 dark:text-gray-400">Successful Adoptions</p>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">200+</div>
            <p className="text-gray-600 dark:text-gray-400">Partner Shelters</p>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">95%</div>
            <p className="text-gray-600 dark:text-gray-400">Happy Families</p>
          </div>
          <div className="p-4">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
            <p className="text-gray-600 dark:text-gray-400">Adoption Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;