
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "lucide-react";

interface ClientSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string) => void;
}

export const ClientSection = ({ formData, onFieldUpdate }: ClientSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center mb-3">
        <User className="h-5 w-5 mr-2 text-green-600" />
        <h3 className="font-semibold text-green-900 text-lg">Client</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label className="text-xs font-medium text-gray-700">Statut du client *</Label>
          <RadioGroup 
            value={formData.client_status} 
            onValueChange={(value) => onFieldUpdate('client_status', value)}
            className="flex space-x-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="text-xs">Déjà client</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="text-xs">Nouveau client</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="client_name" className="text-xs font-medium text-gray-700">Nom complet *</Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => onFieldUpdate('client_name', e.target.value)}
            required
            className="h-8 text-sm"
            placeholder="Nom et prénom"
          />
        </div>
        
        <div>
          <Label htmlFor="client_phone" className="text-xs font-medium text-gray-700">Téléphone *</Label>
          <Input
            id="client_phone"
            type="tel"
            value={formData.client_phone}
            onChange={(e) => onFieldUpdate('client_phone', e.target.value)}
            required
            className="h-8 text-sm"
            placeholder="06 12 34 56 78"
          />
        </div>
        
        <div>
          <Label htmlFor="client_email" className="text-xs font-medium text-gray-700">Email</Label>
          <Input
            id="client_email"
            type="email"
            value={formData.client_email}
            onChange={(e) => onFieldUpdate('client_email', e.target.value)}
            className="h-8 text-sm"
            placeholder="client@exemple.fr"
          />
        </div>
        
        <div>
          <Label htmlFor="preferred_contact_method" className="text-xs font-medium text-gray-700">Contact préféré</Label>
          <Select value={formData.preferred_contact_method} onValueChange={(value) => onFieldUpdate('preferred_contact_method', value)}>
            <SelectTrigger className="h-8 text-sm">
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
