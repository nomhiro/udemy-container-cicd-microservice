# ベースイメージとしてPythonを使用
FROM python:3.12-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なファイルをコピー
COPY requirements.txt requirements.txt
COPY notify-service.py notify-service.py

# ライブラリをインストール
RUN pip install -r requirements.txt

# 環境変数を設定する場合（例: Docker Secrets）
ENV COSMOS_DB_ENDPOINT=<dummy_endpoint>
ENV COSMOS_DB_KEY=<dummy_key>
ENV SENDER_EMAIL=<dummy_email>
ENV EMAIL_PASSWORD=<dummy_password>
ENV RECIPIENT_EMAIL=<dummy_recipient>

# アプリケーションを起動
CMD ["python", "notify-service.py"]
