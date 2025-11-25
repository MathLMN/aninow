import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClinicContext } from '@/contexts/ClinicContext';

interface DaySchedule {
  isOpen: boolean;
  morning: {
    start: string;
    end: string;
  };
  afternoon: {
    start: string;
    end: string;
  };
}

interface DailySchedules {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface ConvenienceOption {
  value: string;
  label: string;
  color: string;
  isActive: boolean;
  isOther?: boolean;
  helpMessage?: string;
}

interface ClinicSettings {
  id?: string;
  clinic_name: string;
  clinic_phone?: string;
  clinic_email?: string;
  clinic_address_street?: string;
  clinic_address_city?: string;
  clinic_address_postal_code?: string;
  clinic_address_country?: string;
  asv_enabled: boolean;
  online_booking_enabled?: boolean;
  daily_schedules: DailySchedules;
  default_slot_duration_minutes?: number;
  convenience_options_config?: ConvenienceOption[];
  clinic_id?: string;
}

const convertToDailySchedules = (jsonData: any): DailySchedules => {
  const defaultSchedules: DailySchedules = {
    monday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    tuesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    wednesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    thursday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    friday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    saturday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } },
    sunday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } }
  };

  if (!jsonData || typeof jsonData !== 'object') {
    return defaultSchedules;
  }

  return { ...defaultSchedules, ...jsonData };
};

export const usePublicClinicSettings = () => {
  const { currentClinic } = useClinicContext();
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentClinic?.id) {
        console.log('⏳ No clinic in context yet');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔍 Fetching public clinic settings for clinic:', currentClinic.id);

        const { data, error } = await supabase
          .from('clinic_settings')
          .select('*')
          .eq('clinic_id', currentClinic.id)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('❌ Error fetching clinic settings:', error);
          return;
        }

        if (data) {
          console.log('✅ Clinic settings loaded:', data);
          const settingsData: ClinicSettings = {
            ...data,
            daily_schedules: convertToDailySchedules(data.daily_schedules),
            default_slot_duration_minutes: data.default_slot_duration_minutes || 30,
            online_booking_enabled: data.online_booking_enabled ?? true,
            clinic_phone: data.clinic_phone || '',
            clinic_email: data.clinic_email || '',
            clinic_address_street: data.clinic_address_street || '',
            clinic_address_city: data.clinic_address_city || '',
            clinic_address_postal_code: data.clinic_address_postal_code || '',
            clinic_address_country: data.clinic_address_country || 'France',
            convenience_options_config: data.convenience_options_config as unknown as ConvenienceOption[] | undefined
          };
          setSettings(settingsData);
        } else {
          console.log('ℹ️ No settings found for this clinic');
        }
      } catch (err) {
        console.error('❌ Error loading clinic settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [currentClinic?.id]);

  return {
    settings,
    isLoading
  };
};
