import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './Header.module.css'

export default function Header() {
    const navItems = [
        { id: 0, title: 'Home', uri: '/' },
        { id: 1, title: 'Why?', uri: '/blog/4/about' },
        { id: 2, title: 'Blog', uri: '/blogs' },
        { id: 3, title: 'Books', uri: '/summaries' }
    ];

    let [hamburgerOpen, setHamburgerOpen] = useState(false);
    const router = useRouter();

    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen);
    }
    
    const toggleHamburgerAndNavigate = (href: string) => {
        setHamburgerOpen(!hamburgerOpen);
        router.push(href);
    }
    
    return <>
        <div className={styles.headerContent}>
            <div className={styles.logoRow}>
                <Link href="/">
                    <a><div className={styles.title}></div></a>
                </Link>
                <div className={hamburgerOpen ? `${styles.hamburger} ${styles.toggle}` : `${styles.hamburger}`} onClick={toggleHamburger}>
                    <div className={styles.bar1}></div>
                    <div className={styles.bar2}></div>
                    <div className={styles.bar3}></div>
                </div>
            </div>

            <div className={hamburgerOpen ? `${styles.hamburgerMenu} ${styles.hamburgerMenuOpened}` : `${styles.hamburgerMenu} ${styles.hamburgerMenuClosed}`}>
                {navItems.map((item) => (
                    <a key={item.id} 
                        className={hamburgerOpen ? `${styles.hamburgerNavItem} ${styles.active}` : `${styles.hamburgerNavItem}`}
                        onClick={() => toggleHamburgerAndNavigate(item.uri)}>{item.title}
                    </a>
                ))}
            </div>

            {/* desktop nav */}
            <div className={styles.navigation}>
                {navItems.map((item) => (
                    <Link key={item.id} href={item.uri}>
                        <a className={styles.navItem}>{item.title}</a>
                    </Link>
                ))}
            </div> 
        </div>
    </>
}