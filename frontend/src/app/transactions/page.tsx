"use client";

import { useEffect, useState } from "react";
import { api, Transaction } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllTransactions().then((data) => setItems(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap">{t.date}</td>
                      <td className="py-2 pr-4">{t.category}</td>
                      <td className="py-2 pr-4 max-w-[240px] truncate">{t.description}</td>
                      <td className="py-2 text-right">£{t.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
