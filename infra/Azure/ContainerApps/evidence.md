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
