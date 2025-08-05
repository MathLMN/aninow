
-- Drop unused tables

-- Drop vet_sessions table (used by old auth system)
DROP TABLE IF EXISTS vet_sessions CASCADE;

-- Drop veterinary_practice_requests table (unused)
DROP TABLE IF EXISTS veterinary_practice_requests CASCADE;
