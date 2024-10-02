import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const CreateMeeting = () => {
  return (
    <div className="ml-auto mr-4">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Create Meeting
      </Button>
    </div>
  );
};
