"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

const categories = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Utilities",
  "Health",
  "Shopping",
  "Other",
];

export default function AddTransactionPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        amount: parseFloat(amount),
        category,
        date,
        description,
      };
      await api.addTransaction(payload);
      setMessage("Transaction added!");
      setAmount("");
      setCategory("");
      setDate(today);
      setDescription("");
    } catch (err: any) {
      setMessage(err?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto min-h-[70vh] flex items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
          <CardDescription>Record a new expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="flex items-center gap-2">
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="flex-1" />
                <Button type="button" variant="outline" size="sm" onClick={() => setDate(today)}>
                  Today
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Add"}</Button>
            {message && <p className="text-sm text-muted-foreground text-center">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
