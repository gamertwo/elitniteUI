// Fixed useTheme.js
import { useState, useEffect } from "react"; 

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Note: In a real app, this would use localStorage
    // For now, just use default dark mode
    const saved = true; // localStorage.getItem('neural-circuit-theme');
    setIsDarkMode(saved);
  }, []);

  useEffect(() => {
    // Note: In a real app, this would save to localStorage
    // localStorage.setItem('neural-circuit-theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
};
