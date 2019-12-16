# Tencent Flask Serverless Component

[简体中文](./README.md) | English

## Introduction

Flask Serverless Component for Tencent Cloud, support Restful API deploy, not supportting Flask command.

## Content

1. [Prepare](#0-prepare)
1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)
5. [Remove](#5-Remove)

### 0. Prepare

Before using this component, you need add `Flask` and  `werkzeug` for your requirements. Like below:

```txt
Flask==1.0.2
werkzeug==0.16.0
```

### 1. Install

Install the Serverless Framework globally:

```shell
$ npm install -g serverless
```

### 2. Create

Just create the following simple boilerplate:

```shell
$ touch serverless.yml
$ touch .env           # your Tencent api keys
```

Add the access keys of a [Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with `AdministratorAccess` in the `.env` file, using this format:

```
# .env
TENCENT_SECRET_ID=XXX
TENCENT_SECRET_KEY=XXX
```

- If you don't have a Tencent Cloud account, you could [sign up](https://intl.cloud.tencent.com/register) first.

### 3. Configure

```yml
# serverless.yml

MyComponent:
  component: "@serverless/tencent-flask"
  inputs:
    region: ap-guangzhou 
    functionName: flask-function
    codeUri: ./
    functionConf:
      timeout: 10
      memorySize: 128
      environment:
        variables:
          TEST: vale
      vpcConfig:
        subnetId: ''
        vpcId: ''
    apigatewayConf:
      protocol: https
      environment: release
```

- [More Options](./docs/configure.md)

### 4. Deploy

```shell
$ sls --debug
```

&nbsp;

### 5. Remove

```shell
$ sls remove --debug
```

### More Components

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
