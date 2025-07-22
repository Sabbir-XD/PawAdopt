import React from 'react';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router';

const ErrorComponent = ({ errorType = "404", errorMessage = "Page Not Found" }) => {
  const getErrorDetails = () => {
    switch(errorType) {
      case "404":
        return {
          title: "404 - Page Not Found",
          message: "The page you're looking for doesn't exist or has been moved.",
          icon: <FaExclamationTriangle className="text-5xl" />,
        };
      case "500":
        return {
          title: "500 - Server Error",
          message: "Something went wrong on our end. Please try again later.",
          icon: <FaExclamationTriangle className="text-5xl" />,
        };
      case "403":
        return {
          title: "403 - Forbidden",
          message: "You don't have permission to access this resource.",
          icon: <FaExclamationTriangle className="text-5xl" />,
        };
      case "offline":
        return {
          title: "Offline",
          message: "You appear to be offline. Please check your internet connection.",
          icon: <FaExclamationTriangle className="text-5xl" />,
        };
      default:
        return {
          title: "Error Occurred",
          message: errorMessage,
          icon: <FaExclamationTriangle className="text-5xl" />,
        };
    }
  };

  const { title, message, icon } = getErrorDetails();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-teal-50 dark:bg-teal-900/20 transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg text-center bg-white dark:bg-gray-800 border-t-4 border-teal-500 dark:border-teal-400 transition-all duration-300">
        {/* Animated error icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 animate-pulse">
          <div className="text-teal-600 dark:text-teal-300">
            {icon}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-teal-800 dark:text-teal-100">
          {title}
        </h1>
        
        <p className="mb-6 text-teal-700 dark:text-teal-300">
          {message}
        </p>

        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FaHome className="mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-4 py-2 rounded-lg font-medium border border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-300 bg-white dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Additional helpful links */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Need help?</p>
          <div className="flex justify-center space-x-4">
            <a href="/contact" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
              Contact Support
            </a>
            <a href="/faq" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
              FAQ
            </a>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800 opacity-20"></div>
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800 opacity-20"></div>
    </div>
  );
};

export default ErrorComponent;