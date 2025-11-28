-- Add excluded_dates column to recurring_slot_blocks table
ALTER TABLE recurring_slot_blocks 
ADD COLUMN excluded_dates DATE[] DEFAULT '{}';

COMMENT ON COLUMN recurring_slot_blocks.excluded_dates IS 'Dates exceptionnellement débloquées pour ce blocage récurrent';