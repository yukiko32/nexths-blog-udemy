import Head from "next/head";
import Link from "next/link";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";

const Layout = ({ children, home, siteTitle }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <img
              className={`${utilStyles.borderCircle} ${styles.headerHomeImage}`}
              src="/images/profile.png"
              width="80px"
            />
            <h1 className={utilStyles.heading2Xl}>Neige Code</h1>
          </>
        ) : (
          <>
            <img
              className={`${utilStyles.borderCircle}`}
              src="/images/profile.png"
              width="80px"
            />
            <h1 className={utilStyles.heading2Xl}>Neige Code</h1>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div>
          <Link href={"/"}>ホームへ戻る</Link>
        </div>
      )}
    </div>
  );
};

export default Layout;
