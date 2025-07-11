
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, User, Trash2, Filter } from "lucide-react"
import type { Database } from '@/integrations/supabase/types'

type AvailableSlotRow = Database['public']['Tables']['available_slots']['Row'] & {
  veterinarians?: { name: string; clinic_name: string } | null
  consultation_types?: { name: string; duration_minutes: number; color: string } | null
}

interface SlotsListProps {
  slots: AvailableSlotRow[]
  onDeleteSlot: (slotId: string) => Promise<boolean>
  onFilterByDate: (date: string) => void
  isLoading: boolean
}

export const SlotsList = ({ slots, onDeleteSlot, onFilterByDate, isLoading }: SlotsListProps) => {
  const [filterDate, setFilterDate] = useState('')

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterByDate(filterDate)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-8">
          <div className="text-center text-vet-brown">Chargement des créneaux...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-vet-navy">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-vet-sage" />
            Créneaux disponibles
          </div>
          <Badge variant="secondary" className="bg-vet-beige text-vet-navy">
            {slots.length} créneaux
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtre par date */}
        <form onSubmit={handleFilterSubmit} className="mb-6 flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="filter-date" className="text-vet-navy">Filtrer par date</Label>
            <Input
              id="filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" variant="outline" className="border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button type="button" variant="ghost" onClick={() => { setFilterDate(''); onFilterByDate(''); }} className="text-vet-brown hover:text-vet-navy">
            Réinitialiser
          </Button>
        </form>

        {slots.length === 0 ? (
          <div className="text-center py-8 text-vet-brown">
            Aucun créneau disponible pour les critères sélectionnés
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-vet-blue/20">
                  <TableHead className="text-vet-navy">Date</TableHead>
                  <TableHead className="text-vet-navy">Horaire</TableHead>
                  <TableHead className="text-vet-navy">Vétérinaire</TableHead>
                  <TableHead className="text-vet-navy">Consultation</TableHead>
                  <TableHead className="text-vet-navy">Statut</TableHead>
                  <TableHead className="text-vet-navy">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id} className="border-vet-blue/10">
                    <TableCell className="font-medium text-vet-navy">
                      {formatDate(slot.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-vet-brown">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-vet-brown">
                        <User className="h-4 w-4 mr-2" />
                        {slot.veterinarians?.name || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        style={{ backgroundColor: slot.consultation_types?.color || '#3B82F6' }}
                        className="text-white"
                      >
                        {slot.consultation_types?.name || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={slot.is_booked ? "destructive" : "default"} className={slot.is_booked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {slot.is_booked ? 'Réservé' : 'Disponible'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSlot(slot.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
