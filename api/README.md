<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Api from Ecommerce by <a href="https://github.com/nestjs/nest" target="_blank">Savecoders</a> implement Nest Framework</p>
   
## Description

This an api from Ecommerce

## Installation

```bash
 pnpm install
```

## Running the app

```bash
# development
 pnpm run start

# watch mode

 pnpm run start:dev

# production mode

 pnpm run start:prod
```

## Up Docker

```bash
docker-compose --env-file .env up -d
```

> [!NOTE]
> Docker-compose read default envirioment file `.env` you have rename `.env.template` and change the value form variables

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
