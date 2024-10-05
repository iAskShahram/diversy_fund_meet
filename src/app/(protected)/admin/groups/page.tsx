"use client";

import { api } from "@/trpc/react";
import { DataTable } from "../meetings/_components/data-table";
import { columns } from "./_components/columns";
import { CreateGroup } from "./_components/create-group";
import { usePaginationParam } from "@/utils/hooks/usePaginationParam.hook";
import { Suspense } from "react";

const Page = () => {
  const getPaginationParam = usePaginationParam();
  const perPage = getPaginationParam("perPage", 10, 100);
  const page = getPaginationParam("page", 1);
  const { data: groups } = api.group.getAll.useQuery({
    perPage,
    page,
  });

  return (
    <div className="flex h-full flex-col p-8 pt-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Groups</h1>
            <p className="text-sm text-muted-foreground">
              View and explore the groups
            </p>
          </div>
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              <CreateGroup />
            </Suspense>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={groups?.groups ?? []}
          totalCount={groups?.totalCount ?? 0}
          perPage={perPage}
        />
      </div>
    </div>
  );
};

export default Page;
