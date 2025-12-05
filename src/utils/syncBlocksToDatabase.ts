import { supabase } from '@/integrations/supabase/client';
import { CanvasBlock } from '@/types/canvasBlocks';
import { blocksToStageConfig } from './stageToBlocks';

interface StageOption {
  id?: string;
  stage_id: string;
  text: string;
  image_url: string | null;
  style_category: string | null;
  points: number;
  order_index: number;
}

/**
 * Extracts options from an options block
 */
function extractOptionsFromBlock(block: CanvasBlock, stageId: string): StageOption[] {
  if (block.type !== 'options') return [];
  
  const options = block.content?.options || [];
  
  return options.map((opt: any, index: number) => ({
    stage_id: stageId,
    text: opt.text || `Opção ${index + 1}`,
    image_url: opt.imageUrl || null,
    style_category: opt.styleCategory || null,
    points: opt.points || 1,
    order_index: index,
  }));
}

/**
 * Syncs all blocks from the editor to the database
 */
export async function syncBlocksToDatabase(
  funnelId: string,
  stages: any[],
  stageBlocks: Record<string, CanvasBlock[]>
): Promise<void> {
  // Process each stage
  for (const stage of stages) {
    const blocks = stageBlocks[stage.id] || [];
    
    // Convert blocks to stage config
    const config = blocksToStageConfig(blocks);
    
    // Update stage config
    const { error: stageError } = await supabase
      .from('funnel_stages')
      .update({ config })
      .eq('id', stage.id);
    
    if (stageError) {
      console.error('Error updating stage config:', stageError);
      throw stageError;
    }
    
    // Sync options for question/strategic stages
    if (stage.type === 'question' || stage.type === 'strategic') {
      const optionsBlock = blocks.find(b => b.type === 'options');
      
      if (optionsBlock) {
        const newOptions = extractOptionsFromBlock(optionsBlock, stage.id);
        
        // Delete existing options for this stage
        const { error: deleteError } = await supabase
          .from('stage_options')
          .delete()
          .eq('stage_id', stage.id);
        
        if (deleteError) {
          console.error('Error deleting old options:', deleteError);
          throw deleteError;
        }
        
        // Insert new options if any
        if (newOptions.length > 0) {
          const { error: insertError } = await supabase
            .from('stage_options')
            .insert(newOptions);
          
          if (insertError) {
            console.error('Error inserting options:', insertError);
            throw insertError;
          }
        }
      }
    }
  }
}

/**
 * Saves a single stage's blocks to the database
 */
export async function saveStageBocks(
  stageId: string,
  blocks: CanvasBlock[],
  stageType: string
): Promise<void> {
  // Convert blocks to config
  const config = blocksToStageConfig(blocks);
  
  // Update stage config
  const { error: stageError } = await supabase
    .from('funnel_stages')
    .update({ config })
    .eq('id', stageId);
  
  if (stageError) {
    throw stageError;
  }
  
  // Sync options for question/strategic stages
  if (stageType === 'question' || stageType === 'strategic') {
    const optionsBlock = blocks.find(b => b.type === 'options');
    
    if (optionsBlock) {
      const newOptions = extractOptionsFromBlock(optionsBlock, stageId);
      
      // Delete existing options
      await supabase
        .from('stage_options')
        .delete()
        .eq('stage_id', stageId);
      
      // Insert new options
      if (newOptions.length > 0) {
        await supabase
          .from('stage_options')
          .insert(newOptions);
      }
    }
  }
}
