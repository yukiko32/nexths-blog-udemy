import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/post";
import utilStyles from "../../styles/utils.module.css";

// 動的ルートをSSGで生成する（SSR）の場合は不要
// どのパスを静的に事前生成するか Next.js に教える
// paths の中身は[{ params: { id: "post1" } },{ params: { id: "post2" } },]
// これを Next.js が見て「ビルド時に /posts/post1, /posts/post2 のページを作ろう」と判断する
// returnの型は { paths, fallback: boolean or "blocking" }と決まっている
export const getStaticPaths = () => {
  const paths = getAllPostIds();

  return {
    paths,
    // falseにすると、pathsに含まれない場合は404エラーになる
    // trueにすると、pathsに含まれない場合は動的にページを生成する
    fallback: false,
  };
};

// SSG の場合は必須（SSR の場合は getServerSidePropsを使う）
// getStaticPathsの各ページごとに getStaticProps が呼ばれる
// → params = { id: "post1" } などが渡ってくる
// returnの型は props: {データ}と決まっている
// props: { postData }は props: { postData: postData }と同じ意味
// props に入れた値が、ページコンポーネント（ここでは下のPost）に渡される
export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
};

// getStaticProps が返した props.postData が→ Post({ postData }) の引数に注入される
const Post = ({ postData }) => {
  return (
    <Layout siteTitle={postData.title}>
      <article>
        <h1>{postData.title}</h1>
        <div className={utilStyles.lightText}>{postData.date}</div>
        <div dangerouslySetInnerHTML={{ __html: postData.blogContentHTML }} />
      </article>
    </Layout>
  );
};

export default Post;
