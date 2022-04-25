## Local development

#### **Dependencies**
* `node`
* `yarn`
* `docker`

#### **Launch project using docker-compose**
```
  $ cd docker
  $ docker-compose --env-file ../.env up -d
```

#### **Launch project using kubernetes**
```
  $ minikube start --driver=hyperkit
  $ minikube docker-env
  $ eval $(minikube docker-env)
  $ cd docker
  $ docker-compose build .
  $ kubectl apply -f secret.yaml
  $ kubectl apply -f db.yaml
  $ kubectl apply -f backend.yaml
```

#### **Install node packages**
```
  $ yarn
```

#### **Launch application**
```
  $ yarn start:dev
```
