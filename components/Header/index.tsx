import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoWrapper}>
            <Image
              src="/logo.svg"
              alt="SAMPLE"
              className={styles.logo}
              width={348}
              height={133}
              priority
            />
            <div className={styles.logoBadge}>
              <span className={styles.badgeText}>✨ POWERED BY MICROCMS</span>
            </div>
          </div>
        </Link>
        <nav className={styles.navigation}>
          <div className={styles.navItems}>
            <div className={styles.statusIndicator}>
              <div className={styles.pulse}></div>
              <span className={styles.statusText}>Live</span>
            </div>
          </div>
        </nav>
      </div>
      <div className={styles.headerGlow}></div>
    </header>
  );
}
