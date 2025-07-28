
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useVeterinaryPracticeRequests } from "@/hooks/useVeterinaryPracticeRequests";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  FileText
} from "lucide-react";

const AdminPracticeRequests = () => {
  const { requests, isLoading, stats, updateStatus, isUpdating } = useVeterinaryPracticeRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          En attente
        </Badge>;
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="h-3 w-3" />
          Approuvé
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rejeté
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAction = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
    setActionNotes("");
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;
    
    const newStatus = actionType === "approve" ? "approved" : "rejected";
    updateStatus({
      id: selectedRequest.id,
      status: newStatus,
      notes: actionNotes || undefined
    });
    
    setSelectedRequest(null);
    setActionType(null);
    setActionNotes("");
  };

  const filterRequests = (status: string) => {
    if (status === 'all') return requests;
    return requests.filter(r => r.status === status);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Chargement des demandes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-vet-navy">
          Gestion des demandes d'inscription
        </h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour filtrer */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approuvées ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées ({stats.rejected})</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filterRequests(status).map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">{request.establishment_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {request.contact_person_name} - {request.contact_person_role}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {request.address_street}, {request.address_city} {request.address_postal_code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.contact_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.contact_email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {request.number_of_veterinarians} vétérinaire(s)
                        </span>
                      </div>
                      {request.notes && (
                        <div className="text-sm">
                          <strong>Notes:</strong> {request.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => handleAction(request, 'approve')}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      <Button
                        onClick={() => handleAction(request, 'reject')}
                        variant="destructive"
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog de confirmation d'action */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approuver' : 'Rejeter'} la demande
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Êtes-vous sûr de vouloir {actionType === 'approve' ? 'approuver' : 'rejeter'} la demande de{' '}
              <strong>{selectedRequest?.establishment_name}</strong> ?
            </p>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajouter des notes sur cette décision..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Annuler
              </Button>
              <Button
                onClick={confirmAction}
                className={actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' : ''}
                variant={actionType === 'approve' ? 'default' : 'destructive'}
                disabled={isUpdating}
              >
                {actionType === 'approve' ? 'Approuver' : 'Rejeter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPracticeRequests;
