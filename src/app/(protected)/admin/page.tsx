import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Announcements } from "./_components/announcements";
import { StatCards } from "./_components/stat-cards";
import { UpcomingMeetings } from "./_components/upcoming-meetings";

const Page = () => {
  return (
    <div className="flex h-full flex-col p-8 pt-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href={"/admin/calender"}>
            <Button>View Calendar</Button>
          </Link>
        </div>
        <div>
          <StatCards />
        </div>
        <div className="flex h-full gap-6">
          <UpcomingMeetings className="w-1/2" />
          <Announcements className="w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Page;
