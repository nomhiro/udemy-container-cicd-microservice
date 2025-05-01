# Container Apps
![alt text](image-4.png)

![alt text](image-5.png)

![alt text](image-6.png)

![alt text](image-7.png)

## ToDoアプリ Container Apps 環境
![alt text](image.png)

![alt text](image-1.png)

![alt text](image-2.png)

![alt text](image-3.png)

### ポートバインディング設定
ネットワーク設定で、ポートバインディングを設定します。
443→3000ポートにバインドします。
![alt text](image-9.png)

## notify-service Container Apps 環境

### ACRにPush
![alt text](image-10.png)

CRON式で5分ごとに設定。毎日9時などに設定可能。
![alt text](image-11.png)

![alt text](image-12.png)

![alt text](image-13.png)

## GitHubActionsでのCI/CD
https://learn.microsoft.com/ja-jp/azure/container-apps/github-actions#configuration

Container AppsのマネージドIDを有効にする。サービスプリンシパルIDをメモしておく。33e3aca3-76cc-43ef-a57e-d5bd3f3db199
![alt text](image-14.png)

Azure Container Registry の AcrPull ロールをコンテナー アプリのマネージド ID に割り当てる。
![alt text](image-15.png)

![alt text](image-16.png)

![alt text](image-17.png)

![alt text](image-18.png)

## GitHub リポジトリにシークレットを構成する

コンテナー アプリとコンテナー レジストリを含むリソース グループに対する共同作成者ロールを持つサービス プリンシパルを作成

```bash
az login
az ad sp create-for-rbac --name todoapp-credentials --role contributor --scopes /subscriptions/f80766c9-6be7-43f9-8369-d492efceff1e/resourceGroups/udemy-container-cicd --json-auth --output json
```

出力されるJsonをコピーしておく。

GitHubリポジトリのシークレットに登録する。
Name：AZURE_CREDENTIALS
Secret：Jsonをそのままペースト
![alt text](image-19.png)

### yamlファイルの作成
```yaml
name: ToDo App Workflow

# このワークフローは、リポジトリにプッシュされたときにトリガーされます
on: [push]

jobs:
  build:
    # Ubuntu 最新バージョンのランナーを使用
    runs-on: ubuntu-latest

    steps:
    # リポジトリのコードをチェックアウト
    - name: Checkout code
      uses: actions/checkout@v2

    # Docker Compose をインストール
    - name: Install Docker Compose
      run: |
        sudo apt-get update
        sudo apt-get install -y docker-compose

    # Azure Container Registry (ACR) にログイン
    - name: Log in to ACR
      uses: azure/docker-login@v1
      with:
        login-server: acrudemylearn-b6gjgtfqcpedffhj.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }} # ACRのユーザー名
        password: ${{ secrets.REGISTRY_PASSWORD }} # ACRのパスワード
    
    # Docker Compose を使用してイメージをビルドし、ACR にプッシュ
    - name: Build and Push Docker Image
      # 環境変数を設定（Cosmos DBのエンドポイントとキーを使用）
      env:
        COSMOS_DB_ENDPOINT: ${{ secrets.COSMOS_DB_ENDPOINT }}
        COSMOS_DB_KEY: ${{ secrets.COSMOS_DB_KEY }}
      # Docker Compose を使用してプロダクション用のイメージをビルド
      # ビルドしたイメージをACRにタグ付けしてプッシュ
      run: |
        docker-compose -f docker-compose.prod.yml build \
          --build-arg COSMOS_DB_ENDPOINT="${COSMOS_DB_ENDPOINT}" \
          --build-arg COSMOS_DB_KEY="${COSMOS_DB_KEY}"
        docker tag todo-app:latest acrudemylearn-b6gjgtfqcpedffhj.azurecr.io/todo-app:${{ github.sha }}
        docker push acrudemylearn-b6gjgtfqcpedffhj.azurecr.io/todo-app:${{ github.sha }}

  deploy:
    # デプロイフェーズはビルドフェーズが完了してから実行
    needs: build
    runs-on: ubuntu-latest

    steps:
    
    # Azureにログイン
    - name: Log in to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
        
    # Azure Container Apps にデプロイ
    - name: deploy Container App
      uses: azure/container-apps-deploy-action@v1
      with:
        # ACRの名前を指定
        acrName: acrudemylearn-b6gjgtfqcpedffhj
        # デプロイするコンテナアプリの名前
        containerAppName: todoapp
        # リソースグループの名前
        resourceGroup: udemy-container-cicd
        # デプロイするイメージを指定
        imageToDeploy: acrudemylearn-b6gjgtfqcpedffhj.azurecr.io/todo-app:${{ github.sha }}
        # 環境変数をコンテナアプリに渡す
        environmentVariables: "COSMOS_DB_ENDPOINT='${{ secrets.COSMOS_DB_ENDPOINT }}' COSMOS_DB_KEY='${{ secrets.COSMOS_DB_KEY }}' SENDER_EMAIL='${{ secrets.SENDER_EMAIL }}' EMAIL_PASSWORD='${{ secrets.EMAIL_PASSWORD }}' RECIPIENT_EMAIL='${{ secrets.RECIPIENT_EMAIL }}'"
```