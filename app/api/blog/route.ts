import { NextRequest, NextResponse } from 'next/server';
import { createBlog } from '@/libs/microcms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, description, content, thumbnail, tags, writer } = body;
    
    // 必須フィールドのバリデーション
    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと本文は必須です' },
        { status: 400 }
      );
    }
    
    // microCMSに記事を投稿
    const result = await createBlog({
      title,
      description: description || '',
      content,
      thumbnail,
      tags,
      writer,
    });
    
    return NextResponse.json({
      success: true,
      id: result.id,
      message: 'ブログ記事が正常に投稿されました',
    });
  } catch (error) {
    console.error('ブログ投稿エラー:', error);
    return NextResponse.json(
      { error: 'ブログ記事の投稿に失敗しました' },
      { status: 500 }
    );
  }
}