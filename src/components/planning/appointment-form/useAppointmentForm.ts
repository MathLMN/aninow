import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClinicAccess } from '@/hooks/useClinicAccess'

const appointmentSchema = z.object({
  clientName: z.string().min(2, {
    message: "Le nom du client doit comporter au moins 2 caractères."
  }),
  clientEmail: z.string().email({
    message: "Veuillez entrer une adresse email valide."
  }),
  clientPhone: z.string().min(10, {
    message: "Le numéro de téléphone doit comporter au moins 10 chiffres."
  }),
  clientComment: z.string().optional(),
  animalName: z.string().min(2, {
    message: "Le nom de l'animal doit comporter au moins 2 caractères."
  }),
  animalSpecies: z.string().min(2, {
    message: "L'espèce de l'animal doit comporter au moins 2 caractères."
  }),
  consultationReason: z.string().min(2, {
    message: "Le motif de consultation doit comporter au moins 2 caractères."
  }),
  appointmentDate: z.date(),
  appointmentTime: z.string(),
  endTime: z.string(),
  veterinarianId: z.string(),
  consultationTypeId: z.string(),
  status: z.string().optional()
})

export const useAppointmentForm = (appointmentToEdit?: any, onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { currentClinicId } = useClinicAccess()

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientName: appointmentToEdit?.client_name || "",
      clientEmail: appointmentToEdit?.client_email || "",
      clientPhone: appointmentToEdit?.client_phone || "",
      clientComment: appointmentToEdit?.client_comment || "",
      animalName: appointmentToEdit?.animal_name || "",
      animalSpecies: appointmentToEdit?.animal_species || "",
      consultationReason: appointmentToEdit?.consultation_reason || "",
      appointmentDate: appointmentToEdit?.appointment_date ? new Date(appointmentToEdit.appointment_date) : new Date(),
      appointmentTime: appointmentToEdit?.appointment_time || "",
      endTime: appointmentToEdit?.end_time || "",
      veterinarianId: appointmentToEdit?.veterinarian_id || "",
      consultationTypeId: appointmentToEdit?.consultation_type_id || "",
      status: appointmentToEdit?.status || 'confirmed'
    }
  })

  const onSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    if (!currentClinicId) {
      toast({
        title: "Erreur",
        description: "Aucune clinique sélectionnée",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const appointmentData = {
        client_name: values.clientName,
        client_email: values.clientEmail,
        client_phone: values.clientPhone,
        client_comment: values.clientComment,
        animal_name: values.animalName,
        animal_species: values.animalSpecies,
        consultation_reason: values.consultationReason,
        appointment_date: values.appointmentDate,
        appointment_time: values.appointmentTime,
        end_time: values.endTime,
        veterinarian_id: values.veterinarianId,
        consultation_type_id: values.consultationTypeId,
        status: values.status || 'confirmed',
        clinic_id: currentClinicId,
        preferred_contact_method: 'phone'
      }

      let result
      if (appointmentToEdit?.id) {
        result = await supabase
          .from('bookings')
          .update(appointmentData)
          .eq('id', appointmentToEdit.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('bookings')
          .insert([appointmentData])
          .select()
          .single()
      }

      const { data, error } = result

      if (error) {
        console.error('Error saving appointment:', error)
        throw error
      }

      toast({
        title: appointmentToEdit ? "Rendez-vous modifié" : "Rendez-vous créé",
        description: appointmentToEdit 
          ? "Le rendez-vous a été modifié avec succès" 
          : "Le nouveau rendez-vous a été créé avec succès"
      })

      onSuccess?.()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting
  }
}
