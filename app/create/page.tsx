'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type FormData = {
  title: string;
  description: string;
  content: string;
};

export default function CreatePost() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('ブログ記事が正常に投稿されました！');
        setFormData({ title: '', description: '', content: '' });
        // 投稿後にホームページにリダイレクト
        setTimeout(() => router.push('/'), 2000);
      } else {
        setMessage(result.error || '投稿に失敗しました');
      }
    } catch (error) {
      console.error('投稿エラー:', error);
      setMessage('投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新しい記事を投稿</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="記事のタイトルを入力してください"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            説明
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="記事の簡単な説明を入力してください"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            本文 *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            className={styles.textarea}
            placeholder="記事の内容を入力してください（Markdownが使用できます）"
            rows={15}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? '投稿中...' : '記事を投稿'}
        </button>

        {message && (
          <div className={`${styles.message} ${message.includes('成功') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}