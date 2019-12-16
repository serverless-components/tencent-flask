const path = require('path')
const { Component, utils } = require('@serverless/core')

const DEFAULTS = {
  handler: 'api_service.handler',
  runtime: 'Python3.6',
  exclude: ['.git/**', '.gitignore', '.serverless', '.DS_Store']
}

class TencentFlask extends Component {
  /**
   * prepare create function inputs
   * @param {object} inputs inputs
   */
  async prepareInputs(inputs = {}) {
    const len = 6
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const maxPos = chars.length
    let result = ''
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos))
    }

    const shimsDir = path.join(__dirname, 'shims')
    inputs.include = [
      path.join(shimsDir, 'severless_wsgi.py'),
      path.join(shimsDir, 'api_service.py')
    ]
    inputs.exclude = inputs.exclude || ['.git/**', '.gitignore', '.serverless', '.DS_Store']
    inputs.handler = inputs.handler || DEFAULTS.handler
    inputs.runtime = inputs.runtime || DEFAULTS.runtime
    inputs.name = inputs.functionName || 'FlaskComponent_' + result
    inputs.codeUri = inputs.codeUri || process.cwd()

    const appFile = path.join(path.resolve(inputs.codeUri), 'app.py')

    if (!(await utils.fileExists(appFile))) {
      throw new Error(`app.py not found in ${inputs.codeUri}`)
    }

    if (inputs.functionConf) {
      inputs.timeout = inputs.functionConf.timeout ? inputs.functionConf.timeout : 3
      inputs.memorySize = inputs.functionConf.memorySize ? inputs.functionConf.memorySize : 128
      if (inputs.functionConf.environment) {
        inputs.environment = inputs.functionConf.environment
      }
      if (inputs.functionConf.vpcConfig) {
        inputs.vpcConfig = inputs.functionConf.vpcConfig
      }
    }
    if (!inputs.requirements) {
      inputs.requirements = {}
    }
    inputs.requirements.include = inputs.include
    inputs.requirements.runtime = inputs.runtime.toLowerCase()
    inputs.requirements.codeUri = inputs.codeUri
    if (!inputs.requirements.dockerizePip) {
      inputs.requirements.pythonBin = 'python'
    }

    return inputs
  }

  async default(inputs = {}) {
    inputs = await this.prepareInputs(inputs)

    const pyRequirements = await this.load('@yugasun/python-requirements', 'pyRequirements')
    const pyRequirementsOutput = await pyRequirements(inputs.requirements)

    inputs.include = pyRequirementsOutput.include

    const tencentCloudFunction = await this.load('@serverless/tencent-scf')
    const tencentApiGateway = await this.load('@serverless/tencent-apigateway')

    const tencentCloudFunctionOutputs = await tencentCloudFunction(inputs)
    const apigwParam = {
      serviceName: inputs.serviceName,
      description: 'Serverless Framework tencent-flask Component',
      serviceId: inputs.serviceId,
      region: inputs.region,
      protocol:
        inputs.apigatewayConf && inputs.apigatewayConf.protocol
          ? inputs.apigatewayConf.protocol
          : 'http',
      environment:
        inputs.apigatewayConf && inputs.apigatewayConf.environment
          ? inputs.apigatewayConf.environment
          : 'release',
      endpoints: [
        {
          path: '/',
          method: 'ANY',
          function: {
            isIntegratedResponse: true,
            functionName: tencentCloudFunctionOutputs.Name
          }
        }
      ]
    }

    if (inputs.apigatewayConf && inputs.apigatewayConf.auth) {
      apigwParam.endpoints[0].usagePlan = inputs.apigatewayConf.usagePlan
    }
    if (inputs.apigatewayConf && inputs.apigatewayConf.auth) {
      apigwParam.endpoints[0].auth = inputs.apigatewayConf.auth
    }

    const tencentApiGatewayOutputs = await tencentApiGateway(apigwParam)
    const outputs = {
      region: inputs.region,
      functionName: inputs.name,
      apiGatewayServiceId: tencentApiGatewayOutputs.serviceId,
      url: `${tencentApiGatewayOutputs.protocol}://${tencentApiGatewayOutputs.subDomain}/${tencentApiGatewayOutputs.environment}/`
    }

    await this.save()

    return outputs
  }

  async remove() {
    const tencentCloudFunction = await this.load('@serverless/tencent-scf')
    const tencentApiGateway = await this.load('@serverless/tencent-apigateway')

    await tencentCloudFunction.remove()
    await tencentApiGateway.remove()

    return {}
  }
}

module.exports = TencentFlask
