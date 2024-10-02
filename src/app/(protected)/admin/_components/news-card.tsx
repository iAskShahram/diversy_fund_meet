"use client";

import { Button } from "@/components/ui/button";
// import { api } from "@/trpc/react";
import { Trash2 } from "lucide-react";

export const NewsCard = ({
  Icon,
  title,
  description,
  cardId,
}: {
  Icon: React.ReactElement;
  title: string;
  description: string;
  cardId: string;
}) => {
  //   const { mutate: deleteNews } = api.newsAndAnnouncements.delete.useMutation();

  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        <div className="flex items-center justify-center">
          {Icon}
        </div>
        <div>
          <h4 className="font-normal text-primary opacity-80">{title}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          variant={"outline"}
          className="border border-destructive"
          //   onClick={() => deleteNews({ id: cardId })}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};
