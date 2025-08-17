
import React from 'react';
import { DateSlotCard } from './DateSlotCard';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  veterinarian_id: string;
  consultation_type_id: string;
  is_booked: boolean;
}

interface Veterinarian {
  id: string;
  name: string;
  specialty: string;
}

interface ConsultationType {
  id: string;
  name: string;
  duration_minutes: number;
  color?: string;
}

interface SlotsListProps {
  slots: Slot[];
  onDeleteSlot: (slotId: string) => Promise<boolean>;
}

export const SlotsList = ({ slots, onDeleteSlot }: SlotsListProps) => {
  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  // Sort dates
  const sortedDates = Object.keys(slotsByDate).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-8 text-vet-brown">
        <p>Aucun créneau disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDates.map(date => (
        <DateSlotCard
          key={date}
          date={date}
          slots={slotsByDate[date]}
          onDeleteSlot={onDeleteSlot}
        />
      ))}
    </div>
  );
};
