import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaw,
  FaHeart,
  FaSearch,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.2 });

  // Real adoption success stories
  const slides = [
    {
      id: 1,
      title: "Find Your Perfect Companion",
      subtitle: "Rescued pets make the most grateful friends",
      image: "https://i.ibb.co/YTN42p02/Adobe-Stock-784014485-Preview.jpg",
      cta: "Meet Our Pets",
      stats: "142 pets adopted this month",
    },
    {
      id: 2,
      title: "Senior Pets Need Love Too",
      subtitle: "Experience the joy of adopting a mature companion",
      image: "https://i.ibb.co/kNHFW9M/Adobe-Stock-731609447-Preview.jpg",
      cta: "View Senior Pets",
      stats: "Only 23% of seniors get adopted",
    },
    {
      id: 3,
      title: "Special Needs Heroes",
      subtitle: "These resilient pets will change your perspective",
      image:
        "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      cta: "Learn Their Stories",
      stats: "87 special needs adoptions this year",
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <div
      ref={ref}
      className="relative h-[450px] md:h-[550px] overflow-hidden dark:bg-gray-900"
    >
      {/* Background pattern - different for dark mode */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paw-print.png')] opacity-5 z-0 dark:opacity-10 dark:invert"></div>

      <AnimatePresence initial={false}>
        {slides.map(
          (slide, index) =>
            currentSlide === index && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center"
              >
                {/* Image with overlay - adjusted for dark mode */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70 dark:from-black/80 dark:via-black/50 dark:to-black/80"></div>
                </div>

                {/* Content - adjusted for dark mode */}
                <div className="container mx-auto px-6 relative z-10 text-white">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl"
                  >
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm dark:bg-black/20">
                      <FaPaw className="text-teal-600 dark:text-teal-400" />
                      <span className="font-semibold">PawAdopt Rescue</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                      {slide.title}
                    </h1>

                    <p className="text-xl md:text-2xl mb-8 max-w-lg">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all dark:bg-teal-600 dark:hover:bg-teal-700"
                      >
                        <FaSearch />
                        {slide.cta}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 bg-transparent border-2 border-white hover:bg-white/10 font-bold px-8 py-3 rounded-lg transition-all dark:hover:bg-black/20"
                      >
                        <FaPhone />
                        Contact Us
                      </motion.button>
                    </div>

                    <div className="mt-8 bg-white/20 px-4 py-3 rounded-lg backdrop-blur-sm inline-flex items-center gap-2 dark:bg-black/30">
                      <FaHeart className="text-teal-300 dark:text-teal-400" />
                      <span>{slide.stats}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation arrows - adjusted for dark mode */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full z-10 transition-all dark:bg-black/30 dark:hover:bg-black/50"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-white text-xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full z-10 transition-all dark:bg-black/30 dark:hover:bg-black/50"
        aria-label="Next slide"
      >
        <FaChevronRight className="text-white text-xl" />
      </button>

      {/* Pagination dots - adjusted for dark mode */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setAutoPlay(false);
              setTimeout(() => setAutoPlay(true), 10000);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index
                ? "bg-teal-400 w-6 dark:bg-teal-500"
                : "bg-white/50 dark:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
