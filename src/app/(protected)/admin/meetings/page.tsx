import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMeeting } from "./_components/atoms/create-meeting";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import type { Meeting } from "./_components/columns";

export const metadata = {
  title: "Meetings",
  description: "Manage your meetings & stay up to date",
};

async function getData(): Promise<Meeting[]> {
  return Array.from({ length: 100 }, (_, index) => ({
    id: index.toString(),
    email: `test${index}@test.com`,
    title: `Meeting ${index}`,
    meet_link: `https://meet.google.com/abc${index}`,
    datetime: "2024-01-01 10:00:00",
  }));
}

const page = async () => {
  const data = await getData();
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
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <CreateMeeting />
          </div>
          <TabsContent
            value="upcoming"
            className="border-none p-0 outline-none"
          >
            <DataTable columns={columns} data={data} totalRows={data.length} />
          </TabsContent>
          <TabsContent value="past" className="border-none p-0 outline-none">
            <DataTable columns={columns} data={data} totalRows={data.length} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
