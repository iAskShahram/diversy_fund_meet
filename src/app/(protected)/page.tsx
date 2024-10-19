import { auth } from "@/server/auth";
import { isAdmin } from "@/utils/auth.util";
import { Announcements } from "./admin/_components/announcements";
import { StatCards } from "./admin/_components/stat-cards";
import { UpcomingMeetings } from "./admin/_components/upcoming-meetings";

const Page = async () => {
  const session = await auth();
  return (
    <div className="flex h-full flex-col p-8 pt-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">
            {isAdmin(session!) && `Admin `}Dashboard
          </h1>
        </div>
        <div>
          <StatCards />
        </div>
        <div className="flex h-full gap-6">
          <UpcomingMeetings className="w-1/2" session={session!} />
          <Announcements className="w-1/2" session={session!} />
        </div>
      </div>
    </div>
  );
};

export default Page;
