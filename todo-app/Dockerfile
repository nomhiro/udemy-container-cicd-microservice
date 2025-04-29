# ベースイメージとしてNode.jsを使用
FROM node:22-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# 環境変数をビルド時に受け取る
ARG COSMOS_DB_ENDPOINT
ARG COSMOS_DB_KEY

# 環境変数をランタイムに渡す
ENV COSMOS_DB_ENDPOINT=${COSMOS_DB_ENDPOINT}
ENV COSMOS_DB_KEY=${COSMOS_DB_KEY}

# アプリケーションコードをコピー
COPY . .

# アプリケーションをビルド
RUN NODE_ENV=production npm run build

# 実行環境用の軽量イメージを使用
FROM node:22-alpine AS production

# 作業ディレクトリを設定
WORKDIR /app

# 必要なファイルのみをコピー
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]
