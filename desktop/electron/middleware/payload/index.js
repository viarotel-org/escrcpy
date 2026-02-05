import minimist from 'minimist'
import { decodePayload } from '@escrcpy/electron-setup/main'

function getPayload() {
  const args = minimist(window.process.argv.slice(1))
  return decodePayload(args.payload)
}

export default getPayload()
