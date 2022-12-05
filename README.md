## Local development

#### **Dependencies**
* `node`
* `yarn`
* `docker`

#### **Env variables**
Create `.env` file. Required variables can be find in `.env-example` file

#### **Launch project using docker-compose**
```
  $ cd docker
  $ docker-compose --env-file ../.env up -d
```

#### **Install node packages**
```
  $ yarn
```

#### **Launch application**
```
  $ yarn start:dev
```
