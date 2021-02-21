import testConfig from './config.test'
import devConfig from './config.dev'

console.log(process.env.NODE_ENV)

const cfg = process.env.NODE_ENV === 'test' ? testConfig : devConfig

export default cfg
