import { FaQuoteLeft, FaPaw } from "react-icons/fa";
import { motion } from "framer-motion";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      quote: "Adopting Max through PawAdopt was the best decision we ever made. The process was so smooth and now we can't imagine life without him!",
      author: "The Thompson Family",
      pet: "Golden Retriever",
      image: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      quote: "As first-time pet owners, we were nervous, but PawAdopt guided us through every step. Luna has brought so much joy to our apartment!",
      author: "Sarah & James",
      pet: "Domestic Shorthair",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      quote: "We wanted to adopt a senior pet, and PawAdopt helped us find the perfect match. Buddy may be 10 years old, but he's filled our home with youthful energy!",
      author: "Michael Rodriguez",
      pet: "Labrador Mix",
      image: "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/50 px-4 py-2 rounded-full mb-4"
          >
            <FaPaw className="text-teal-600 dark:text-teal-400" />
            <span className="font-medium text-teal-800 dark:text-teal-200">Happy Tails</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Real <span className="text-teal-600 dark:text-teal-400">Success Stories</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from families who found their perfect companions through PawAdopt
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <FaQuoteLeft className="text-teal-400 text-2xl mb-4" />
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">{story.quote}</p>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={story.image} 
                    alt={story.author} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-400"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{story.author}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Adopted {story.pet}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;