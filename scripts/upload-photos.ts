import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { createReadStream } from 'fs';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos');

async function uploadPhoto(filePath: string, category: string, subcategory?: string) {
  try {
    console.log(`Processing file: ${filePath}`);
    console.log(`Category: ${category}, Subcategory: ${subcategory || 'none'}`);
    
    const fileStream = createReadStream(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName);
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      fileStream.on('data', (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          chunks.push(chunk);
        }
      });
      fileStream.on('end', () => resolve(Buffer.concat(chunks)));
      fileStream.on('error', reject);
    });

    // Upload to Supabase Storage
    const storagePath = subcategory 
      ? `${category}/${subcategory}/${fileName}`
      : `${category}/${fileName}`;
    
    console.log(`Uploading to storage path: ${storagePath}`);
    
    // First, check if the file already exists
    const { data: existingFile } = await supabase.storage
      .from('photos')
      .list(category + (subcategory ? `/${subcategory}` : ''));

    if (existingFile?.some(file => file.name === fileName)) {
      console.log(`File ${fileName} already exists, skipping upload`);
    } else {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('photos')
        .upload(storagePath, fileBuffer, {
          contentType: `image/${fileExt.slice(1)}`,
          upsert: true
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        throw storageError;
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(storagePath);

    console.log(`Public URL: ${publicUrl}`);

    // Insert into database
    const { error: dbError } = await supabase
      .from('photos')
      .upsert({
        src: publicUrl,
        category: subcategory || category,
        storage_path: storagePath,
        file_name: fileName,
        file_type: fileExt.slice(1),
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }

    console.log(`Successfully processed: ${storagePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function processDirectory(dirPath: string, category: string) {
  try {
    console.log(`Processing directory: ${dirPath} with category: ${category}`);
    const items = await readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        // If it's a directory, process it as a subcategory
        await processDirectory(fullPath, item.name);
      } else if (item.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(item.name)) {
        // If it's an image file, upload it
        const relativePath = path.relative(PHOTOS_DIR, dirPath);
        const category = relativePath.split(path.sep)[0];
        const subcategory = relativePath.split(path.sep)[1];
        
        // Ensure category names match exactly
        const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        const normalizedSubcategory = subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase() : undefined;
        
        await uploadPhoto(fullPath, normalizedCategory, normalizedSubcategory);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

async function main() {
  try {
    // Create photos table if it doesn't exist
    const { error: tableError } = await supabase.rpc('create_photos_table');
    if (tableError) throw tableError;

    // Process all photos
    await processDirectory(PHOTOS_DIR, '');
    console.log('Upload complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 