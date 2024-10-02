import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMeeting } from "./_components/atoms/create-meeting";

export const metadata = {
  title: "Meetings",
  description: "Manage your meetings & stay up to date",
};

const page = () => {
  return (
    <div className="flex h-full flex-col p-8 pt-6">
      <div className="flex h-full flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Meetings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your schedual & stay up to date
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="h-full space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="upcoming" >Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <CreateMeeting />
          </div>
          <TabsContent value="upcoming" className="border-none p-0 outline-none">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Listen Now - Music
                </h2>
                <p className="text-sm text-muted-foreground">
                  Top picks for you. Updated daily.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="past" className="border-none p-0 outline-none">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Listen Now - Podcasts
                </h2>
                <p className="text-sm text-muted-foreground">
                  Top picks for you. Updated daily.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
