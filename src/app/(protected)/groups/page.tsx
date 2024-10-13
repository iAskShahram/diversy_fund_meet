"use client";

import { api } from "@/trpc/react";
import { useIsAdmin } from "@/utils/hooks/useIsAdmin.hook";
import { usePaginationParam } from "@/utils/hooks/usePaginationParam.hook";
import { Suspense } from "react";
import { adminColumns, userColumns } from "@/app/(protected)/admin/groups/_components/columns";
import { CreateGroup } from "@/app/(protected)/admin/groups/_components/create-group";
import { DataTable } from "@/app/(protected)/admin/meetings/_components/data-table";

const Page = () => {
  const isAdmin = useIsAdmin();
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
            <h1 className="text-2xl font-bold">
              {isAdmin ? "Manage" : ""} Groups
            </h1>
            <p className="text-sm text-muted-foreground">
              View and explore the groups
            </p>
          </div>
          {isAdmin && (
            <div>
              <Suspense fallback={<>...</>}>
                <CreateGroup />
              </Suspense>
            </div>
          )}
        </div>

        <DataTable
          columns={isAdmin ? adminColumns : userColumns}
          data={groups?.groups ?? []}
          totalCount={groups?.totalCount ?? 0}
          perPage={perPage}
        />
      </div>
    </div>
  );
};

export default Page;
