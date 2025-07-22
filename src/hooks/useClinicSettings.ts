
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface DaySchedule {
  isOpen: boolean
  morning: {
    start: string
    end: string
  }
  afternoon: {
    start: string
    end: string
  }
}

interface DailySchedules {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

interface ClinicSettings {
  id?: string
  clinic_name: string
  clinic_phone?: string
  clinic_email?: string
  clinic_address_street?: string
  clinic_address_city?: string
  clinic_address_postal_code?: string
  clinic_address_country?: string
  asv_enabled: boolean
  daily_schedules: DailySchedules
  default_slot_duration_minutes?: number
  created_at?: string
  updated_at?: string
}

// Helper function to convert Json to DailySchedules with proper fallback
const convertToDailySchedules = (jsonData: any): DailySchedules => {
  const defaultDaySchedule: DaySchedule = {
    isOpen: false,
    morning: { start: '', end: '' },
    afternoon: { start: '', end: '' }
  }

  const defaultSchedules: DailySchedules = {
    monday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    tuesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    wednesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    thursday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    friday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
    saturday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } },
    sunday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } }
  }

  if (!jsonData || typeof jsonData !== 'object') {
    return defaultSchedules
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
  const result = { ...defaultSchedules }

  days.forEach(day => {
    if (jsonData[day] && typeof jsonData[day] === 'object') {
      const dayData = jsonData[day]
      result[day] = {
        isOpen: typeof dayData.isOpen === 'boolean' ? dayData.isOpen : defaultDaySchedule.isOpen,
        morning: {
          start: typeof dayData.morning?.start === 'string' ? dayData.morning.start : defaultDaySchedule.morning.start,
          end: typeof dayData.morning?.end === 'string' ? dayData.morning.end : defaultDaySchedule.morning.end
        },
        afternoon: {
          start: typeof dayData.afternoon?.start === 'string' ? dayData.afternoon.start : defaultDaySchedule.afternoon.start,
          end: typeof dayData.afternoon?.end === 'string' ? dayData.afternoon.end : defaultDaySchedule.afternoon.end
        }
      }
    }
  })

  return result
}

export const useClinicSettings = () => {
  const [settings, setSettings] = useState<ClinicSettings>({
    clinic_name: 'Clinique Vétérinaire',
    clinic_phone: '',
    clinic_email: '',
    clinic_address_street: '',
    clinic_address_city: '',
    clinic_address_postal_code: '',
    clinic_address_country: 'France',
    asv_enabled: true,
    default_slot_duration_minutes: 30,
    daily_schedules: {
      monday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      tuesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      wednesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      thursday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      friday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      saturday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } },
      sunday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } }
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      console.log('🔍 Fetching clinic settings...')
      
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('❌ Error fetching settings:', error)
        throw error
      }

      if (data) {
        console.log('✅ Settings found and loaded:', data)
        const settingsData: ClinicSettings = {
          ...data,
          daily_schedules: convertToDailySchedules(data.daily_schedules),
          default_slot_duration_minutes: data.default_slot_duration_minutes || 30,
          clinic_phone: data.clinic_phone || '',
          clinic_email: data.clinic_email || '',
          clinic_address_street: data.clinic_address_street || '',
          clinic_address_city: data.clinic_address_city || '',
          clinic_address_postal_code: data.clinic_address_postal_code || '',
          clinic_address_country: data.clinic_address_country || 'France'
        }
        setSettings(settingsData)
      } else {
        console.log('ℹ️ No settings found, using defaults')
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des paramètres:', err)
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<ClinicSettings>) => {
    try {
      console.log('💾 Starting settings update...')
      console.log('📝 New settings data:', newSettings)
      
      const updatedSettings = { ...settings, ...newSettings }
      console.log('🔄 Merged settings:', updatedSettings)
      
      // Préparer les données pour Supabase avec le bon format
      const dataToUpdate = {
        clinic_name: updatedSettings.clinic_name || 'Clinique Vétérinaire',
        clinic_phone: updatedSettings.clinic_phone || null,
        clinic_email: updatedSettings.clinic_email || null,
        clinic_address_street: updatedSettings.clinic_address_street || null,
        clinic_address_city: updatedSettings.clinic_address_city || null,
        clinic_address_postal_code: updatedSettings.clinic_address_postal_code || null,
        clinic_address_country: updatedSettings.clinic_address_country || 'France',
        asv_enabled: updatedSettings.asv_enabled,
        daily_schedules: JSON.parse(JSON.stringify(updatedSettings.daily_schedules)),
        default_slot_duration_minutes: updatedSettings.default_slot_duration_minutes || 30
      }
      
      console.log('📤 Data to save to database:', dataToUpdate)
      
      // D'abord vérifier s'il y a déjà un enregistrement
      const { data: existingData, error: fetchError } = await supabase
        .from('clinic_settings')
        .select('id')
        .limit(1)
        .maybeSingle()

      if (fetchError) {
        console.error('❌ Error checking existing data:', fetchError)
        throw fetchError
      }

      let result;
      
      if (existingData?.id) {
        // Mettre à jour l'enregistrement existant
        console.log('🔄 Updating existing record with ID:', existingData.id)
        result = await supabase
          .from('clinic_settings')
          .update(dataToUpdate)
          .eq('id', existingData.id)
          .select()
          .single()
      } else {
        // Créer un nouvel enregistrement
        console.log('🆕 Creating new record')
        result = await supabase
          .from('clinic_settings')
          .insert([dataToUpdate])
          .select()
          .single()
      }

      const { data, error } = result

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Settings saved successfully to database:', data)
      
      // Mettre à jour le state local avec les données sauvegardées
      const settingsData: ClinicSettings = {
        ...data,
        daily_schedules: convertToDailySchedules(data.daily_schedules),
        default_slot_duration_minutes: data.default_slot_duration_minutes || 30,
        clinic_phone: data.clinic_phone || '',
        clinic_email: data.clinic_email || '',
        clinic_address_street: data.clinic_address_street || '',
        clinic_address_city: data.clinic_address_city || '',
        clinic_address_postal_code: data.clinic_address_postal_code || '',
        clinic_address_country: data.clinic_address_country || 'France'
      }
      
      console.log('🔄 Updating local state with:', settingsData)
      setSettings(settingsData)
      
      toast({
        title: "✅ Paramètres mis à jour",
        description: "Les paramètres de la clinique ont été sauvegardés avec succès",
      })

      return true
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour:', err)
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder les paramètres: ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    isLoading,
    updateSettings
  }
}
