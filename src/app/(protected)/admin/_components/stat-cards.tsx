import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/server";
import {
  CalendarDays,
  ExternalLink,
  type LucideProps,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

export const StatCards = async () => {
  const { upcomingEvents, rsvpPending } = await api.genral.indexMeta();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <InfoCard
        title="Fund 4 Introduction"
        link="https://share.hsforms.com/18Om4MhvUQMWSr9CdEiSXIQejxgs"
      />
      <StatCard
        title="Upcoming Meetings"
        value={upcomingEvents}
        description="this month"
        RIcon={CalendarDays}
      />
      <StatCard
        title="RSVP Pending"
        value={rsvpPending}
        description="pending responses"
        RIcon={TriangleAlert}
      />
      <InfoCard
        title="Parent company introduction"
        link="https://share.hsforms.com/1NmlKf85KT5eZEQKmjk9oHQejxgs"
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
    <Card className="h-[126px]">
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

const InfoCard = ({ title, link }: { title: string; link: string }) => {
  return (
    <Link href={link} target="_blank" className="h-full">
      <Card className="h-full min-h-[126px]">
        <CardContent className="flex h-full items-center justify-center bg-blue-50 p-6">
          <h2 className="flex gap-2 text-2xl font-bold text-gray-700">
            {title}{" "}
            <div className="flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-blue-400" />
            </div>
          </h2>
        </CardContent>
      </Card>
    </Link>
  );
};
