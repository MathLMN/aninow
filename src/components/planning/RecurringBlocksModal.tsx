
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurringBlocksManager } from "./RecurringBlocksManager";

interface RecurringBlocksModalProps {
  isOpen: boolean;
  onClose: () => void;
  veterinarians: any[];
}

export const RecurringBlocksModal = ({ isOpen, onClose, veterinarians }: RecurringBlocksModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">Gestion des blocages récurrents</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="manage">Blocages récurrents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="mt-6">
            <RecurringBlocksManager veterinarians={veterinarians} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
