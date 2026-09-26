import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
   const [theme, setTheme] = useState(() => {
      return localStorage.getItem("achilles-theme") || "dark";
   });

   useEffect(() => {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("achilles-theme", theme);
   }, [theme]);

   const toggleTheme = () => {
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
   };

   return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
}

export function useTheme() {
   return useContext(ThemeContext);
}
