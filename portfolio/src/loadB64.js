// Fetch a base64 text asset from public/ (snapshot push rejects binaries,
// so images live as .b64 text) and decode it to a Blob object URL.
// Same pattern VideoBackground.jsx uses for hero-bg.mp4.b64.
export async function loadB64Asset(file, mimeType) {
  const res = await fetch(`${import.meta.env.BASE_URL}${file}`)
  if (!res.ok) throw new Error(`asset failed to load: ${file}`)
  const b64 = (await res.text()).replace(/\s/g, '')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return URL.createObjectURL(new Blob([bytes], { type: mimeType }))
}
