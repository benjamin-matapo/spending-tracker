import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>About Spending Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 leading-relaxed text-muted-foreground">
          <p>
            Spending Tracker is a simple yet powerful tool to help you take control of your finances.
          </p>
          <p>
            With it, you can log daily expenses, categorize your spending, and view insights through easy-to-read charts and graphs.
          </p>
          <p>
            Whether you’re budgeting for the month or just curious about where your money goes, Spending Tracker makes it clear and effortless.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
