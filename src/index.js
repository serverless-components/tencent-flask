const ensureIterable = require('type/iterable/ensure')
const path = require('path')
const { Component, utils } = require('@serverless/core')

const DEFAULTS = {
  handler: 'api_service.handler',
  runtime: 'Python3.6',
  exclude: ['.git/**', '.gitignore', '.serverless', '.DS_Store']
}

class TencentFlask extends Component {
  getDefaultProtocol(protocols) {
    if (protocols.map((i) => i.toLowerCase()).includes('https')) {
      return 'https'
    }
    return 'http'
  }

  async default(inputs = {}) {
    const appFile = path.join(path.resolve(inputs.code), 'app.py')
    if (!(await utils.fileExists(appFile))) {
      throw new Error(`app.py not found in ${inputs.code}`)
    }

    const pyRequirements = await this.load('@yugasun/python-requirements', 'pyRequirements')
    const pyRequirementsOutput = await pyRequirements(inputs.requirements)
    const shimsDir = path.join(__dirname, 'shims')
    inputs.include = ensureIterable(inputs.include, { default: pyRequirementsOutput.include })
    inputs.include.push(path.join(shimsDir, 'severless_wsgi.py'))
    inputs.include.push(path.join(shimsDir, 'api_service.py'))
    inputs.exclude = ensureIterable(inputs.exclude, { default: [] })
    inputs.exclude.push('.git/**', '.gitignore', '.serverless', '.DS_Store')
    inputs.handler = DEFAULTS.handler
    inputs.runtime = DEFAULTS.runtime

    const Framework = await this.load('@serverless/tencent-framework')

    const framworkOutpus = await Framework({
      ...inputs,
      ...{
        framework: 'flask'
      }
    })

    this.state = framworkOutpus
    await this.save()
    return framworkOutpus
  }

  async remove(inputs = {}) {
    const Framework = await this.load('@serverless/tencent-framework')
    await Framework.remove({
      ...inputs,
      ...{
        framework: 'flask'
      }
    })
    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = TencentFlask
