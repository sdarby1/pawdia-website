import { NextResponse } from 'next/server'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'

// Primitive MIME-Erkennung anhand Dateiendung (reicht für Bilder schnell aus)
function getMime(filename = '') {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(req, { params }) {
  // /uploads/<...path> -> params.path = [ 'blog', 'file.png' ]
  const rel = Array.isArray(params?.path) ? params.path.join('/') : ''
  const fsPath = path.join(process.cwd(), 'uploads', rel)

  try {
    await stat(fsPath)
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }

  const stream = createReadStream(fsPath)
  return new NextResponse(stream, {
    headers: {
      // Für Abgabe/Tests: kein Cache, damit neue Uploads SOFORT sichtbar sind
      'Cache-Control': 'no-store',
      'Content-Type': getMime(fsPath),
    },
  })
}
