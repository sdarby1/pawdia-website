// src/app/api/upload/route.js
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: 'pawdia', public_id: uuidv4() },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'pawdia', public_id: uuidv4() },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
