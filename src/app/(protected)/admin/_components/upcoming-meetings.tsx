import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UpcommingMeetingsContent } from "./upcomming-meetings-content";

export const UpcomingMeetings = ({ className }: { className?: string }) => {
  // get the stats here and pass it to the content
  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>Upcomming Meetings</CardTitle>
        <CardDescription>12 upcoming meetings this month</CardDescription>
      </CardHeader>
      <CardContent>
        <UpcommingMeetingsContent />
      </CardContent>
    </Card>
  );
};
