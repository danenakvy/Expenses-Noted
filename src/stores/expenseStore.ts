import { create } from 'zustand';
import { api } from '@/lib/api-client';
import type { Expense } from '@shared/types';
import { toast } from 'sonner';
interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (newExpense: Omit<Expense, 'id'>) => Promise<Expense | undefined>;
  updateExpense: (expenseId: string, updatedExpense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
}
export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  isLoading: true,
  error: null,
  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api<{ items: Expense[] }>('/api/expenses');
      set({ expenses: response.items, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch expenses';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
  addExpense: async (newExpenseData) => {
    const optimisticId = crypto.randomUUID();
    const optimisticExpense: Expense = { ...newExpenseData, id: optimisticId };
    const previousExpenses = get().expenses;
    set(state => ({
      expenses: [optimisticExpense, ...state.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }));
    try {
      const savedExpense = await api<Expense>('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(newExpenseData),
      });
      set(state => ({
        expenses: state.expenses.map(e => e.id === optimisticId ? savedExpense : e),
      }));
      toast.success('Expense added successfully!');
      return savedExpense;
    } catch (error) {
      set({ expenses: previousExpenses });
      toast.error('Failed to add expense. Please try again.');
      console.error(error);
      return undefined;
    }
  },
  updateExpense: async (expenseId, updatedExpenseData) => {
    const previousExpenses = get().expenses;
    const updatedExpense: Expense = { ...updatedExpenseData, id: expenseId };
    set(state => ({
      expenses: state.expenses.map(e => e.id === expenseId ? updatedExpense : e),
    }));
    try {
      await api<Expense>(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedExpenseData),
      });
      toast.success('Expense updated successfully!');
    } catch (error) {
      set({ expenses: previousExpenses });
      toast.error('Failed to update expense. Please try again.');
      console.error(error);
    }
  },
  deleteExpense: async (expenseId) => {
    const previousExpenses = get().expenses;
    set(state => ({
      expenses: state.expenses.filter(e => e.id !== expenseId),
    }));
    try {
      await api(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });
      toast.success('Expense deleted successfully!');
    } catch (error) {
      set({ expenses: previousExpenses });
      toast.error('Failed to delete expense. Please try again.');
      console.error(error);
    }
  },
}));