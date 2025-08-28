import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/mcp_blog_logo.svg"
            alt="MPC Blog"
            className={styles.logo}
            width={348}
            height={133}
            priority
          />
        </Link>
      </div>
      <div className={styles.headerGlow}></div>
    </header>
  );
}
