
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface ClientSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string) => void;
}

export const ClientSection = ({ formData, onFieldUpdate }: ClientSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-vet-navy flex items-center">
        <User className="h-4 w-4 mr-2" />
        Informations client
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_name">Nom complet *</Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => onFieldUpdate('client_name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="client_phone">Téléphone *</Label>
          <Input
            id="client_phone"
            type="tel"
            value={formData.client_phone}
            onChange={(e) => onFieldUpdate('client_phone', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="client_email">Email</Label>
          <Input
            id="client_email"
            type="email"
            value={formData.client_email}
            onChange={(e) => onFieldUpdate('client_email', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="preferred_contact_method">Contact préféré</Label>
          <Select value={formData.preferred_contact_method} onValueChange={(value) => onFieldUpdate('preferred_contact_method', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Téléphone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
