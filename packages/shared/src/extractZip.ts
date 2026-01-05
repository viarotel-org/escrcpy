import fs from 'node:fs'
import { chmodr } from 'chmodr'
import unzip from 'unzipper'

export async function extractZip(zipPath: string, extractPath: string) {
  if (!fs.existsSync(zipPath)) {
    throw new Error(`zipPath: ${zipPath} does not exist`)
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzip.Extract({ path: extractPath }))
      .on('close', async () => {
        try {
          await chmodr(extractPath, 0o755)
          resolve(undefined)
        }
        catch (err) {
          reject(err)
        }
      })
      .on('error', reject)
  })
}
