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
      
      <section className={styles.articlesSection}>
        <ArticleList articles={data.contents} />
        <Pagination totalCount={data.totalCount} />
      </section>
    </>
  );
}
