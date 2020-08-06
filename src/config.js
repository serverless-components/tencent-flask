const CONFIGS = {
  templateUrl: 'https://serverless-templates-1300862921.cos.ap-beijing.myqcloud.com/flask-demo.zip',
  compName: 'flask',
  compFullname: 'Flask',
  handler: 'sl_handler.handler',
  runtime: 'Python3.6',
  timeout: 3,
  memorySize: 128,
  namespace: 'default',
  description: 'Created by Serverless Component'
}

module.exports = CONFIGS
