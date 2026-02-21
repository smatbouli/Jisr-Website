
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

async function testUpload() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env');
        console.error('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
        process.exit(1);
    }

    console.log('Connecting to Supabase at:', supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create a dummy file
    const dummyContent = 'This is a test file for Supabase Storage.';
    const buffer = Buffer.from(dummyContent);
    const filename = `test-${Date.now()}.txt`;
    const bucket = 'documents'; // Assuming this bucket exists

    console.log(`Attempting to upload ${filename} to bucket '${bucket}'...`);

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, buffer, {
            contentType: 'text/plain',
            upsert: true
        });

    if (error) {
        console.error('❌ Upload failed:', error.message);
        if (error.message.includes('Bucket not found')) {
            console.error('💡 Hint: You need to create a public bucket named "documents" in your Supabase dashboard.');
        }
        process.exit(1);
    }

    console.log('✅ Upload successful!');
    console.log('Path:', data.path);

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    console.log('Public URL:', publicUrl);

    // Cleanup
    console.log('Cleaning up...');
    const { error: delError } = await supabase.storage
        .from(bucket)
        .remove([data.path]);

    if (delError) {
        console.warn('⚠️ Filed to delete test file:', delError.message);
    } else {
        console.log('✅ Test file deleted.');
    }
}

testUpload();
