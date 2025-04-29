# リソース作成

![alt text](image.png)

![alt text](image-1.png)

![alt text](image-2.png)

![alt text](image-3.png)

# (手動)コンテナのPush

```bash
docker-compose build
docker tag todo-app acrudemylearn-b6gjgtfqcpedffhj.azurecr.io/todo-app
```

```bash
az login
az acr login --name acrudemylearn
docker push acrudemylearn-b6gjgtfqcpedffhj.azurecr.io/todo-app
```

![alt text](image-4.png)

![alt text](image-5.png)

![alt text](image-6.png)