# 本番環境 URL

- https://yumemi-codecheck.web.app/

# 使用ツール

- 基本
  - React
  - TypeScript
  - Webpack
  - Babel
  - SASS
- リンタ・フォーマッタ
  - ESLint
  - Prettier
- テスト
  - Jest
  - React Testing Library
- グラフ
  - Highcharts
- その他
  - dotenv
  - swr

# 開発

## 環境構築

- Node のインストール (バージョンは `.nvmrc` 参照)
- `.env` ファイルの作成
  - [RESAS](https://opendata.resas-portal.go.jp/docs/api/v1/index.html)の利用登録をして API キーを設定する

## コマンド

開発用のコマンドは `package.json` の `scripts` 参照

- 例：開発時に動かしておくと良いコマンド
  - 開発用サーバーの起動: `npm run start`
  - テストコマンド: `npm run test:watch`

# デプロイ

- GitHub の main ブランチにマージすると GitHub Actions により自動でデプロイされる
- ローカルからのデプロイ方法

  1. firebase コマンドをインストールしてログインしておく

  ```
  npm install -g firebase-tools
  firebase login
  ```

  2. `npm run deploy`
