import { motion } from 'framer-motion';
import { FaPaw, FaHeart, FaDog, FaCat, FaDonate } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';

const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-500 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paw-print.png')]"></div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Left side - Text content */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <FaPaw className="text-yellow-300" />
              <span className="font-semibold">PetAdopt Community</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your <span className="text-yellow-300">Furry</span> Friend
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              Join thousands of happy pets and owners in our community. 
              Adopt, donate, or volunteer to make a difference today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                <FaDog /> Browse Pets
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <FaDonate /> Donate Now
              </motion.button>
            </div>
          </div>
          
          {/* Right side - Stats cards */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="text-4xl font-bold text-yellow-300 flex items-center gap-2">
                <FaHeart className="text-pink-400" />
                1,200+
              </div>
              <p className="mt-2 opacity-90">Pets Adopted</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="text-4xl font-bold text-yellow-300 flex items-center gap-2">
                <FaCat className="text-cyan-300" />
                500+
              </div>
              <p className="mt-2 opacity-90">Happy Cats</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="text-4xl font-bold text-yellow-300 flex items-center gap-2">
                <FaDog className="text-amber-500" />
                700+
              </div>
              <p className="mt-2 opacity-90">Happy Dogs</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="text-4xl font-bold text-yellow-300 flex items-center gap-2">
                <GiCash className="text-green-300" />
                $50k+
              </div>
              <p className="mt-2 opacity-90">Donations</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating pets decoration (responsive) */}
      <div className="hidden lg:block">
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-10 text-4xl opacity-80"
        >
          🐕
        </motion.div>
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-20 text-4xl opacity-80"
        >
          🐈
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;