import { useState, useMemo, useEffect } from "react";
import { useExpenseStore } from "@/stores/expenseStore";
import type { Expense } from "@shared/types";
import { getColumns } from "@/components/expenses/Columns";
import { ExpensesDataTable } from "@/components/expenses/ExpensesDataTable";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { EditExpenseDialog } from "@/components/expenses/EditExpenseDialog";
import { DeleteExpenseDialog } from "@/components/expenses/DeleteExpenseDialog";
import { EmptyState } from "@/components/expenses/EmptyState";
import { Input } from "@/components/ui/input";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useShallow } from 'zustand/react/shallow';
const ExpensesPage = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const { expenses, isLoading, error, fetchExpenses, deleteExpense } = useExpenseStore(
    useShallow((state) => ({
      expenses: state.expenses,
      isLoading: state.isLoading,
      error: state.error,
      fetchExpenses: state.fetchExpenses,
      deleteExpense: state.deleteExpense,
    }))
  );
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
  const columns = useMemo(
    () => getColumns(
      (expense) => setEditingExpense(expense),
      (expenseId) => setDeletingExpenseId(expenseId)
    ),
    []
  );
  if (error && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error loading expenses: {error}</p>
      </div>
    );
  }
  const handleDeleteConfirm = async () => {
    if (deletingExpenseId) {
      await deleteExpense(deletingExpenseId);
      setDeletingExpenseId(null);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-display">Expenses</h2>
        {!isLoading && expenses.length > 0 && <AddExpenseDialog />}
      </div>
      {!isLoading && expenses.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by vendor..."
              value={(columnFilters.find(f => f.id === 'vendor')?.value as string) ?? ""}
              onChange={(event) => {
                const newFilters = columnFilters.filter(f => f.id !== 'vendor');
                if (event.target.value) {
                  newFilters.push({ id: 'vendor', value: event.target.value });
                }
                setColumnFilters(newFilters);
              }}
              className="max-w-sm bg-slate-800 border-slate-700 focus:ring-primary"
            />
          </div>
          <div className="overflow-x-auto">
            <ExpensesDataTable
              columns={columns}
              data={expenses}
              isLoading={isLoading}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          </div>
        </>
      )}
      <EditExpenseDialog
        expense={editingExpense}
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(null)}
      />
      <DeleteExpenseDialog
        expenseId={deletingExpenseId!}
        open={!!deletingExpenseId}
        onOpenChange={(open) => !open && setDeletingExpenseId(null)}
        onSuccess={handleDeleteConfirm}
      />
    </div>
  );
};
export default ExpensesPage;