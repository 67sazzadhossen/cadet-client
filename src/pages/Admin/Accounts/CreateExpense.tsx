"use client";

import { DashboardButton, DashboardField, DashboardPageShell, GlassPanel } from "@/components/dashboard/GlassUI";
import { useCreateExpenseMutation } from "@/redux/features/accounts/accountsApi";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

const initialExpense = () => ({
  title: "",
  category: "Office",
  amount: "",
  expenseDate: new Date().toISOString().slice(0, 10),
  note: "",
});

export default function CreateExpense() {
  const [form, setForm] = useState(initialExpense);
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const setField = (key: keyof ReturnType<typeof initialExpense>, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createExpense({ ...form, amount: Number(form.amount) }).unwrap();
      toast.success("Expense added successfully");
      setForm(initialExpense());
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not add expense");
    }
  };

  return <DashboardPageShell title="Add Expense" description="Create a permanent expense record. Existing records cannot be edited here.">
    <GlassPanel className="mx-auto max-w-3xl p-4 sm:p-6">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <DashboardField label="Expense title"><input required className="dashboard-input" value={form.title} onChange={(e) => setField("title", e.target.value)} /></DashboardField>
        <DashboardField label="Category"><select className="dashboard-input" value={form.category} onChange={(e) => setField("category", e.target.value)}><option>Office</option><option>Utilities</option><option>Salary</option><option>Maintenance</option><option>Academic</option><option>Other</option></select></DashboardField>
        <DashboardField label="Amount"><input required min="0.01" step="0.01" type="number" className="dashboard-input" value={form.amount} onChange={(e) => setField("amount", e.target.value)} /></DashboardField>
        <DashboardField label="Expense date"><input required type="date" className="dashboard-input" value={form.expenseDate} onChange={(e) => setField("expenseDate", e.target.value)} /></DashboardField>
        <div className="sm:col-span-2"><DashboardField label="Note"><textarea rows={4} className="dashboard-input" value={form.note} onChange={(e) => setField("note", e.target.value)} /></DashboardField></div>
        <div className="sm:col-span-2 flex justify-end"><DashboardButton disabled={isLoading} type="submit">{isLoading ? "Saving…" : "Add expense"}</DashboardButton></div>
      </form>
    </GlassPanel>
  </DashboardPageShell>;
}
