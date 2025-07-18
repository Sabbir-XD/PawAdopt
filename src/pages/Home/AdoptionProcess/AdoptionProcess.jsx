import { FaSearch, FaHandshake, FaHome, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const AdoptionProcess = () => {
  const steps = [
    {
      icon: <FaSearch className="text-2xl text-teal-600 dark:text-teal-400" />,
      title: "Browse & Select",
      description: "Explore our verified pet profiles and find your potential match",
      color: "bg-teal-100 dark:bg-teal-900/50"
    },
    {
      icon: <FaHandshake className="text-2xl text-blue-600 dark:text-blue-400" />,
      title: "Meet & Greet",
      description: "Schedule a meeting with the pet and their caretaker",
      color: "bg-blue-100 dark:bg-blue-900/50"
    },
    {
      icon: <FaHome className="text-2xl text-amber-600 dark:text-amber-400" />,
      title: "Home Check",
      description: "Complete a simple home assessment (for some pets)",
      color: "bg-amber-100 dark:bg-amber-900/50"
    },
    {
      icon: <FaHeart className="text-2xl text-pink-600 dark:text-pink-400" />,
      title: "Finalize Adoption",
      description: "Complete paperwork and bring your new friend home!",
      color: "bg-pink-100 dark:bg-pink-900/50"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-teal-600 dark:text-teal-400">Adoption Process</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple steps to bring your new companion home
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`${step.color} p-6 rounded-2xl h-full flex flex-col transition-all duration-300 group-hover:shadow-lg`}>
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                
                {/* Step number */}
                <div className="mt-auto pt-6">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{index + 1}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Need Help Deciding?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our adoption specialists can guide you to find the perfect pet for your lifestyle
          </p>
          <button className="bg-white text-teal-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg shadow-md transition-all">
            Speak to an Advisor
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AdoptionProcess;