import { createServerFn } from '@tanstack/react-start'
import { supabase } from '@/lib/supabase'

export const uploadFile = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: FormData }) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your environment variables.')
    }

    const file = data.get('file') as File
    const bucket = (data.get('bucket') as string) || 'avatars'
    const path = data.get('path') as string // Custom path/folder

    if (!file) {
      throw new Error('No file provided')
    }

    // Basic size validation (10MB for datasets)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const fullPath = path ? `${path}/${fileName}` : fileName

    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fullPath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fullPath)

    return { url: publicUrl, path: fullPath, name: file.name, size: file.size, type: file.type }
  },
)

// Legacy alias for compatibility
export const uploadImage = uploadFile
