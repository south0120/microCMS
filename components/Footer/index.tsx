import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.cr}>© SAMPLE. All Rights Reserved 2024</p>
        <p className={styles.powered}>Powered by microCMS & Next.js</p>
      </div>
    </footer>
  );
}
