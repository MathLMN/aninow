import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientSection } from './appointment-form/ClientSection';
import { AnimalSection } from './appointment-form/AnimalSection';
import { ConsultationSection } from './appointment-form/ConsultationSection';
import { AppointmentSection } from './appointment-form/AppointmentSection';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ClientSection form={form} />
            <AnimalSection form={form} />
            <ConsultationSection form={form} />
            <AppointmentSection 
              form={form} 
              veterinarians={veterinarians}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
