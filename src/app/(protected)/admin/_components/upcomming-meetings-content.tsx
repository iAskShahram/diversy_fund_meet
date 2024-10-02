import { Button } from "@/components/ui/button";
import Link from "next/link";

export const UpcommingMeetingsContent = () => {
  return (
    <div className="flex flex-col justify-between gap-12">
      <div className="flex h-max flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <MeetingCard
            key={index}
            title="Board Meeting"
            date="12:00 PM - 2:00 PM"
            description="Executive Steering Committee"
          />
        ))}
      </div>
      <div>
        <Link href="/admin/meetings">
          <Button variant={'outline'} className="w-full">Manage all upcoming meetings</Button>
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
  date: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-gray-50 p-4 hover:bg-gray-100">
      <div className="flex justify-between">
        <h4 className="font-medium leading-none tracking-tight">{title}</h4>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};
