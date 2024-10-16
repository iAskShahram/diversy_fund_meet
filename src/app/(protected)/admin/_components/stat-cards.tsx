import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/server";
import {
  CalendarDays,
  type LucideProps,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

export const StatCards = async () => {
  const { proposedEvents, totalUsers, upcomingEvents } =
    await api.genral.indexMeta();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Proposed Meetings"
        value={proposedEvents}
        description="proposed this month"
        RIcon={CalendarDays}
      />
      <StatCard
        title="Upcomming Meetings"
        value={upcomingEvents}
        description="this month"
        RIcon={CalendarDays}
      />
      <StatCard
        title="RSVP Pending"
        value={15}
        description="pending responses"
        RIcon={TriangleAlert}
      />
      <StatCard
        title="Total Users"
        value={totalUsers}
        description="registered users"
        RIcon={UsersRound}
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  description,
  RIcon,
}: {
  title: string;
  value: number;
  description: string;
  RIcon: React.ComponentType<LucideProps>;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <RIcon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
