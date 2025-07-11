
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface ClinicSettings {
  id?: string
  veterinarian_count: number
  clinic_name: string
  asv_enabled: boolean
  created_at?: string
  updated_at?: string
}

export const useClinicSettings = () => {
  const [settings, setSettings] = useState<ClinicSettings>({
    veterinarian_count: 3,
    clinic_name: 'Clinique Vétérinaire',
    asv_enabled: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      // Since clinic_settings table doesn't exist in the database, we'll use localStorage as fallback
      const savedSettings = localStorage.getItem('clinic_settings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<ClinicSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      
      // Save to localStorage since we don't have the database table yet
      localStorage.setItem('clinic_settings', JSON.stringify(updatedSettings))
      
      setSettings(updatedSettings)
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
