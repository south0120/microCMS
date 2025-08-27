// ブログアプリケーションのメインJS
class BlogApp {
    constructor() {
        this.articles = [];
        this.tags = [];
        this.currentPage = 1;
        this.articlesPerPage = 6;
        this.filteredArticles = [];
        this.activeTag = null;
        this.autoRefreshInterval = null;
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.loadData();
        this.setupEventListeners();
        this.setupAutoRefresh();
    }
    
    // データの読み込み（microCMSまたはサンプルデータ）
    async loadData() {
        try {
            // microCMSからデータを取得を試行
            await this.loadFromMicroCMS();
        } catch (error) {
            console.log('microCMSから取得できないため、サンプルデータを使用します:', error);
            this.loadSampleData();
        }
        
        this.renderTags();
        this.renderArticles();
    }
    
    // microCMSからデータを取得
    async loadFromMicroCMS() {
        // 環境変数の確認
        const serviceDomain = this.getMicroCMSConfig().serviceDomain;
        const apiKey = this.getMicroCMSConfig().apiKey;
        
        if (!serviceDomain || !apiKey) {
            throw new Error('microCMS configuration not found');
        }
        
        const response = await fetch(`https://${serviceDomain}.microcms.io/api/v1/blog`, {
            headers: {
                'X-MICROCMS-API-KEY': apiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // microCMSのデータを内部形式に変換
        this.articles = data.contents.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            content: item.content,
            tags: item.tags?.map(tag => tag.name) || [],
            date: new Date(item.publishedAt).toLocaleDateString('ja-JP'),
            author: item.writer?.name || '不明'
        }));
        
        // タグの抽出
        const allTags = new Set();
        this.articles.forEach(article => {
            article.tags.forEach(tag => allTags.add(tag));
        });
        this.tags = Array.from(allTags);
        
        // 初期状態では全記事を表示
        this.filteredArticles = [...this.articles];
        
        console.log(`microCMSから${this.articles.length}件の記事を取得しました`);
    }
    
    // microCMSの設定を取得
    getMicroCMSConfig() {
        // 環境変数またはローカルストレージから取得
        const config = {
            serviceDomain: localStorage.getItem('MICROCMS_SERVICE_DOMAIN') || window.MICROCMS_SERVICE_DOMAIN,
            apiKey: localStorage.getItem('MICROCMS_API_KEY') || window.MICROCMS_API_KEY
        };
        
        return config;
    }
    
    // サンプルデータの読み込み
    loadSampleData() {
        this.articles = [
            {
                id: 1,
                title: "JavaScript の最新機能について",
                description: "ES2024の新機能とモダンな開発手法について解説します",
                content: `# JavaScript の最新機能について

## ES2024の新機能

JavaScriptは毎年新しい機能が追加され、より便利で表現力豊かな言語に進化しています。

### 1. Array.prototype.toSorted()

配列をソートする新しいメソッドが追加されました：

\`\`\`javascript
const numbers = [3, 1, 4, 1, 5];
const sorted = numbers.toSorted(); // [1, 1, 3, 4, 5]
console.log(numbers); // 元の配列は変更されない: [3, 1, 4, 1, 5]
\`\`\`

### 2. Promise.withResolvers()

Promiseの作成がより簡潔になりました：

\`\`\`javascript
const { promise, resolve, reject } = Promise.withResolvers();

// 非同期処理
setTimeout(() => {
    resolve("成功!");
}, 1000);
\`\`\`

### まとめ

これらの新機能により、JavaScriptでの開発がより効率的になります。`,
                tags: ["JavaScript", "ES2024", "フロントエンド"],
                date: "2025-01-15",
                author: "田中太郎"
            },
            {
                id: 2,
                title: "Reactでのパフォーマンス最適化",
                description: "Reactアプリケーションのパフォーマンスを向上させるテクニック",
                content: `# Reactでのパフォーマンス最適化

## はじめに

Reactアプリケーションのパフォーマンスは、ユーザー体験に直接影響します。

## 最適化テクニック

### 1. React.memo

コンポーネントの不要な再レンダリングを防ぎます：

\`\`\`jsx
const MyComponent = React.memo(({ data }) => {
    return <div>{data.name}</div>;
});
\`\`\`

### 2. useCallback

関数の再作成を防ぎます：

\`\`\`jsx
const handleClick = useCallback(() => {
    // クリック処理
}, [dependencies]);
\`\`\`

### 3. useMemo

重い計算の結果をメモ化します：

\`\`\`jsx
const expensiveValue = useMemo(() => {
    return heavyCalculation(data);
}, [data]);
\`\`\`

## まとめ

これらのテクニックを適切に使用することで、Reactアプリケーションのパフォーマンスを大幅に改善できます。`,
                tags: ["React", "パフォーマンス", "最適化"],
                date: "2025-01-12",
                author: "佐藤花子"
            },
            {
                id: 3,
                title: "CSSグリッドレイアウトの基礎",
                description: "CSS Gridを使った現代的なレイアウト手法",
                content: `# CSSグリッドレイアウトの基礎

## CSS Gridとは

CSS Gridは、2次元のレイアウトシステムです。

## 基本的な使い方

### グリッドコンテナの作成

\`\`\`css
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
}
\`\`\`

### グリッドアイテムの配置

\`\`\`css
.grid-item {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
}
\`\`\`

## レスポンシブデザイン

\`\`\`css
.grid-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
\`\`\`

## まとめ

CSS Gridを使うことで、柔軟で保守性の高いレイアウトを作成できます。`,
                tags: ["CSS", "グリッド", "レイアウト"],
                date: "2025-01-10",
                author: "山田次郎"
            },
            {
                id: 4,
                title: "Node.jsでのAPI開発入門",
                description: "ExpressとNode.jsを使ったRESTful API の構築方法",
                content: `# Node.jsでのAPI開発入門

## ExpressでのAPI構築

Node.jsとExpressを使ったAPI開発の基礎を学びましょう。

## 環境セットアップ

\`\`\`bash
npm init -y
npm install express
\`\`\`

## 基本的なサーバー作成

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: '田中太郎' },
        { id: 2, name: '佐藤花子' }
    ]);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
\`\`\`

## REST API の設計

- GET: データの取得
- POST: データの作成
- PUT: データの更新
- DELETE: データの削除

## まとめ

Node.jsとExpressを使うことで、効率的にAPIを開発できます。`,
                tags: ["Node.js", "Express", "API"],
                date: "2025-01-08",
                author: "鈴木一郎"
            },
            {
                id: 5,
                title: "TypeScriptの型安全プログラミング",
                description: "TypeScriptを使った堅牢なアプリケーション開発",
                content: `# TypeScriptの型安全プログラミング

## TypeScriptとは

TypeScriptは、JavaScriptに静的型付けを追加した言語です。

## 基本的な型

\`\`\`typescript
// プリミティブ型
let name: string = "田中";
let age: number = 30;
let isActive: boolean = true;

// 配列型
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["太郎", "花子"];
\`\`\`

## インターフェース

\`\`\`typescript
interface User {
    id: number;
    name: string;
    email?: string; // オプショナル
}

const user: User = {
    id: 1,
    name: "田中太郎"
};
\`\`\`

## ジェネリクス

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}

const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);
\`\`\`

## まとめ

TypeScriptを使うことで、より安全で保守性の高いコードが書けます。`,
                tags: ["TypeScript", "型安全", "開発"],
                date: "2025-01-05",
                author: "高橋美咲"
            },
            {
                id: 6,
                title: "Webアクセシビリティの重要性",
                description: "すべてのユーザーが使いやすいWebサイトを作るために",
                content: `# Webアクセシビリティの重要性

## アクセシビリティとは

すべてのユーザーがWebサイトを利用できるようにすることです。

## 基本原則

### 1. 知覚可能（Perceivable）
- 十分なコントラスト比
- 代替テキスト
- キーボード操作対応

### 2. 操作可能（Operable）
\`\`\`html
<button aria-label="メニューを開く">☰</button>
<img src="logo.png" alt="会社ロゴ">
\`\`\`

### 3. 理解可能（Understandable）
- 明確なナビゲーション
- 一貫したUI
- エラーメッセージの提供

### 4. 堅牢（Robust）
- セマンティックHTML
- ARIA属性の適切な使用

## 実装例

\`\`\`html
<nav aria-label="メインナビゲーション">
    <ul>
        <li><a href="/" aria-current="page">ホーム</a></li>
        <li><a href="/about">会社概要</a></li>
    </ul>
</nav>
\`\`\`

## まとめ

アクセシビリティは、すべてのユーザーにとって重要な要素です。`,
                tags: ["アクセシビリティ", "Web", "UX"],
                date: "2025-01-03",
                author: "伊藤健太"
            }
        ];
        
        // タグの抽出
        const allTags = new Set();
        this.articles.forEach(article => {
            article.tags.forEach(tag => allTags.add(tag));
        });
        this.tags = Array.from(allTags);
        
        // 初期状態では全記事を表示
        this.filteredArticles = [...this.articles];
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        // フォーム送信
        document.getElementById('createPostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });
        
        // 検索
        document.getElementById('searchInput').addEventListener('input', () => {
            this.searchArticles();
        });
        
        // Enterキーでの検索
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchArticles();
            }
        });
        
        // モーダルの外側クリックで閉じる
        window.addEventListener('click', (e) => {
            const createModal = document.getElementById('createModal');
            const articleModal = document.getElementById('articleModal');
            
            if (e.target === createModal) {
                this.closeCreateModal();
            }
            if (e.target === articleModal) {
                this.closeArticleModal();
            }
        });
    }
    
    // タグの描画
    renderTags() {
        const container = document.getElementById('tagsContainer');
        container.innerHTML = '';
        
        // 全記事表示用のタグ
        const allTag = document.createElement('span');
        allTag.className = `tag ${this.activeTag === null ? 'active' : ''}`;
        allTag.textContent = 'すべて';
        allTag.onclick = () => this.filterByTag(null);
        container.appendChild(allTag);
        
        // 各タグ
        this.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = `tag ${this.activeTag === tag ? 'active' : ''}`;
            tagElement.textContent = tag;
            tagElement.onclick = () => this.filterByTag(tag);
            container.appendChild(tagElement);
        });
    }
    
    // タグによるフィルタリング
    filterByTag(tag) {
        this.activeTag = tag;
        this.currentPage = 1;
        
        if (tag === null) {
            this.filteredArticles = [...this.articles];
        } else {
            this.filteredArticles = this.articles.filter(article => 
                article.tags.includes(tag)
            );
        }
        
        this.renderTags();
        this.renderArticles();
    }
    
    // 記事検索
    searchArticles() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        this.currentPage = 1;
        
        if (searchTerm === '') {
            this.filteredArticles = this.activeTag === null 
                ? [...this.articles]
                : this.articles.filter(article => article.tags.includes(this.activeTag));
        } else {
            let searchBase = this.activeTag === null 
                ? this.articles
                : this.articles.filter(article => article.tags.includes(this.activeTag));
                
            this.filteredArticles = searchBase.filter(article =>
                article.title.toLowerCase().includes(searchTerm) ||
                article.description.toLowerCase().includes(searchTerm) ||
                article.content.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderArticles();
    }
    
    // 記事一覧の描画
    renderArticles() {
        const container = document.getElementById('articlesGrid');
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);
        
        if (articlesToShow.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d; grid-column: 1 / -1;">記事が見つかりませんでした。</p>';
        } else {
            container.innerHTML = '';
            
            articlesToShow.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'article-card';
                articleElement.onclick = () => this.openArticleModal(article);
                
                articleElement.innerHTML = `
                    <h3 class="article-title">${this.escapeHtml(article.title)}</h3>
                    <p class="article-description">${this.escapeHtml(article.description)}</p>
                    <div class="article-meta">
                        <span class="article-date">${article.date}</span>
                        <div class="article-tags">
                            ${article.tags.map(tag => 
                                `<span class="article-tag">${this.escapeHtml(tag)}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
                
                container.appendChild(articleElement);
            });
        }
        
        this.renderPagination();
    }
    
    // ページネーションの描画
    renderPagination() {
        const container = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = '';
        
        // 前ページボタン
        const prevButton = document.createElement('button');
        prevButton.textContent = '前';
        prevButton.disabled = this.currentPage === 1;
        prevButton.onclick = () => this.changePage(this.currentPage - 1);
        container.appendChild(prevButton);
        
        // ページ番号ボタン
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = this.currentPage === i ? 'active' : '';
            pageButton.onclick = () => this.changePage(i);
            container.appendChild(pageButton);
        }
        
        // 次ページボタン
        const nextButton = document.createElement('button');
        nextButton.textContent = '次';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.onclick = () => this.changePage(this.currentPage + 1);
        container.appendChild(nextButton);
    }
    
    // ページ変更
    changePage(page) {
        this.currentPage = page;
        this.renderArticles();
        
        // ページトップにスクロール
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 記事作成モーダルを開く
    openCreateModal() {
        document.getElementById('createModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // 記事作成モーダルを閉じる
    closeCreateModal() {
        document.getElementById('createModal').classList.remove('show');
        document.body.style.overflow = 'auto';
        document.getElementById('createPostForm').reset();
    }
    
    // 記事詳細モーダルを開く
    openArticleModal(article) {
        document.getElementById('articleTitle').textContent = article.title;
        document.getElementById('articleDate').textContent = article.date;
        
        // タグの表示
        const tagsContainer = document.getElementById('articleTags');
        tagsContainer.innerHTML = article.tags.map(tag => 
            `<span class="article-tag">${this.escapeHtml(tag)}</span>`
        ).join('');
        
        // MarkdownをHTMLに変換（簡易版）
        const htmlContent = this.parseMarkdown(article.content);
        document.getElementById('articleContent').innerHTML = htmlContent;
        
        document.getElementById('articleModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // 記事詳細モーダルを閉じる
    closeArticleModal() {
        document.getElementById('articleModal').classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // 新しい記事を作成
    createPost() {
        const formData = new FormData(document.getElementById('createPostForm'));
        const title = formData.get('title');
        const description = formData.get('description');
        const content = formData.get('content');
        const tagsString = formData.get('tags');
        
        if (!title || !content) {
            alert('タイトルと本文は必須です。');
            return;
        }
        
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        const newArticle = {
            id: this.articles.length + 1,
            title: title,
            description: description || '',
            content: content,
            tags: tags,
            date: new Date().toISOString().split('T')[0],
            author: 'ゲスト'
        };
        
        this.articles.unshift(newArticle);
        
        // タグを更新
        tags.forEach(tag => {
            if (!this.tags.includes(tag)) {
                this.tags.push(tag);
            }
        });
        
        // フィルタリングされた記事リストも更新
        if (this.activeTag === null || tags.includes(this.activeTag)) {
            this.filteredArticles.unshift(newArticle);
        }
        
        this.renderTags();
        this.renderArticles();
        this.closeCreateModal();
        
        // 成功メッセージを表示
        this.showMessage('記事が正常に投稿されました！', 'success');
    }
    
    // メッセージ表示
    showMessage(message, type = 'success') {
        const messageElement = document.createElement('div');
        messageElement.className = `${type}-message`;
        messageElement.textContent = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '20px';
        messageElement.style.right = '20px';
        messageElement.style.zIndex = '10000';
        messageElement.style.padding = '12px 24px';
        messageElement.style.borderRadius = '6px';
        messageElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 3000);
    }
    
    // HTMLエスケープ
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 簡易Markdownパーサー
    parseMarkdown(markdown) {
        let html = markdown;
        
        // ヘッダー
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // コードブロック
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // インラインコード
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // リンク
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // 太字
        html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
        
        // リスト
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // 段落
        html = html.split('\n\n').map(paragraph => {
            if (paragraph.trim() && 
                !paragraph.includes('<h') && 
                !paragraph.includes('<pre>') && 
                !paragraph.includes('<ul>')) {
                return `<p>${paragraph}</p>`;
            }
            return paragraph;
        }).join('');
        
        return html;
    }
    
    // 設定の読み込み
    loadSettings() {
        const settings = this.getStoredSettings();
        if (settings.serviceDomain) {
            document.getElementById('serviceDomain').value = settings.serviceDomain;
        }
        if (settings.apiKey) {
            document.getElementById('apiKey').value = settings.apiKey;
        }
        document.getElementById('autoRefresh').checked = settings.autoRefresh || false;
    }
    
    // 保存された設定を取得
    getStoredSettings() {
        return {
            serviceDomain: localStorage.getItem('MICROCMS_SERVICE_DOMAIN') || '',
            apiKey: localStorage.getItem('MICROCMS_API_KEY') || '',
            autoRefresh: localStorage.getItem('MICROCMS_AUTO_REFRESH') === 'true'
        };
    }
    
    // 設定を保存
    saveSettings(serviceDomain, apiKey, autoRefresh) {
        localStorage.setItem('MICROCMS_SERVICE_DOMAIN', serviceDomain);
        localStorage.setItem('MICROCMS_API_KEY', apiKey);
        localStorage.setItem('MICROCMS_AUTO_REFRESH', autoRefresh.toString());
    }
    
    // 設定モーダルを開く
    openSettingsModal() {
        this.loadSettings();
        document.getElementById('settingsModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // 設定モーダルを閉じる
    closeSettingsModal() {
        document.getElementById('settingsModal').classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // 接続テスト
    async testConnection() {
        const statusDiv = document.getElementById('connectionStatus');
        const serviceDomain = document.getElementById('serviceDomain').value;
        const apiKey = document.getElementById('apiKey').value;
        
        if (!serviceDomain || !apiKey) {
            statusDiv.innerHTML = 'サービスドメインとAPIキーを入力してください';
            statusDiv.className = 'connection-status error';
            return;
        }
        
        statusDiv.innerHTML = '接続テスト中...';
        statusDiv.className = 'connection-status loading';
        
        try {
            const response = await fetch(`https://${serviceDomain}.microcms.io/api/v1/blog?limit=1`, {
                headers: {
                    'X-MICROCMS-API-KEY': apiKey
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                statusDiv.innerHTML = `✅ 接続成功！${data.totalCount || 0}件の記事が見つかりました`;
                statusDiv.className = 'connection-status success';
            } else {
                statusDiv.innerHTML = `❌ 接続失敗 (${response.status}): 設定を確認してください`;
                statusDiv.className = 'connection-status error';
            }
        } catch (error) {
            statusDiv.innerHTML = `❌ 接続エラー: ${error.message}`;
            statusDiv.className = 'connection-status error';
        }
    }
    
    // 設定を保存してモーダルを閉じる
    saveSettingsAndClose() {
        const serviceDomain = document.getElementById('serviceDomain').value;
        const apiKey = document.getElementById('apiKey').value;
        const autoRefresh = document.getElementById('autoRefresh').checked;
        
        this.saveSettings(serviceDomain, apiKey, autoRefresh);
        this.closeSettingsModal();
        this.setupAutoRefresh();
        this.showMessage('設定を保存しました', 'success');
    }
    
    // microCMSから強制更新
    async refreshFromMicroCMS() {
        const refreshBtn = document.querySelector('.refresh-btn');
        refreshBtn.disabled = true;
        refreshBtn.textContent = '更新中...';
        
        try {
            await this.loadFromMicroCMS();
            this.renderTags();
            this.renderArticles();
            this.showMessage('記事を更新しました', 'success');
        } catch (error) {
            this.showMessage('更新に失敗しました: ' + error.message, 'error');
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄 更新';
        }
    }
    
    // 自動更新の設定
    setupAutoRefresh() {
        // 既存のインターバルをクリア
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        const settings = this.getStoredSettings();
        if (settings.autoRefresh) {
            // 5分間隔で自動更新
            this.autoRefreshInterval = setInterval(() => {
                this.refreshFromMicroCMS();
            }, 5 * 60 * 1000);
            
            console.log('自動更新が有効になりました（5分間隔）');
        }
    }
}

// グローバル関数（HTMLから呼び出し用）
function openCreateModal() {
    blogApp.openCreateModal();
}

function closeCreateModal() {
    blogApp.closeCreateModal();
}

function closeArticleModal() {
    blogApp.closeArticleModal();
}

function openSettingsModal() {
    blogApp.openSettingsModal();
}

function closeSettingsModal() {
    blogApp.closeSettingsModal();
}

function testConnection() {
    blogApp.testConnection();
}

function refreshFromMicroCMS() {
    blogApp.refreshFromMicroCMS();
}

function searchArticles() {
    blogApp.searchArticles();
}

// アプリケーションの初期化
let blogApp;
document.addEventListener('DOMContentLoaded', () => {
    blogApp = new BlogApp();
    
    // 設定フォームの送信イベント
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        blogApp.saveSettingsAndClose();
    });
});