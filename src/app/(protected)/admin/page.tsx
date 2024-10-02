import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NewsAndAnnouncements } from "./_components/news-and-announcements";
import { StatCards } from "./_components/stat-cards";
import { UpcomingMeetings } from "./_components/upcoming-meetings";

const page = () => {
  return (
    <div className="flex w-full flex-col p-16">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href={"/admin/calender"}>
            <Button>View Calendar</Button>
          </Link>
        </div>
        <div>
          <StatCards />
        </div>
        <div className="flex w-full gap-6">
          <UpcomingMeetings className="h-full w-1/2" />
          <UpcomingMeetings className="h-full w-1/2" />
          {/* <NewsAndAnnouncements className="w-1/2" /> */}
        </div>
      </div>
    </div>
  );
};

export default page;
