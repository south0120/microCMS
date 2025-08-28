import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="SAMPLE"
          className={styles.logo}
          width={348}
          height={133}
          priority
        />
      </Link>
      <Link href="/create" className={styles.createLink}>
        記事を投稿
      </Link>
    </header>
  );
}
