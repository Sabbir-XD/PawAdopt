import { FaSearch, FaPhone, FaHome, FaFileAlt, FaPaw } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdoptionProcess = () => {
  const steps = [
    {
      step: 1,
      icon: <FaSearch className="text-2xl text-teal-600" />,
      title: "Browse Pets",
      description: "Use our advanced search to find pets matching your lifestyle",
      color: "bg-teal-100"
    },
    {
      step: 2,
      icon: <FaPhone className="text-2xl text-blue-600" />,
      title: "Schedule Visit",
      description: "Contact the shelter to arrange a meeting with your potential pet",
      color: "bg-blue-100"
    },
    {
      step: 3,
      icon: <FaFileAlt className="text-2xl text-amber-600" />,
      title: "Application",
      description: "Complete our simple adoption application form",
      color: "bg-amber-100"
    },
    {
      step: 4,
      icon: <FaHome className="text-2xl text-green-600" />,
      title: "Home Check",
      description: "We'll help ensure your home is ready for your new pet",
      color: "bg-green-100"
    },
    {
      step: 5,
      icon: <FaPaw className="text-2xl text-purple-600" />,
      title: "Adoption Day",
      description: "Finalize paperwork and bring your new family member home!",
      color: "bg-purple-100"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Simple <span className="text-teal-600">Adoption Process</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We've streamlined the process to make adoption easy and stress-free
          </p>
        </div>

        <div className="relative">
          {/* Timeline */}
          <div className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          <div className="grid lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline dot for desktop */}
                <div className="hidden lg:flex absolute -top-6 left-1/2 w-12 h-12 rounded-full bg-white border-4 border-teal-500 items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="font-bold text-gray-900">{step.step}</span>
                </div>

                <div className={`${step.color} p-6 rounded-xl h-full flex flex-col items-center text-center lg:min-h-[250px]`}>
                  <div className="flex lg:hidden mb-4 w-12 h-12 rounded-full bg-white border-4 border-teal-500 items-center justify-center">
                    <span className="font-bold text-gray-900">{step.step}</span>
                  </div>
                  <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Have Questions About Adopting?</h3>
          <p className="text-gray-700 mb-6">
            Our adoption specialists are available to guide you through every step of the process
          </p>
          <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all">
            <FaPhone />
            Contact Our Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdoptionProcess;