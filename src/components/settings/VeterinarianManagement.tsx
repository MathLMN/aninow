
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { UserPlus, Edit, Trash2, Stethoscope } from "lucide-react";

export const VeterinarianManagement = () => {
  const { veterinarians, isLoading, addVeterinarian, updateVeterinarian, deleteVeterinarian } = useClinicVeterinarians();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVet, setEditingVet] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVet) {
      const success = await updateVeterinarian(editingVet.id, formData);
      if (success) {
        setEditingVet(null);
        setFormData({ name: '', email: '', specialty: '', is_active: true });
      }
    } else {
      const success = await addVeterinarian(formData);
      if (success) {
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', specialty: '', is_active: true });
      }
    }
  };

  const handleEdit = (vet: any) => {
    setEditingVet(vet);
    setFormData({
      name: vet.name,
      email: vet.email || '',
      specialty: vet.specialty || '',
      is_active: vet.is_active
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vétérinaire ?')) {
      await deleteVeterinarian(id);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', specialty: '', is_active: true });
    setEditingVet(null);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-8">
          <div className="text-center text-vet-brown">Chargement des vétérinaires...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center">
          <Stethoscope className="h-5 w-5 mr-2" />
          Gestion des vétérinaires
        </CardTitle>
        <CardDescription>
          Gérez l'équipe de vétérinaires de votre clinique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-vet-brown">
              {veterinarians.filter(v => v.is_active).length} vétérinaire(s) actif(s)
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un vétérinaire
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un vétérinaire</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau vétérinaire à votre équipe.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Spécialité</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Actif</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                    Ajouter
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veterinarians.map((vet) => (
                <TableRow key={vet.id}>
                  <TableCell>
                    {editingVet?.id === vet.id ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      vet.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVet?.id === vet.id ? (
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      vet.email || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVet?.id === vet.id ? (
                      <Input
                        value={formData.specialty}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      vet.specialty || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVet?.id === vet.id ? (
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vet.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vet.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingVet?.id === vet.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={handleSubmit}
                            className="bg-vet-sage hover:bg-vet-sage/90 text-white"
                          >
                            Sauvegarder
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={resetForm}
                          >
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(vet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(vet.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
