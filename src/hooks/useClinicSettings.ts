
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
  asv_enabled: boolean
  daily_schedules: DailySchedules
  created_at?: string
  updated_at?: string
}

export const useClinicSettings = () => {
  const [settings, setSettings] = useState<ClinicSettings>({
    clinic_name: 'Clinique Vétérinaire',
    asv_enabled: true,
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
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSettings(data)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err)
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
      const updatedSettings = { ...settings, ...newSettings }
      
      const { data, error } = await supabase
        .from('clinic_settings')
        .upsert([updatedSettings])
        .select()
        .single()

      if (error) throw error

      setSettings(data)
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de la clinique ont été sauvegardés",
      })

      return true
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
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
