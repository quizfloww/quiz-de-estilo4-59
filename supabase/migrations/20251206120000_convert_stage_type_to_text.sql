-- Migration: Convert stage_type from ENUM to TEXT for maximum flexibility
-- This allows any custom stage type without needing new migrations

-- Step 1: Add temporary category column to preserve categorization
ALTER TABLE funnel_stages ADD COLUMN IF NOT EXISTS type_category TEXT;

-- Step 2: Copy current type values to category for backward compatibility
UPDATE funnel_stages SET type_category = type::text WHERE type_category IS NULL;

-- Step 3: Drop the old type column (will be recreated as TEXT)
ALTER TABLE funnel_stages DROP COLUMN type;

-- Step 4: Recreate type column as TEXT (no ENUM restriction)
ALTER TABLE funnel_stages ADD COLUMN type TEXT NOT NULL DEFAULT 'page';

-- Step 5: Restore the original values from category
UPDATE funnel_stages SET type = type_category;

-- Step 6: Add index for performance
CREATE INDEX IF NOT EXISTS idx_funnel_stages_type ON funnel_stages(type);
CREATE INDEX IF NOT EXISTS idx_funnel_stages_type_category ON funnel_stages(type_category);

-- Step 7: Drop the old ENUM type (no longer needed)
DROP TYPE IF EXISTS public.stage_type;

-- Step 8: Add comment explaining the change
COMMENT ON COLUMN funnel_stages.type IS 'Stage type - now accepts any string for maximum flexibility (e.g., intro, question, offer, upsell, thank-you, etc.)';
COMMENT ON COLUMN funnel_stages.type_category IS 'Optional categorization for UI filtering/grouping (legacy: intro, question, strategic, transition, result)';
