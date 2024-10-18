import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UpcommingMeetingsContent } from "./upcomming-meetings-content";
import { Session } from "next-auth";

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
        <CardTitle>Upcomming Meetings</CardTitle>
        <CardDescription>upcoming meetings this month</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <UpcommingMeetingsContent session={session} />
      </CardContent>
    </Card>
  );
};
