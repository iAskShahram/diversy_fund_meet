import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { isAdmin } from "@/utils/auth.util";
import { format } from "date-fns";
import { Session } from "next-auth";
import Link from "next/link";

export const UpcommingMeetingsContent = async ({
  session,
}: {
  session: Session;
}) => {
  const events = await api.event.getLastFour();
  return (
    <div className="flex flex-col justify-between gap-12">
      <div className="flex h-max flex-col gap-3">
        {events.map((event, index) => (
          <MeetingCard
            key={event.id}
            title={event.title}
            date={event.dateTime}
            description={event.groups.map((group) => group.name).join(", ")}
          />
        ))}
      </div>
      <div>
        <Link href={isAdmin(session) ? "/admin/meetings" : "/meetings"}>
          <Button variant={"outline"} className="w-full">
            Manage all upcoming meetings
          </Button>
        </Link>
      </div>
    </div>
  );
};

const MeetingCard = ({
  title,
  date,
  description,
}: {
  title: string;
  date: Date;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-gray-50 p-4 hover:bg-gray-100">
      <div className="flex justify-between">
        <h4 className="font-medium leading-none tracking-tight">{title}</h4>
        <p className="text-xs text-muted-foreground">
          {format(date, "MMM d, yyyy h:mm a")}
        </p>
      </div>
      <p className="w-2/3 truncate text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
