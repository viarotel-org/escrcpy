import os from 'node:os'
import { join } from 'node:path'

export const AUTOGLM_FILEPATH = join(os.homedir(), '.autoglm')
