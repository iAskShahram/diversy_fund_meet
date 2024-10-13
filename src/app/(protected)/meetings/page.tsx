"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventStatus } from "@/lib/validators/event.validator";
import { api } from "@/trpc/react";
import { usePaginationParam } from "@/utils/hooks/usePaginationParam.hook";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "@/app/(protected)/admin/meetings/_components/columns";
import { CreateMeeting } from "@/app/(protected)/admin/meetings/_components/create-meeting";
import { DataTable } from "@/app/(protected)/admin/meetings/_components/data-table";

const Page = () => {
  const getPaginationParam = usePaginationParam();
  const perPage = getPaginationParam("perPage", 10, 100);
  const page = getPaginationParam("page", 1);
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = Object.values(EventStatus).includes(
    searchParams.get("status") as EventStatus,
  )
    ? searchParams.get("status")!
    : EventStatus.UPCOMING;

  const { data: events } = api.event.getAll.useQuery({
    perPage,
    page,
    status,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const _searchParams = new URLSearchParams(searchParams.toString());
    _searchParams.set("status", e.currentTarget.name);
    router.push(`/meetings?${_searchParams.toString()}`);
  };
  
  return (
    <div className="flex h-full flex-col p-8 pt-6">
      <div className="flex h-full flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Meetings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your schedual & stay up to date
          </p>
        </div>

        <Tabs
          defaultValue={EventStatus.UPCOMING}
          value={status as EventStatus}
          className="h-full space-y-6"
        >
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger
                value={EventStatus.UPCOMING}
                name={EventStatus.UPCOMING}
                onClick={handleClick}
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value={EventStatus.PAST}
                name={EventStatus.PAST}
                onClick={handleClick}
              >
                Past
              </TabsTrigger>
            </TabsList>
            <CreateMeeting />
          </div>
          <TabsContent value={status} className="border-none p-0 outline-none">
            <DataTable
              columns={columns}
              data={events?.events ?? []}
              totalCount={events?.totalCount ?? 0}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
