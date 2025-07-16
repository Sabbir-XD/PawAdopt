import React from "react";
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-xl text-center">
    <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
      {title}
    </h2>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

export default StatCard;
