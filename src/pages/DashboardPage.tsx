import { useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Wallet, Loader2 } from "lucide-react";
import { useExpenseStore } from '@/stores/expenseStore';
import { useShallow } from 'zustand/react/shallow';
import type { Expense } from '@shared/types';
import { format, getMonth, startOfMonth, isSameYear } from 'date-fns';
const COLORS = ['#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'];
const DashboardPage = () => {
  const { expenses, isLoading, fetchExpenses } = useExpenseStore(
    useShallow((state) => ({
      expenses: state.expenses,
      isLoading: state.isLoading,
      fetchExpenses: state.fetchExpenses,
    }))
  );
  useEffect(() => {
    // Fetch expenses if the store is empty, otherwise the data is already there
    if (expenses.length === 0) {
      fetchExpenses();
    }
  }, [fetchExpenses, expenses.length]);
  const { totalSpendThisMonth, ytdSpend, averageExpense } = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const thisMonthExpenses = expenses.filter(e => new Date(e.date) >= startOfCurrentMonth && isSameYear(new Date(e.date), now));
    const totalSpendThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const ytdExpenses = expenses.filter(e => isSameYear(new Date(e.date), now));
    const ytdSpend = ytdExpenses.reduce((sum, e) => sum + e.amount, 0);
    const averageExpense = ytdExpenses.length > 0 ? ytdSpend / ytdExpenses.length : 0;
    return { totalSpendThisMonth, ytdSpend, averageExpense };
  }, [expenses]);
  const monthlyExpensesData = useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};
    const now = new Date();
    expenses
      .filter(e => isSameYear(new Date(e.date), now))
      .forEach(expense => {
        const month = getMonth(new Date(expense.date));
        const monthName = format(new Date(now.getFullYear(), month), 'MMM');
        if (!monthlyTotals[monthName]) {
          monthlyTotals[monthName] = 0;
        }
        monthlyTotals[monthName] += expense.amount;
      });
    return Array.from({ length: 12 }, (_, i) => {
      const monthName = format(new Date(now.getFullYear(), i), 'MMM');
      return { name: monthName, total: monthlyTotals[monthName] || 0 };
    });
  }, [expenses]);
  const categoryExpensesData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);
  if (isLoading && expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-display">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Spend (This Month)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSpendThisMonth)}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              YTD Spend
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ytdSpend)}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Average Expense
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(averageExpense)}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-slate-900 border-slate-800 col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Monthly Expense Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpensesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpensesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryExpensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default DashboardPage;