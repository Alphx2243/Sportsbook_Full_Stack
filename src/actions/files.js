'use server'

import cloudinary from '@/lib/cloudinary'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
export async function uploadFile(formData) {
    let tempFilePath = null
    try {
        const file = formData.get('file')
        if (!file) { throw new Error('No file uploaded') }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uploadDir = join(process.cwd(), 'public', 'temp_uploads')
        await mkdir(uploadDir, { recursive: true })
        const fileName = `${uuidv4()}-${file.name}`
        tempFilePath = join(uploadDir, fileName)
        await writeFile(tempFilePath, buffer)
        const result = await cloudinary.uploader.upload(tempFilePath, { folder: 'sportsbook', })
        return {
            $id: result.public_id, name: file.name, url: result.secure_url
        }
    }
    catch (error) {
        console.error('Cloudinary upload error:', error)
        return false
    }
    finally {
        if (tempFilePath) {
            try { await unlink(tempFilePath) }
            catch (err) { console.error('Failed to delete temporary file:', err) }
        }
    }
}

export async function getFilePreview(fileId) {
    if (!fileId) return '/sblogo.png'
    if (fileId.startsWith('http')) return fileId
    return `/uploads/${fileId}`
}
