import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export const StatCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Proposed />
      <Proposed />
      <Proposed />
      <Proposed />
    </div>
  );
};

const Proposed = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Proposed Meetings</CardTitle>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg> */}
        <CalendarDays className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">8</div>
        <p className="text-xs text-muted-foreground">proposed this month</p>
      </CardContent>
    </Card>
  );
};
