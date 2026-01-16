import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { Screenshot } from './types'
import { runAdbCommand } from './utils'
/**
 * Take a screenshot and return it as a base64 encoded string.
 * Similar to the Python version, saves to temp file first then converts to base64.
 */
export async function getScreenshot(
  deviceId?: string,
  timeout: number = 10,
  quality: number = 80,
): Promise<Screenshot> {
  const tempPath = join(tmpdir(), `screenshot_${randomUUID()}.png`)

  try {
    // Get screen dimensions first
    const dimensionResult = await runAdbCommand(deviceId, ['shell', 'wm', 'size'])

    // Parse dimensions
    const dimensionMatch = dimensionResult.stdout.match(/Physical size: (\d+)x(\d+)/)
    if (!dimensionMatch) {
      throw new Error('Failed to get screen dimensions')
    }

    const width = Number.parseInt(dimensionMatch[1], 10)
    const height = Number.parseInt(dimensionMatch[2], 10)

    // Take screenshot and save to device temp location
    const screenshotResult = await runAdbCommand(deviceId, ['shell', 'screencap', '-p', '/sdcard/tmp_screenshot.png'], timeout * 1000)

    // Check for screenshot failure (sensitive screen)
    const output = screenshotResult.stdout + screenshotResult.stderr
    if (output.includes('Status: -1') || output.includes('Failed')) {
      return createFallbackScreenshot(true)
    }

    // Pull screenshot to local temp path
    await runAdbCommand(deviceId, ['pull', '/sdcard/tmp_screenshot.png', tempPath], timeout * 5000)

    // Read and encode image
    // const imageBuffer = await readFile(tempPath)
    // const base64Data = imageBuffer.toString('base64')

    const buffer = await sharp(tempPath)
      .resize({
        width: 480,
        withoutEnlargement: true,
        fastShrinkOnLoad: true,
      })
      .webp({
        lossless: false,
        quality,
        effort: 6,
      })
      .toBuffer()
    const base64Data = buffer.toString('base64')

    // debug:
    // fs.writeFileSync(join(__dirname, `screenshot_${randomUUID()}.webp`), buffer)

    // Cleanup temp files
    await unlink(tempPath).catch(() => { /* Ignore cleanup errors */ })

    // Cleanup device temp file (fire and forget)
    await runAdbCommand(deviceId, ['shell', 'rm', '/sdcard/tmp_screenshot.png'])
    return new Screenshot(base64Data, width, height)
  }
  catch (error) {
    console.error(`Screenshot error: ${error}`)

    // Cleanup temp file if it exists
    try {
      await unlink(tempPath)
    }
    catch {
      // Ignore cleanup errors
    }

    // Return fallback screenshot for any error
    return createFallbackScreenshot(false)
  }
}

/**
 * Create a black fallback image when screenshot fails.
 */
function createFallbackScreenshot(_isSensitive: boolean): Screenshot {
  // Create a minimal black PNG image as base64
  // This is a 1x1 black PNG in base64 format
  const blackPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

  return new Screenshot(blackPixelBase64, 1080, 2400)
}
