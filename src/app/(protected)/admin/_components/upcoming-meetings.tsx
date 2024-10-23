import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";
import { UpcommingMeetingsContent } from "./upcomming-meetings-content";

export const UpcomingMeetings = ({
  className,
  session,
}: {
  className?: string;
  session: Session;
}) => {
  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
        {/* <CardDescription>upcoming meetings this month</CardDescription> */}
      </CardHeader>
      <CardContent className="h-full">
        <UpcommingMeetingsContent session={session} />
      </CardContent>
    </Card>
  );
};
