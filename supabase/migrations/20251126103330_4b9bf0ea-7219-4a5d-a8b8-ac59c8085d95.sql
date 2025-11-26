-- Create urgency_feedbacks table
CREATE TABLE urgency_feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  clinic_id UUID REFERENCES clinics(id) NOT NULL,
  
  -- Original AI score
  original_score INTEGER NOT NULL,
  original_level TEXT NOT NULL CHECK (original_level IN ('critical', 'moderate', 'low')),
  
  -- Team feedback
  is_correct BOOLEAN NOT NULL,
  suggested_level TEXT CHECK (suggested_level IN ('critical', 'moderate', 'low')),
  feedback_reason TEXT,
  
  -- Metadata
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add urgency_feedback column to bookings table
ALTER TABLE bookings 
ADD COLUMN urgency_feedback JSONB DEFAULT NULL;

-- Create index for performance
CREATE INDEX idx_urgency_feedbacks_booking_id ON urgency_feedbacks(booking_id);
CREATE INDEX idx_urgency_feedbacks_clinic_id ON urgency_feedbacks(clinic_id);

-- Enable RLS
ALTER TABLE urgency_feedbacks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for urgency_feedbacks
-- Clinics can view and insert their own feedbacks
CREATE POLICY "Clinics can view their feedbacks"
  ON urgency_feedbacks
  FOR SELECT
  USING (clinic_id = get_user_clinic_id());

CREATE POLICY "Clinics can insert their feedbacks"
  ON urgency_feedbacks
  FOR INSERT
  WITH CHECK (clinic_id = get_user_clinic_id());

-- Admins can view all feedbacks
CREATE POLICY "Admins can view all feedbacks"
  ON urgency_feedbacks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );