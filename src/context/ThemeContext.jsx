import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem('tradelog_theme') || 'dark'
  );
  const [currency, setCurrencyState] = useState(
    localStorage.getItem('tradelog_currency') || 'INR'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('tradelog_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const setCurrency = (c) => {
    setCurrencyState(c);
    localStorage.setItem('tradelog_currency', c);
  };

  return (
    <ThemeContext.Provider value={{ theme, currency, toggleTheme, setCurrency }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
