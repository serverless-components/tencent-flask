const { generateId, getServerlessSdk } = require('./utils')

// set enough timeout for deployment to finish
jest.setTimeout(300000)

// the yaml file we're testing against
const instanceYaml = {
  org: 'orgDemo',
  app: 'appDemo',
  component: 'flask',
  name: `flask-integration-tests-${generateId()}`,
  stage: 'dev',
  inputs: {
    runtime: 'Python3.6',
    region: 'ap-guangzhou',
    apigatewayConf: { environment: 'test' }
  }
}

// get credentials from process.env but need to init empty credentials object
const credentials = {
  tencent: {}
}

// get serverless construct sdk
const sdk = getServerlessSdk(instanceYaml.org)

it('should successfully deploy flask app', async () => {
  const instance = await sdk.deploy(instanceYaml, { tencent: {} })
  expect(instance).toBeDefined()
  expect(instance.instanceName).toEqual(instanceYaml.name)
  // get src from template by default
  expect(instance.outputs.templateUrl).toBeDefined()
  expect(instance.outputs).toBeDefined()
  expect(instance.outputs.region).toEqual(instanceYaml.inputs.region)
  expect(instance.outputs.scf).toBeDefined()
  expect(instance.outputs.scf.runtime).toEqual(instanceYaml.inputs.runtime)
  expect(instance.outputs.apigw).toBeDefined()
  expect(instance.outputs.apigw.environment).toEqual(instanceYaml.inputs.apigatewayConf.environment)
})

it('should successfully remove flask app', async () => {
  await sdk.remove(instanceYaml, credentials)
  result = await sdk.getInstance(
    instanceYaml.org,
    instanceYaml.stage,
    instanceYaml.app,
    instanceYaml.name
  )

  // remove action won't delete the service cause the apigw have the api binded
  expect(result.instance.instanceStatus).toEqual('inactive')
})
