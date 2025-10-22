import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { Logo } from './svgs/Logo';
import useScrollDirection from '../hooks/useScrollDirection';
import { useMediaQuery } from '../hooks/useMediaQuery';
import useTheme from '../hooks/useTheme';

import ThemeToggle from './ThemeToggle';

type navItem = {
  id: number
  title: string
  uri: string
}


export default function Header() {
  const navItems: navItem[] = [
    { id: 0, title: 'Home', uri: '/' },
    { id: 1, title: 'Why?', uri: '/blog/4/about' },
    { id: 2, title: 'Blog', uri: '/blogs' },
    { id: 3, title: 'Books I Like', uri: '/summaries' }
  ];

  const { activeTheme, setActiveTheme } =  useTheme();

  const mobile = useMediaQuery('(max-width: 768px)');

  const [paddingTop, setPaddingTop] = useState(0);

  const titleHeight = 65;

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [titleWidth, setTitleWidth] = useState(0);


  useEffect(() => {
    // mobile is undefined for a few renders due to the useMediaQuery hook
    if (mobile !== undefined) {
      setPaddingTop(mobile ? 10 : 20);
      setTitleWidth(mobile ? 120 : 400);
    }
  }, [mobile]);

  const scrollDirection = useScrollDirection();
  const router = useRouter();

  const toggleHamburgerAndNavigate = (href: string) => {
    setHamburgerOpen(!hamburgerOpen);
    router.push(href);
  };

  return <motion.div className={scrollDirection === 'down' ? `${styles.headerContent} ${styles.hide}` : `${styles.headerContent}`}
    style={{
      marginTop: paddingTop + 'px',
      marginBottom: mobile ? '' : '2rem'
    }}
  >
    <div className={styles.logoWrapper} style={{ overflow: 'hidden', backgroundColor: 'var(--background-color)', flexGrow: 1 }}>
      <Link legacyBehavior href="/">
        {mobile !== undefined ?
          <Logo height={titleHeight} width={titleWidth} theme={activeTheme as 'light' | 'dark'} mobile={mobile}></Logo>
          : <p></p>
        }
      </Link>

      <div className={hamburgerOpen ? `${styles.hamburger} ${styles.toggle}` : `${styles.hamburger}`} onClick={() => setHamburgerOpen(!hamburgerOpen)}>
        <div className={styles.bar1}></div>
        <div className={styles.bar2}></div>
        <div className={styles.bar3}></div>
      </div>

    </div>

    {/* mobile nav */}
    {mobile !== undefined && mobile == true &&
      <div className={hamburgerOpen ? `${styles.hamburgerMenu} ${styles.hamburgerMenuOpened}` : `${styles.hamburgerMenu} ${styles.hamburgerMenuClosed}`}>
        {navItems.map((item) => (
          <a href={'#' + item.uri}
            key={item.id}
            className={styles.hamburgerNavItem}
            onClick={(e) => { e.preventDefault(); toggleHamburgerAndNavigate(item.uri); }}>{item.title}
          </a>
        ))}
        <ThemeToggle className={styles.hamburgerNavItem} activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
      </div>
    }

    {/* desktop nav */}
    {mobile !== undefined && mobile == false &&
      <div className={styles.navigationWrapper} style={{backgroundColor: 'var(--background-color)'}}>
        <div className={styles.navigation}>
          {navItems.map((item) => (

            <Link legacyBehavior key={item.id} href={item.uri}>
              <a className={styles.navItem}>{item.title}</a>
            </Link>

          ))}
          <ThemeToggle className={styles.navItem} activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
        </div>
      </div>
    }

  </motion.div>;
}