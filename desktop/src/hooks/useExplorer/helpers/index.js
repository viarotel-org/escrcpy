// 编码 UTF-8 字符串 → Base64
export function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str) // UTF-8 字节
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

// 解码 Base64 → UTF-8 字符串
export function decodeBase64(b64) {
  const binary = atob(b64)
  const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)))
  return new TextDecoder().decode(bytes)
}
