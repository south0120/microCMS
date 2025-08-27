import { createClient } from 'microcms-js-sdk';
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
} from 'microcms-js-sdk';
import { notFound } from 'next/navigation';

// タグの型定義
export type Tag = {
  name: string;
} & MicroCMSContentId &
  MicroCMSDate;

// ライターの型定義
export type Writer = {
  name: string;
  profile: string;
  image?: MicroCMSImage;
} & MicroCMSContentId &
  MicroCMSDate;

// ブログの型定義
export type Blog = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  tags?: Tag[];
  writer?: Writer;
};

export type Article = Blog & MicroCMSContentId & MicroCMSDate;

// 環境変数の確認とフォールバック
const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY;

if (!MICROCMS_SERVICE_DOMAIN) {
  console.warn('MICROCMS_SERVICE_DOMAIN is not set. Some features may not work properly.');
}

if (!MICROCMS_API_KEY) {
  console.warn('MICROCMS_API_KEY is not set. Some features may not work properly.');
}

// Initialize Client SDK (環境変数が設定されている場合のみ)
export const client = MICROCMS_SERVICE_DOMAIN && MICROCMS_API_KEY 
  ? createClient({
      serviceDomain: MICROCMS_SERVICE_DOMAIN,
      apiKey: MICROCMS_API_KEY,
    })
  : null;

// ブログ一覧を取得
export const getList = async (queries?: MicroCMSQueries) => {
  if (!client) {
    return { contents: [], totalCount: 0, offset: 0, limit: 10 };
  }
  const listData = await client
    .getList<Blog>({
      endpoint: 'blog',
      queries,
    })
    .catch(notFound);
  return listData;
};

// ブログの詳細を取得
export const getDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  if (!client) {
    notFound();
  }
  const detailData = await client!
    .getListDetail<Blog>({
      endpoint: 'blog',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// タグの一覧を取得
export const getTagList = async (queries?: MicroCMSQueries) => {
  if (!client) {
    return { contents: [], totalCount: 0, offset: 0, limit: 10 };
  }
  const listData = await client
    .getList<Tag>({
      endpoint: 'tags',
      queries,
    })
    .catch(notFound);

  return listData;
};

// タグの詳細を取得
export const getTag = async (contentId: string, queries?: MicroCMSQueries) => {
  if (!client) {
    notFound();
  }
  const detailData = await client!
    .getListDetail<Tag>({
      endpoint: 'tags',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// ブログ記事を作成
export const createBlog = async (data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'revisedAt'>) => {
  if (!client) {
    throw new Error('microCMS client is not initialized');
  }
  
  const result = await client.create({
    endpoint: 'blog',
    content: data,
  });
  
  return result;
};
