import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout, { siteTitle } from "../components/Layout";
import utilStyles from "../styles/utils.module.css";
import { getPostsData } from "../lib/post";

// SSG（静的ページ）の場合
export const getStaticProps = async () => {
  const allPostsData = getPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

// SSR（サーバーサイドレンダリング）の場合
// export const getServerSideProps = async (context) => {
//   return {
//     props: {
//       // コンポーネントに渡すためのprops
//     },
//   };
// };

export default function Home({ allPostsData }) {
  return (
    <Layout home siteTitle={"Next.js blog"}>
      <section className={utilStyles.headingMd}>
        <p>2025/04~プログラミング学習中です。</p>
      </section>
      <section>
        <h2 className={styles.centerText}>📝エンジニアのブログ</h2>
        <div className={styles.grid}>
          {allPostsData.map(({ id, title, date, thumbnail }) => (
            <article key={id} className={styles.centerText}>
              <Link href={`/posts/${id}`}>
                <img src={`${thumbnail}`} className={styles.thumbnailImage} />
              </Link>
              <Link href={`/posts/${id}`} className={utilStyles.boldText}>
                {title}
              </Link>
              <br />
              <small className={utilStyles.lightText}>{date}</small>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
