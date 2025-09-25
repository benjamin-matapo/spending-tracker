"use client";

import { useEffect, useState } from "react";
import { api, Transaction } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

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
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Loading...</div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4 whitespace-nowrap">Date</th>
                    <th className="py-2 pr-4 whitespace-nowrap">Category</th>
                    <th className="py-2 pr-4 whitespace-nowrap text-right">Amount</th>
                    <th className="py-2 pr-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap">{t.date}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{t.category}</td>
                      <td className="py-2 pr-4 whitespace-nowrap text-right">£{t.amount.toFixed(2)}</td>
                      <td className="py-2 pr-4 max-w-[240px] truncate">{t.description}</td>
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
