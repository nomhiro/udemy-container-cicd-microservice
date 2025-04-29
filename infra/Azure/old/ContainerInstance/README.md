https://learn.microsoft.com/ja-jp/azure/container-instances/container-instances-tutorial-deploy-app


postgres-container

Az CLIでコンテナー インスタンスを作成
```bash
az container create `
  --resource-group udemy-container-cicd `
  --name postgres-container `
  --image eduregistry01.azurecr.io/postgres:v1 `
  --registry-login-server eduregistry01.azurecr.io `
  --registry-username eduRegistry01 `
  --registry-password o=U9ODphCQ6LiC3ZCA4AaAbBvHLehZ=4 `
  --cpu 1 `
  --memory 1.5 `
  --ports 5432 `
  --environment-variables POSTGRES_USER=admin POSTGRES_PASSWORD=password POSTGRES_DB=mydb `
  --azure-file-volume-share-name postgres-volume `
  --azure-file-volume-account-name sapostgrescontainer `
  --azure-file-volume-mount-path /var/lib/postgresql/data `
  --os-type Linux
```


### ToDo Web APp

```bash
az container create `
  --resource-group udemy-container-cicd `
  --name todo-app-container `
  --image eduregistry01.azurecr.io/todo-app:v1 `
  --registry-login-server eduregistry01.azurecr.io `
  --registry-username eduRegistry01 `
  --registry-password o=U9ODphCQ6LiC3ZCA4AaAbBvHLehZ=4 `
  --cpu 1 `
  --memory 1.5 `
  --ports 3000 `
  --environment-variables NODE_ENV=production DB_HOST=postgres-container `
  --os-type Linux
```