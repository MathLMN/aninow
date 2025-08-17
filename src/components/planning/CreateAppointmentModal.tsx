
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppointmentForm } from './appointment-form/useAppointmentForm';
import { useClinicVeterinarians } from '@/hooks/useClinicVeterinarians';
import { useEffect } from 'react';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: any;
  appointmentToEdit?: any;
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  defaultData,
  appointmentToEdit
}: CreateAppointmentModalProps) => {
  const { veterinarians } = useClinicVeterinarians();
  
  const { form, onSubmit, isSubmitting } = useAppointmentForm(appointmentToEdit, () => {
    onClose();
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        appointmentDate: defaultData.date,
        appointmentTime: defaultData.start_time,
        endTime: defaultData.end_time,
        veterinarianId: defaultData.veterinarian_id,
      });
    }
  }, [defaultData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">
            {appointmentToEdit ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du client *</label>
                <input 
                  {...form.register('clientName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du client"
                />
                {form.formState.errors.clientName && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input 
                  {...form.register('clientEmail')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientEmail.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone *</label>
                <input 
                  {...form.register('clientPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Numéro de téléphone"
                />
                {form.formState.errors.clientPhone && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientPhone.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nom de l'animal *</label>
                <input 
                  {...form.register('animalName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de l'animal"
                />
                {form.formState.errors.animalName && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.animalName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Espèce *</label>
                <input 
                  {...form.register('animalSpecies')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Chien, Chat, etc."
                />
                {form.formState.errors.animalSpecies && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.animalSpecies.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Motif de consultation *</label>
                <input 
                  {...form.register('consultationReason')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Motif de la consultation"
                />
                {form.formState.errors.consultationReason && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.consultationReason.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input 
                  {...form.register('appointmentDate', { valueAsDate: true })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.formState.errors.appointmentDate && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.appointmentDate.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Heure *</label>
                <input 
                  {...form.register('appointmentTime')}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.formState.errors.appointmentTime && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.appointmentTime.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Heure de fin *</label>
                <input 
                  {...form.register('endTime')}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.formState.errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vétérinaire</label>
              <select 
                {...form.register('veterinarianId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un vétérinaire</option>
                {veterinarians.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vet.name} - {vet.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Commentaire</label>
              <textarea 
                {...form.register('clientComment')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Commentaire ou informations supplémentaires"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-blue hover:bg-vet-blue/90 text-white"
            >
              {isSubmitting ? 'Enregistrement...' : (appointmentToEdit ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
