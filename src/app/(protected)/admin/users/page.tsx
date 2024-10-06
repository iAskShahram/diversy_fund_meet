"use client";

import { api } from "@/trpc/react";
import { usePaginationParam } from "@/utils/hooks/usePaginationParam.hook";
import { Suspense } from "react";
import { DataTable } from "../meetings/_components/data-table";
import { AddUser } from "./_components/add-user";
import { columns } from "./_components/columns";

const Page = () => {
  const getPaginationParam = usePaginationParam();
  const perPage = getPaginationParam("perPage", 10, 100);
  const page = getPaginationParam("page", 1);
  const { data: users } = api.user.getAll.useQuery({
    perPage,
    page,
  });

  return (
    <div className="flex h-full flex-col p-8 pt-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manage Users</h1>
            <p className="text-sm text-muted-foreground">
              Connect with members and manage your team
            </p>
          </div>
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              <AddUser />
            </Suspense>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users?.users ?? []}
          totalCount={users?.totalCount ?? 0}
          perPage={perPage}
        />
      </div>
    </div>
  );
};

export default Page;
