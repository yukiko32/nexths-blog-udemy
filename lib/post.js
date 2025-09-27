// path → ファイルやディレクトリのパスを操作するためのNode.js標準モジュール。
import path from "path";
// fs → ファイルを読み書きするためのNode.js標準モジュール。
import fs from "fs";
// gray-matter → Markdownファイルの先頭に書かれたYAML形式の「メタデータ（front matter）」をパースしてくれる便利ライブラリ
// npm i gray-matterをインストール
import matter from "gray-matter";
// 文字列をマークダウン形式にパースする
// npm i remark remark-htmlをインストール
import { remark } from "remark";
import html from "remark-html";

// postsディレクトリのパスを取得
// process.cwd() → 「今実行しているプロジェクトのルートディレクトリ」の絶対パスを返す
// path.join(...) → そこに "posts" をつなげて、postsフォルダの場所をフルパスで取得
// つまり「プロジェクト直下のpostsフォルダ」を指している
const postsDirectory = path.join(process.cwd(), "posts");

// mdファイルのデータを取り出す
export const getPostsData = () => {
  // fs.readdirSync(...) → フォルダの中のファイル名を配列で返す
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // fileName → たとえば "post1.md"→ 拡張子.mdを消す
    // この "id" が記事のURLなどに使える
    const id = fileName.replace(/\.md$/, ""); // ファイル名（id）

    // マークダウンファイルを文字列として読み取る
    // fullPath → posts/post1.md のようなフルパスになる
    const fullPath = path.join(postsDirectory, fileName);
    // ファイルを文字列として読み込む
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Markdownから以下のように分けてくれる
    // matterResult.data → { title: "サンプル記事", date: "2025-09-26" }
    // matterResult.content → "本文本文..."
    const matterResult = matter(fileContents);

    // id と データを返す
    // { id: "post1", title: "サンプル記事", date: "2025-09-26" }
    return { id, ...matterResult.data };
  });
  return allPostsData;
};

// [id].jsのgetStaticPathのreturnで使うpathを取得する（オブジェクトで返す必要がある）
export const getAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

// idに基づいてブログ投稿データを返す
export const getPostData = async (id) => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  // 文字列をマークダウン形式にパースする
  const blogContent = await remark().use(html).process(matterResult.content);
  const blogContentHTML = blogContent.toString();

  return {
    id, // id: idの省略
    blogContentHTML, // blogContentHTML: blogContentHTMLの省略
    ...matterResult.data, // { title: "サンプル記事", date: "2025-09-26" }を展開してくっつけてる
  };
};
