import { Dispatch, SetStateAction } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

const ThemeToggle = (props: {className?: string, activeTheme?: string, setActiveTheme?: Dispatch<SetStateAction<string>>}) => {
  const inactiveTheme = props.activeTheme === "light" ? "dark" : "light";

  const mobile = useMediaQuery('(max-width: 768px)');
  let fontSize = mobile ? {fontSize: '20px'} : { fontSize: '12px'}

  return <a className={props.className} style={fontSize} href="/"
      onClick={(e) => { e.preventDefault(); props.setActiveTheme(inactiveTheme) }}>
      {inactiveTheme}?
    </a>
};

export default ThemeToggle;