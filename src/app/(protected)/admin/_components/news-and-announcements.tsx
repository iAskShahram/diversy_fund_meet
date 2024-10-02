import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Megaphone, Newspaper } from "lucide-react";
import { CreatePostButton } from "./atoms/create-post-button";
import { NewsCard } from "./news-card";

export const NewsAndAnnouncements = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>News & Announcements</CardTitle>
          <CreatePostButton />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <NewsCard
              key={index}
              Icon={
                index % 2 === 0 ? (
                  <Newspaper className="h-7 w-7 opacity-60" />
                ) : (
                  <Megaphone className="h-7 w-7 opacity-60" />
                )
              }
              title={index % 2 === 0 ? "News" : "Announcement"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos."
              cardId="primary-id"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
