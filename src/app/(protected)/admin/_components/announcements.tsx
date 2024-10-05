import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Megaphone, Newspaper } from "lucide-react";
import { CreatePostButton } from "./atoms/create-post-button";
import { AnnouncementCard } from "./announcement-card";

export const Announcements = async ({
  className,
}: {
  className?: string;
}) => {
  const announcements = await api.announcement.getAll();
  return (
    <Card className={cn("col-span-4 h-fit", className)}>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>News & Announcements</CardTitle>
          <CreatePostButton />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {announcements.map((announcement, index) => (
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
          />
        ))}
      </CardContent>
    </Card>
  );
};
