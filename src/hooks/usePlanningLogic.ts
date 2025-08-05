
import { useState } from "react";

type ViewMode = 'daily' | 'weekly';

export const usePlanningLogic = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    try {
      return new Date();
    } catch (error) {
      console.error('Error creating current date:', error);
      return new Date(Date.now()); // Fallback
    }
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showAssignmentManager, setShowAssignmentManager] = useState(false);
  const [filters, setFilters] = useState({
    veterinarian: 'all',
    status: 'all',
    consultationType: 'all'
  });

  const handleAppointmentClick = (appointment: any) => {
    try {
      setSelectedAppointment(appointment);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Error handling appointment click:', error);
    }
  };

  const handleCreateAppointment = (timeSlot: { date: string; time: string; veterinarian?: string }) => {
    try {
      setSelectedAppointment(timeSlot);
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error('Error handling create appointment:', error);
    }
  };

  // Navigation par semaine (pour la vue hebdomadaire)
  const navigateWeek = (direction: 'prev' | 'next') => {
    try {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentDate(newDate);
    } catch (error) {
      console.error('Error navigating week:', error);
    }
  };

  const getWeekDates = () => {
    try {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDates.push(date);
      }
      return weekDates;
    } catch (error) {
      console.error('Error getting week dates:', error);
      return [new Date()]; // Fallback to current date only
    }
  };

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    selectedAppointment,
    setSelectedAppointment,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    showAssignmentManager,
    setShowAssignmentManager,
    filters,
    setFilters,
    handleAppointmentClick,
    handleCreateAppointment,
    navigateWeek,
    getWeekDates
  };
};
