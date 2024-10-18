import { auth } from "@/server/auth";
import { Announcements } from "./_components/announcements";
import { StatCards } from "./_components/stat-cards";
import { UpcomingMeetings } from "./_components/upcoming-meetings";
import { Session } from "@auth/core/types";

const Page = async () => {
  const session = (await auth()) as Session;
  return (
    <div className="flex h-full flex-col p-8 pt-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div>
          <StatCards />
        </div>
        <div className="flex h-full gap-6">
          <UpcomingMeetings className="w-1/2" session={session} />
          <Announcements session={session} className="w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Page;
