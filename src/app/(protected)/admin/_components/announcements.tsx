import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { isAdmin } from "@/utils/auth.util";
import { Megaphone, Newspaper } from "lucide-react";
import type { Session } from "next-auth";
import { AnnouncementCard } from "./announcement-card";
import { CreatePostButton } from "./atoms/create-post-button";
import { NoContentCard } from "./no-content-card";

export const Announcements = async ({
  className,
  session,
}: {
  className?: string;
  session: Session;
}) => {
  const announcements = await api.announcement.getAll();
  return (
    <Card className={cn("col-span-4 h-fit", className)}>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>News & Announcements</CardTitle>
          {isAdmin(session) && <CreatePostButton />}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id}
              Icon={
                index % 2 === 0 ? (
                  <Newspaper className="h-7 w-7 opacity-60" />
                ) : (
                  <Megaphone className="h-7 w-7 opacity-60" />
                )
              }
              title={index % 2 === 0 ? "News" : "Announcement"}
              announcement={announcement}
              session={session}
            />
          ))
        ) : (
          <>
            <NoContentCard
              heading="No New Announcements or News"
              description={[
                "You have no recent announcements or news at the moment.",
              ]}
              className="h-[28.7rem]"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
