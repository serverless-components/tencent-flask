⚠️⚠️⚠️ 所有框架组件项目迁移到 [tencent-framework-components](https://github.com/serverless-components/tencent-framework-components).

[![Serverless Python Flask Tencent Cloud](https://img.serverlesscloud.cn/20191226/1577347052683-flask_%E9%95%BF.png)](http://serverless.com)

# 腾讯云 Flask Serverless Component

## 简介

腾讯云 [Flask](https://github.com/pallets/flask) Serverless Component, 支持 Restful API 服务的部署，不支持 Flask Command.

> 注 ：任何支持 WSGI(Web Server Gateway Interface) 的 Python 服务端框架都可以通过该组件进行部署，例如 Falcon 框架等。

## 目录

0. [准备](#0-准备)
1. [安装](#1-安装)
1. [配置](#2-配置)
1. [部署](#3-部署)
1. [移除](#4-移除)

### 0. 准备

在使用此组件之前，需要先初始化一个 Flask 项目，然后将 `Flask` 和 `werkzeug` 添加到依赖文件 `requirements.txt` 中，如下：

```txt
Flask==1.0.2
werkzeug==0.16.0
```

同时新增 API 服务 `app.py`，下面代码仅供参考:

```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello Flask"

@app.route("/users")
def users():
    users = [{'name': 'test1'}, {'name': 'test2'}]
    return jsonify(data=users)

@app.route("/users/<id>")
def user(id):
    return jsonify(data={'name': 'test1'})
```

### 1. 安装

通过 npm 全局安装 [serverless cli](https://github.com/serverless/serverless)

```bash
$ npm install -g serverless
```

### 2. 配置

本地创建 `serverless.yml` 文件，在其中进行如下配置

```bash
$ touch serverless.yml
```

```yml
# serverless.yml

component: flask
name: flashDemo
org: orgDemo
app: appDemo
stage: dev

inputs:
  src:
    hook: 'pip install -r requirements.txt -t ./'
    dist: ./
    exclude:
      - .env
  region: ap-guangzhou
  runtime: Python3.6
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
```

- [更多配置](https://github.com/serverless-components/tencent-flask/tree/master/docs/configure.md)

### 3. 部署

如您的账号未 [登陆](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，您可以直接通过 `微信` 扫描命令行中的二维码进行授权登陆和注册。

通过 `sls` 命令进行部署，并可以添加 `--debug` 参数查看部署过程中的信息

```bash
$ sls deploy --debug
```

### 4. 移除

通过以下命令移除部署的 API 网关

```bash
$ sls remove --debug
```

### 账号配置（可选）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件

```bash
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存

如果没有腾讯云账号，可以在此 [注册新账号](https://cloud.tencent.com/register)。

如果已有腾讯云账号，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 `SecretId` 和`SecretKey`.

```text
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

### 更多组件

可以在 [Serverless Components](https://github.com/serverless/components/blob/master/README.cn.md) repo 中查询更多组件的信息。

## License

MIT License

Copyright (c) 2020 Tencent Cloud, Inc.
