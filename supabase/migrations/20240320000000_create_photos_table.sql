-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
    id BIGSERIAL PRIMARY KEY,
    src TEXT NOT NULL,
    category TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS photos_category_idx ON public.photos(category);

-- Create function to create photos table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_photos_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create photos table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.photos (
        id BIGSERIAL PRIMARY KEY,
        src TEXT NOT NULL,
        category TEXT NOT NULL,
        storage_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'photos'
        AND indexname = 'photos_category_idx'
    ) THEN
        CREATE INDEX photos_category_idx ON public.photos(category);
    END IF;
END;
$$; 