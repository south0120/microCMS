# microCMS MCP Server セットアップガイド

このプロジェクトはmicroCMS MCPサーバーを使用してブログ記事を動的に更新できる静的サイトです。

## 🚀 機能

- **静的ブログサイト**: GitHubページでホスト可能
- **動的コンテンツ更新**: microCMSからリアルタイムで記事を取得
- **MCP連携**: Claude DesktopからmicroCMSに直接記事投稿可能
- **自動更新**: 5分間隔での自動記事更新（オプション）
- **レスポンシブデザイン**: モバイル・タブレット対応

## 📋 必要なもの

1. **microCMSアカウント**
   - サービスID（例: your-service-domain）
   - APIキー（読み取り権限）

2. **Claude Desktop**（MCPサーバー使用時）
   - バージョン1.0以降

## ⚙️ セットアップ手順

### 1. microCMS側の設定

1. [microCMS](https://microcms.io/)にログイン
2. 新しいサービスを作成（または既存のサービスを使用）
3. APIスキーマを設定:
   ```json
   {
     "apiFields": [
       {
         "fieldId": "title",
         "displayName": "タイトル",
         "kind": "text",
         "required": true
       },
       {
         "fieldId": "description", 
         "displayName": "説明",
         "kind": "textArea"
       },
       {
         "fieldId": "content",
         "displayName": "本文",
         "kind": "richEditor",
         "required": true
       },
       {
         "fieldId": "tags",
         "displayName": "タグ",
         "kind": "relation",
         "multiple": true
       }
     ]
   }
   ```
4. APIキーを取得（API設定 → APIキー）

### 2. サイト側の設定

1. ブログサイトを開く
2. 右上の「⚙️ 設定」ボタンをクリック
3. 以下を入力:
   - **サービスドメイン**: your-service-domain
   - **APIキー**: microCMSのAPIキー
   - **自動更新**: 必要に応じて有効化
4. 「接続テスト」で動作確認
5. 「保存」をクリック

### 3. MCP サーバーの設定（Claude Desktop用）

#### 方法A: 設定ファイルを使用

1. `mcp-config.json`を編集:
```json
{
  "mcpServers": {
    "microcms": {
      "command": "npx",
      "args": [
        "-y",
        "microcms-mcp-server@latest",
        "--service-id", "YOUR_MICROCMS_SERVICE_ID",
        "--api-key", "YOUR_MICROCMS_API_KEY"
      ]
    }
  }
}
```

2. Claude Desktop の設定に追加:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%/Claude/claude_desktop_config.json`

#### 方法B: DXT ファイルを使用

1. [microcms-mcp-server releases](https://github.com/microcmsio/microcms-mcp-server/releases)から`microcms-mcp-server.dxt`をダウンロード
2. Claude Desktop の設定 > エクステンション を開く
3. dxtファイルをドラッグ＆ドロップ
4. サービスIDとAPIキーを設定

### 4. Claude Desktopの再起動

設定完了後、Claude Desktopを再起動してください。

## 🎯 使用方法

### ブログサイトでの操作

- **記事閲覧**: 記事カードをクリックして詳細表示
- **検索**: 検索ボックスでタイトル・本文を検索
- **タグフィルタ**: タグをクリックしてカテゴリ別表示
- **手動更新**: 「🔄 更新」ボタンでmicroCMSから最新記事を取得
- **設定変更**: 「⚙️ 設定」ボタンでAPI設定を変更

### Claude Desktopでの記事投稿

MCPサーバー設定後、以下のように依頼できます:

```
これはmicroCMSのAPIスキーマです。内容を理解してください
[APIスキーマのJSONを貼り付け]

microCMSのblogエンドポイントに以下の記事を投稿してください:

タイトル: "Next.jsでの開発効率化テクニック"
本文: "Next.jsを使った開発でよく使われる効率化のテクニックを紹介します..."
タグ: ["Next.js", "React", "開発効率化"]
```

### 自動記事同期

- ブラウザで設定を有効化すると5分間隔で自動更新
- MCPサーバー経由で投稿した記事が自動的にサイトに反映

## 🔧 トラブルシューティング

### よくある問題

1. **「microCMSから取得できません」エラー**
   - API設定を確認（サービスドメイン、APIキー）
   - ネットワーク接続を確認
   - CORSエラーの場合、HTTPSで配信されているか確認

2. **MCPサーバーが動作しない**
   - Node.js（v18以降）がインストールされているか確認
   - Claude Desktopの設定ファイルの構文を確認
   - Claude Desktopを完全に再起動

3. **記事が表示されない**
   - microCMSのAPI構造とコードの期待する構造が一致しているか確認
   - コンソールでエラーログを確認

### デバッグ方法

1. ブラウザの開発者ツール（F12）を開く
2. Consoleタブでエラーメッセージを確認
3. Networkタブで API リクエストの状況を確認

## 📁 ファイル構成

```
microCMS/
├── index.html              # メインページ
├── css/
│   └── style.css          # スタイルシート
├── js/
│   └── main.js            # JavaScript機能
├── mcp-config.json        # MCP設定例
├── MCP_SETUP_README.md    # このファイル
└── public/                # 静的アセット
    ├── logo.svg
    └── ...
```

## 🌐 デプロイメント

### GitHubページでの公開

1. リポジトリの Settings → Pages
2. Source: "Deploy from a branch"  
3. Branch: `main`
4. Folder: `/ (root)`
5. Save

数分で `https://<username>.github.io/<repository-name>/` でアクセス可能になります。

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'Add amazing feature'`
4. ブランチにプッシュ: `git push origin feature/amazing-feature`
5. プルリクエストを作成

## 📜 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 関連リンク

- [microCMS公式サイト](https://microcms.io/)
- [microCMS MCP Server](https://github.com/microcmsio/microcms-mcp-server)
- [Claude Desktop](https://claude.ai/desktop)
- [Model Context Protocol](https://modelcontextprotocol.io/)