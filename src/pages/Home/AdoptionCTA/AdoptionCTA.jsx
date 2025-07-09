import { motion } from "framer-motion";
import { FaHeart, FaPaw, FaHome, FaHandHoldingHeart } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const AdoptionCTA = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Real adoption impact statistics
  const adoptionStats = [
    {
      value: "2M+",
      label: "Pets rescued annually",
      icon: <FaPaw className="text-amber-400" />,
    },
    {
      value: "85%",
      label: "Report increased happiness",
      icon: <FaHeart className="text-red-400" />,
    },
    {
      value: "10x",
      label: "Longer lifespan in homes",
      icon: <FaHome className="text-teal-400" />,
    },
  ];

  return (
    <section className="relative bg-gradient-to-r from-teal-700 to-cyan-800 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paw-print.png')]"></div>

      <div className="container mx-auto px-6 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left column - Text content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full">
              <FaHandHoldingHeart className="text-amber-300" />
              <span className="font-semibold">Make a Difference</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Change a Life -{" "}
              <span className="text-amber-300">Adopt Today</span>
            </h2>

            <p className="text-lg md:text-xl opacity-90">
              Every adoption creates space to save another animal in need.
              Discover the joy of giving a rescued pet their forever home.
            </p>

            {/* Adoption impact stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {adoptionStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2 + 0.4 }}
                  className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {stat.icon}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg transition-all"
              >
                <FaPaw />
                <span>Browse Adoptable Pets</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-3 bg-transparent border-2 border-white hover:bg-white/10 font-bold px-8 py-4 rounded-lg transition-all"
              >
                <FaHeart />
                <span>Learn About Adoption</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right column - Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            {/* Image collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Happy adopted dog"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white font-bold">Max, adopted 2023</div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Happy adopted cat"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white font-bold">Luna, adopted 2022</div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Happy family with adopted pet"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white font-bold">
                    The Rodriguez Family
                  </div>
                </div>
              </div>
            </div>

            {/* Floating testimonial badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-white text-teal-800 px-6 py-3 rounded-xl shadow-xl font-bold flex items-center gap-2 z-10"
            >
              <FaHeart className="text-red-500" />
              <span>200+ Happy Families</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdoptionCTA;
