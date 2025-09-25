"use client";

import { useEffect, useMemo, useState } from "react";
import { api, Transaction } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line, Legend } from "recharts";
import { Spinner } from "@/components/ui/spinner";

const COLORS = ["#6366f1", "#22c55e", "#06b6d4", "#f59e0b", "#ef4444", "#a855f7", "#14b8a6", "#f43f5e"];

export default function SummaryPage() {
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTotalsByCategory(), api.getAllTransactions()])
      .then(([t, trs]) => {
        setTotals(t);
        setTransactions(trs);
      })
      .finally(() => setLoading(false));
  }, []);

  const data = useMemo(() => Object.entries(totals).map(([name, value]) => ({ name, value })), [totals]);
  const lineData = useMemo(() => {
    // Aggregate by date (YYYY-MM-DD)
    const map = new Map<string, number>();
    for (const t of transactions) {
      map.set(t.date, (map.get(t.date) || 0) + t.amount);
    }
    // Sort by date ascending
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, value]) => ({ date, value }));
  }, [transactions]);

  return (
    <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category (Bar)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Loading...</div>
          ) : data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
        <CardHeader>
          <CardTitle>Spending by Category (Pie)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Loading...</div>
          ) : data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
        <CardHeader>
          <CardTitle>Spending Over Time (Line)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Loading...</div>
          ) : lineData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#5FA8D3" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
