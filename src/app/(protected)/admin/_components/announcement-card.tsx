"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AnnouncementCard = ({
  Icon,
  title,
  announcement,
}: {
  Icon: React.ReactElement;
  title: string;
  announcement: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    url: string;
    createdById: string;
  };
}) => {
  const router = useRouter();
  const { mutate: deleteAnnouncement, isPending } =
    api.announcement.deleteOne.useMutation({
      onSuccess: () => {
        toast.success("Announcement deleted successfully");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="flex justify-between gap-6 p-2 hover:rounded-lg hover:bg-accent">
      <a
        className="flex flex-grow cursor-pointer gap-4"
        href={announcement.url}
        target="_blank"
      >
        <div className="flex items-center justify-center">{Icon}</div>
        <div>
          <h4 className="font-normal text-primary opacity-80">{title}</h4>
          <p className="text-sm">{announcement.title}</p>
        </div>
      </a>
      <div className="flex items-center">
        <Button
          variant={"outline"}
          className="border border-destructive"
          disabled={isPending}
          onClick={() => deleteAnnouncement({ id: announcement.id })}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};
