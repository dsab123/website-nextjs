import Link from 'next/link';
import styles from './Header.module.css'

export default function Header() {
    const toggleHamburger = () => {
        console.log('toggled!');
    }

    const toggleHamburgerAndNavigate = () => {
        console.log('toggleHamburgerAndNavigate!');
    }

    const hamburgerOpen = () => {
         console.log('hamburgerOpen!');
    }

    const navigate = () => {
        console.log('navigate!');
    }

    const navItems = [
        { id: 0, title: 'Home', uri: '/' },
        { id: 1, title: 'About Me', uri: '/about' },
        { id: 2, title: 'Blog', uri: '/blogs' },
        { id: 3, title: 'Book Summaries', uri: '/summaries' }
    ];
    
    return <>
        <div className={styles.headerContent}>
            <div className={styles.logoRow}>
                <Link href="http://localhost:3000">
                    <a><div className={styles.title}></div></a>
                </Link>
                <div className={styles.hamburger} onClick={toggleHamburger}>
                    <div className={styles.bar1}></div>
                    <div className={styles.bar2}></div>
                    <div className={styles.bar3}></div>
                </div>
            </div>
        </div>

        <div className={styles.navigation}>
            {navItems.map((item) => (
                <Link key={item.id} href={item.uri}>
                    <a className={styles.navItem}>{item.title}</a>
                </Link>
            ))}
        </div> 
    </>
}