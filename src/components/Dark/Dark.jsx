import { ThemeContext } from "@/context/Theme/ThemeContext";
import React, { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Dark = () => {
  const { handleToggle, theme } = useContext(ThemeContext);

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        onChange={handleToggle}
        checked={theme === "dark"}
        hidden
      />
      <span className="text-xl">
        {theme === "dark" ? <FaSun /> : <FaMoon className="text-amber-400 " />}
      </span>
    </label>
  );
};

export default Dark;
