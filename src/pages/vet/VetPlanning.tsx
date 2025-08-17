import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreateAppointmentModal } from '@/components/planning/CreateAppointmentModal';
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  client_name: string;
  animal_name: string;
  appointment_date: string;
  appointment_time: string;
}

const VetPlanning = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [defaultAppointmentData, setDefaultAppointmentData] = useState<any>(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);

  useEffect(() => {
    // Fetch appointments from database or wherever
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        client_name: "John Doe",
        animal_name: "Buddy",
        appointment_date: "2024-07-20",
        appointment_time: "10:00"
      },
      {
        id: "2",
        client_name: "Jane Smith",
        animal_name: "Whiskers",
        appointment_date: "2024-07-21",
        appointment_time: "14:00"
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  const handleCreateAppointment = () => {
    setDefaultAppointmentData({
      appointmentDate: format(selectedDate || new Date(), 'yyyy-MM-dd'),
    });
    setAppointmentToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setAppointmentToEdit(appointment);
    setDefaultAppointmentData(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 pt-10 space-y-6">
      <div className="flex items-center space-x-4">
        <Calendar className="h-8 w-8 text-vet-sage" />
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Planning</h1>
          <p className="text-vet-brown">Gérez votre planning de rendez-vous</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Label htmlFor="date">Sélectionner une date :</Label>
          <DatePicker
            id="date"
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            placeholderText={format(new Date(), 'dd/MM/yyyy')}
            className={cn(
              "w-52 border-vet-blue/30 focus-visible:ring-vet-blue text-vet-navy",
              !selectedDate && "text-muted-foreground"
            )}
          />
        </div>
        <Button onClick={handleCreateAppointment} className="bg-vet-blue hover:bg-vet-blue/90 text-white">
          Nouveau rendez-vous
        </Button>
      </div>

      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultData={defaultAppointmentData}
        appointmentToEdit={appointmentToEdit}
      />
    </div>
  );
};

export default VetPlanning;
