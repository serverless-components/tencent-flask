[![Serverless Python Flask Tencent Cloud](https://img.serverlesscloud.cn/20191226/1577347052683-flask_%E9%95%BF.png)](http://serverless.com)

# Tencent Flask Serverless Component

[简体中文](https://github.com/serverless-components/tencent-flask/blob/master/README.md) | English

## Introduction

Tencent [Flask](https://github.com/pallets/flask) Serverless Component, support Restful API deploy, not supportting Flask command.

## Content

1. [Prepare](#0-prepare)
1. [Install](#1-install)
1. [Create](#2-create)
1. [Configure](#3-configure)
1. [Deploy](#4-deploy)
1. [Remove](#5-Remove)

### 0. Prepare

Before using this component, you need create a flask project, then add `Flask` and `werkzeug` in `requirements.txt`. Like below:

```txt
Flask==1.0.2
werkzeug==0.16.0
```

Then create your API service entry file `app.py`, below is a example:

```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello Flash"

@app.route("/users")
def users():
    users = [{'name': 'test1'}, {'name': 'test2'}]
    return jsonify(data=users)

@app.route("/users/<id>")
def user(id):
    return jsonify(data={'name': 'test1'})
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
  component: '@serverless/tencent-flask'
  inputs:
    region: ap-guangzhou
    functionName: flask-function
    code: ./
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
      protocols:
        - https
      environment: release
```

- [More Options](https://github.com/serverless-components/tencent-flask/blob/master/docs/configure.md)

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
