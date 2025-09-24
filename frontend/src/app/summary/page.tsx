"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#06b6d4", "#f59e0b", "#ef4444", "#a855f7", "#14b8a6", "#f43f5e"];

export default function SummaryPage() {
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTotalsByCategory().then((data) => setTotals(data)).finally(() => setLoading(false));
  }, []);

  const data = useMemo(() => Object.entries(totals).map(([name, value]) => ({ name, value })), [totals]);

  return (
    <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category (Bar)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
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
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category (Pie)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={110}>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
