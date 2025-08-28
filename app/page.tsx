import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import styles from './page.module.css';

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeIcon}>✨</span>
              <span>POWERED BY MICROCMS & MCP</span>
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleMain}>Sample Blog</span>
              <span className={styles.titleSub}>Modern Experience</span>
            </h1>
            <p className={styles.heroDescription}>
              Claude Desktop × microCMS で実現する次世代ブログプラットフォーム
            </p>
            <div className={styles.heroFeatures}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🤖</span>
                <span>AI記事作成</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>⚡</span>
                <span>リアルタイム更新</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🎨</span>
                <span>モダンデザイン</span>
              </div>
            </div>
          </div>
          <div className={styles.heroShapes}>
            <div className={styles.shape1}></div>
            <div className={styles.shape2}></div>
            <div className={styles.shape3}></div>
          </div>
        </div>
      </section>
      
      <section className={styles.articlesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>最新記事</h2>
          <p className={styles.sectionDescription}>
            最新のテクノロジーとトレンドについての記事をご覧ください
          </p>
        </div>
        <ArticleList articles={data.contents} />
        <Pagination totalCount={data.totalCount} />
      </section>
    </>
  );
}
