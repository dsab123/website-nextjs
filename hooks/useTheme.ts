import { useEffect, useState } from 'react';

export default function useTheme() {
  const [activeTheme, setActiveTheme] = useState(window.localStorage.getItem('theme'));

  useEffect(() => {
    console.log('changed theme in useTheme to: ' + activeTheme);

    document.body.dataset.theme = activeTheme;
    window.localStorage.setItem('theme', activeTheme);
  }, [activeTheme]);

  return { activeTheme, setActiveTheme };
};