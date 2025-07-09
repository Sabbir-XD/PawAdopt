import { motion } from "framer-motion";
import { FaDog, FaCat, FaPaw, FaFish, FaDove, FaAngleRight } from "react-icons/fa";
import { GiRabbit, GiTurtle, GiParrotHead } from "react-icons/gi";
import { useInView } from "react-intersection-observer";
import { NavLink } from "react-router";

const PetsCategorySection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const petCategories = [
    {
      name: "Dogs",
      icon: <FaDog className="text-3xl md:text-4xl" />,
      color: "from-amber-500 to-amber-600",
      darkColor: "from-amber-600 to-amber-700",
      count: 124,
      description: "Loyal companions for every lifestyle",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/dog-paw-pattern.png')]"
    },
    {
      name: "Cats",
      icon: <FaCat className="text-3xl md:text-4xl" />,
      color: "from-gray-600 to-gray-700",
      darkColor: "from-gray-700 to-gray-800",
      count: 87,
      description: "Independent and affectionate friends",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/cat-paw-print.png')]"
    },
    {
      name: "Rabbits",
      icon: <GiRabbit className="text-3xl md:text-4xl" />,
      color: "from-pink-500 to-pink-600",
      darkColor: "from-pink-600 to-pink-700",
      count: 32,
      description: "Gentle and playful housemates",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/rabbit-pattern.png')]"
    },
    {
      name: "Fish",
      icon: <FaFish className="text-3xl md:text-4xl" />,
      color: "from-blue-500 to-blue-600",
      darkColor: "from-blue-600 to-blue-700",
      count: 45,
      description: "Beautiful aquatic pets for your home",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/fish-scale-pattern.png')]"
    },
    {
      name: "Birds",
      icon: <FaDove className="text-3xl md:text-4xl" />,
      color: "from-sky-500 to-sky-600",
      darkColor: "from-sky-600 to-sky-700",
      count: 28,
      description: "Colorful and melodic companions",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/feather-pattern.png')]"
    },
    {
      name: "Small Pets",
      icon: <FaPaw className="text-3xl md:text-4xl" />,
      color: "from-teal-500 to-teal-600",
      darkColor: "from-teal-600 to-teal-700",
      count: 39,
      description: "Hamsters, guinea pigs, and more",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/paw-print.png')]"
    },
    {
      name: "Reptiles",
      icon: <GiTurtle className="text-3xl md:text-4xl" />,
      color: "from-emerald-500 to-emerald-600",
      darkColor: "from-emerald-600 to-emerald-700",
      count: 18,
      description: "Fascinating scaly friends",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/reptile-skin.png')]"
    },
    {
      name: "Exotic Pets",
      icon: <GiParrotHead className="text-3xl md:text-4xl" />,
      color: "from-purple-500 to-purple-600",
      darkColor: "from-purple-600 to-purple-700",
      count: 12,
      description: "Unique animals needing special care",
      bgPattern: "bg-[url('https://www.transparenttextures.com/patterns/exotic-pattern.png')]"
    }
  ];

  // Duplicate categories for infinite marquee effect
  const marqueeCategories = [...petCategories, ...petCategories];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Find Pets by <span className="text-teal-600 dark:text-teal-400">Category</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our available pets by category to find your perfect companion
          </p>
        </motion.div>

        {/* Marquee Slider */}
        <div className="relative overflow-hidden py-4 mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex">
            <motion.div
              className="flex"
              animate={{
                x: ["0%", "-100%"],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {marqueeCategories.map((category, index) => (
                <div key={`marquee-${index}`} className="flex-shrink-0 px-4">
                  <div className={`bg-gradient-to-br ${category.color} ${category.darkColor} dark:${category.darkColor} rounded-full px-6 py-2 flex items-center`}>
                    <span className="text-white font-medium mr-2">{category.name}</span>
                    <div className="text-white/80">{category.icon}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {petCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <NavLink
                to={`/pets/${category.name.toLowerCase().replace(' ', '-')}`}
                className="block h-full"
              >
                <div className={`relative overflow-hidden rounded-2xl p-6 h-full flex flex-col items-start text-left ${category.bgPattern} bg-opacity-10 dark:bg-opacity-5 bg-cover`}>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} dark:${category.darkColor} opacity-90 group-hover:opacity-95 transition-opacity`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 w-full h-full flex flex-col">
                    <div className="bg-white/20 p-3 rounded-full mb-4 backdrop-blur-sm">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-white/90 text-sm mb-4">{category.description}</p>
                    
                    <div className="mt-auto flex justify-between items-end w-full">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white">
                        {category.count} available
                      </div>
                      <div className="text-white/80 group-hover:text-white transition-colors">
                        <FaAngleRight className="text-lg" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 border-2 border-white/20 group-hover:border-white/40 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <NavLink
            to="/pets"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all dark:focus:ring-teal-600"
          >
            <FaPaw className="mr-2" />
            View All Pets
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default PetsCategorySection;