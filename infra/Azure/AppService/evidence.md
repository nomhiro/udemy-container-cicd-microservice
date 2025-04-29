# リソース作成
![alt text](image.png)

![alt text](image-1.png)

![alt text](image-2.png)

![alt text](image-3.png)

継続的デプロイをONにすると、ACRにPushした際に自動でデプロイされるようになります。
![alt text](image-5.png)

CORS設定
![alt text](image-4.png)

環境変数設定
![alt text](image-6.png)

# GitHubActionsでのCI/CD
https://learn.microsoft.com/ja-jp/azure/app-service/deploy-container-github-action?tabs=publish-profile&pivots=github-actions-containers-linux

SCM基本認証をONに
![alt text](image-7.png)

プロファイルのDownload
![alt text](image-8.png)

## GitHubにシークレット登録

### 認証用プロファイル

GitHub側でリポジトリシークレットを作成
![alt text](image-9.png)

Name：AZURE_WEBAPP_PUBLISH_PROFILE
Secret：ダウンロードしたプロファイルの内容をそのままペースト
![alt text](image-10.png)

![alt text](image-11.png)

### コンテナレジストリ用

![alt text](image-12.png)

Name：REGISTRY_USERNAME
Secret：acrudemylearn

Name：REGISTRY_PASSWORD
Secret：パスワード

![alt text](image-13.png)

### アプリで使う環境変数
COSMOS_DB_ENDPOINT と COSMOS_DB_KEY を登録
![alt text](image-14.png)

## yamlファイルの作成
```yaml
name: ToDo App Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - uses: azure/docker-login@v1
      with:
        login-server: acrudemylearn-b6gjgtfqcpedffhj.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    - run: |
        docker build . -t acrudemylearn-b6gjgtfqcpedffhj.azurecr.io/todoapp:${{ github.sha }}
        docker push acrudemylearn-b6gjgtfqcpedffhj.azurecr.io/todoapp:${{ github.sha }}