
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurringBlocksManager } from "./RecurringBlocksManager";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecurringBlocksModalProps {
  isOpen: boolean;
  onClose: () => void;
  veterinarians: any[];
}

export const RecurringBlocksModal = ({ isOpen, onClose, veterinarians }: RecurringBlocksModalProps) => {
  const isMobile = useIsMobile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile 
          ? 'w-[95vw] h-[95vh] max-w-none max-h-none m-2 p-0 rounded-lg' 
          : 'max-w-5xl w-[95vw] max-h-[85vh] p-0'
        } 
        overflow-hidden flex flex-col
      `}>
        <DialogHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex-shrink-0">
          <DialogTitle className="text-base sm:text-lg lg:text-xl text-vet-navy">
            Gestion des blocages récurrents
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <Tabs defaultValue="manage" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-1 mb-4 sm:mb-6">
              <TabsTrigger value="manage" className="text-xs sm:text-sm py-2 sm:py-3">
                Blocages récurrents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manage" className="flex-1 overflow-auto">
              <RecurringBlocksManager veterinarians={veterinarians} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
