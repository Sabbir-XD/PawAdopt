import { motion } from "framer-motion";
import { FaPaw, FaHeart, FaDog, FaSearch, FaPhone } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const Banner = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const [startCounters, setStartCounters] = useState(false);
  const { loading } = UseAuth();

  useEffect(() => {
    if (inView) {
      setStartCounters(true);
    }
  }, [inView]);

  return loading ? (
    <BannerSkeleton />
  ) : (
    <>
      <div
        ref={ref}
        className="relative bg-gradient-to-br from-teal-50 to-cyan-50 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/paw-print.png')]"></div>

        <div className="container mx-auto px-4 py-5 md:py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-6 text-center lg:text-left"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full"
              >
                <FaPaw className="text-yellow-300" />
                <span className="font-semibold">PetAdopt Rescue</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Give a <span className="text-teal-600">Home</span> to a{" "}
                <span className="text-amber-500">Loving Pet</span>
              </h1>

              <p className="text-lg text-gray-700">
                Every pet deserves a loving family. Browse our rescued animals
                and find your perfect companion today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
                >
                  <FaSearch className="text-sm" />
                  Browse Available Pets
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all"
                >
                  <FaPhone className="text-sm" />
                  Contact for Adoption
                </motion.button>
              </div>

              {/* Stats with CountUp */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-3 rounded-lg shadow-sm border border-teal-100"
                >
                  <div className="text-2xl font-bold text-teal-600">
                    {startCounters && (
                      <CountUp end={200} duration={2.5} suffix="+" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Pets Rescued</div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-3 rounded-lg shadow-sm border border-teal-100"
                >
                  <div className="text-2xl font-bold text-teal-600">
                    {startCounters && (
                      <CountUp end={150} duration={2.5} suffix="+" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Happy Adoptions</div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-3 rounded-lg shadow-sm border border-teal-100"
                >
                  <div className="text-2xl font-bold text-teal-600">
                    {startCounters && (
                      <CountUp end={50} duration={2.5} suffix="+" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Volunteers</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Pet Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Main pet image */}
                <img
                  src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Happy dog waiting for adoption"
                  className="w-full h-[500px] object-cover"
                />

                {/* Badge overlay */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2"
                >
                  <FaHeart />
                  <span>Adopt Me!</span>
                </motion.div>
              </div>

              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -left-6 text-5xl opacity-80"
              >
                🐾
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
