import { FaPaw, FaHeart, FaHandsHelping, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const stats = [
    { value: '10,000+', label: 'Pets rescued', icon: <FaPaw className="text-amber-400" /> },
    { value: '85%', label: 'Adoption success rate', icon: <FaHeart className="text-red-400" /> },
    { value: '200+', label: 'Shelter partners', icon: <FaHandsHelping className="text-teal-400" /> },
    { value: '24h', label: 'Average match time', icon: <FaChartLine className="text-blue-400" /> }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-teal-600">Mission</span> to Change Pet Adoption
          </h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1586&q=80" 
              alt="Happy adopted dog"
              className="rounded-xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-teal-100 p-2 rounded-full">
                  <FaHeart className="text-teal-600" />
                </div>
                <h4 className="font-bold text-gray-900">Since 2018</h4>
              </div>
              <p className="text-gray-600 text-sm">
                We've been connecting pets with loving families for over 5 years
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Why PawAdopt Exists
            </h3>
            <p className="text-gray-700">
              After witnessing the challenges shelters face in finding homes for animals, our founder created PawAdopt to bridge the gap between pets in need and compassionate adopters through technology.
            </p>
            <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
              <p className="italic text-gray-700">
                "We believe every pet deserves a loving home, and every family deserves the joy of pet ownership. Our platform makes this connection seamless and rewarding."
              </p>
            </div>
            <p className="text-gray-700">
              Unlike traditional adoption sites, we focus on creating perfect matches through our proprietary compatibility algorithm and comprehensive pet profiles.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="bg-gray-100 p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
                <h4 className="font-bold">Search & Match</h4>
                <p className="text-white/90 text-sm">
                  Our algorithm suggests pets based on your lifestyle and preferences
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
                <h4 className="font-bold">Virtual Meet</h4>
                <p className="text-white/90 text-sm">
                  Schedule video calls with shelter staff to meet pets remotely
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
                <h4 className="font-bold">Adoption Process</h4>
                <p className="text-white/90 text-sm">
                  Complete paperwork and prepare for your new family member
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;