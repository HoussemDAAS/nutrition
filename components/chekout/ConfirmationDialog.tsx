"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  submitting 
}: ConfirmationDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="rounded-lg max-w-[90%] md:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-lg">Confirmer la commande</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-gray-600">Êtes-vous sûr de vouloir passer cette commande?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-4 py-2 text-sm md:text-base">
            Annuler
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={submitting} 
            className="bg-AccentColor hover:bg-AccentColor/90 px-4 py-2 text-sm md:text-base"
          >
            {submitting ? 'Traitement...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);