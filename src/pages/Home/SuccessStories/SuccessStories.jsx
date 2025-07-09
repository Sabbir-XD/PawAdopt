import { FaQuoteLeft, FaPaw } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      petName: "Max",
      petType: "Golden Retriever",
      image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
      quote: "Max filled our home with joy we didn't know was missing.",
      family: "The Rodriguez Family",
      adopted: "March 2023"
    },
    {
      id: 2,
      petName: "Luna",
      petType: "Siamese Cat",
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80",
      quote: "Luna's gentle purring is the best stress reliever after work.",
      family: "Sarah Johnson",
      adopted: "January 2023"
    },
    {
      id: 3,
      petName: "Rocky",
      petType: "Senior Beagle",
      image: "https://images.unsplash.com/photo-1589941013455-ed3db1b789cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
      quote: "Adopting a senior pet was the most rewarding decision.",
      family: "The Thompson Family",
      adopted: "November 2022"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-4">
            <FaPaw />
            <span className="font-medium">Happy Tails</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Adoption <span className="text-teal-600">Success Stories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet some of the pets who found their forever homes through PawAdopt
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={`${story.petName} the ${story.petType}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{story.petName}</h3>
                    <p className="text-gray-600">{story.petType}</p>
                  </div>
                  <div className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                    Adopted {story.adopted}
                  </div>
                </div>
                <div className="relative mb-4">
                  <FaQuoteLeft className="text-gray-300 text-2xl absolute -top-1" />
                  <p className="text-gray-700 pl-8 italic">"{story.quote}"</p>
                </div>
                <p className="text-sm text-gray-500">— {story.family}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all">
            <FaPaw />
            Share Your Story
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;