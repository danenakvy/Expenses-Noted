import { ReceiptText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddExpenseDialog } from "./AddExpenseDialog";
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-lg border-2 border-dashed border-slate-800 bg-slate-900/50">
      <ReceiptText className="h-16 w-16 text-slate-600 mb-4" />
      <h3 className="text-2xl font-bold font-display text-white mb-2">No Expenses Yet</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        It looks like you haven't added any expenses. Get started by adding your first one.
      </p>
      <AddExpenseDialog />
    </div>
  );
}