
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// We use the service role key on the server side if available for bypassing RLS, 
// but for client-side uploads or standard auth flow we use the anon key.
// Since we are uploading from server actions, we might need the service role key to upload to any bucket without RLS policies getting in the way,
// OR we rely on the Anon key + RLS policies allowing public uploads (or authenticated user uploads).
// For now, we'll try to use the ANON key as requested mainly, but if we have a SERVICE_ROLE key we should use it for admin actions.
// However, the user only has the ANON key usually available in client-side apps.
// We will look for SERVICE_ROLE_KEY but fall back to ANON_KEY.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing in environment variables. File uploads will fail.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

/**
 * Uploads a file to Supabase Storage
 * @param {File|Blob|Buffer} file - The file object or buffer to upload
 * @param {string} bucket - The bucket name (e.g., 'products', 'documents')
 * @param {string} path - The file path within the bucket (e.g., 'folder/filename.jpg')
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadFile(file, bucket, path, contentType) {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration');
    }

    // Convert File/Blob to Buffer if needed (though Supabase JS client handles File/Blob/Buffer usually)
    // But in server actions, 'file' from FormData is a File object which is compatible.

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            contentType,
            upsert: true
        });

    if (error) {
        console.error(`Supabase upload error for ${path}:`, error);
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return publicUrl;
}

/**
 * Deletes a file from Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {string} path - The file path to delete
 */
export async function deleteFile(bucket, path) {
    if (!supabaseUrl || !supabaseKey) return;

    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        console.error(`Supabase delete error for ${path}:`, error);
        // We don't throw here to avoid blocking main operation
    }
}
