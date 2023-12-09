import { useEffect, useState } from "react";

const ThemeToggle = (props: {className?: string}) => {
  const [activeTheme, setActiveTheme] = useState(document.body.dataset.theme);
  const inactiveTheme = activeTheme === "light" ? "dark" : "light";

  useEffect(() => {
    document.body.dataset.theme = activeTheme;
    window.localStorage.setItem("theme", activeTheme);
  }, [activeTheme]);

  return <a className={props.className} style={{fontSize: '14px'}} href="/"
      onClick={(e) => { e.preventDefault(); setActiveTheme(inactiveTheme) }}>
      {inactiveTheme}?
    </a>
};

export default ThemeToggle;