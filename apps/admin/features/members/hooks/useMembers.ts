// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import React, { useCallback, useState } from "react";
// import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
// import { organization } from "@/features/auth/core/auth";
// import { MembersResponse } from "../helpers/members-schema";

// export function useMembers(organizationId: string) {
//   const queryClient = useQueryClient();
//   const [error, setError] = useState<string>("");

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [pagination, setPagination] = useState<{ pageIndex: number; pageSize: number }>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const [query, setQuery] = useState({
//     limit: 10,
//     offset: 0,
//     sortBy: "createdAt" as string,
//     sortDirection: "desc" as "asc" | "desc",
//     filterField: undefined as string | undefined,
//     filterOperator: undefined as
//       | "contains"
//       | "lt"
//       | "eq"
//       | "ne"
//       | "lte"
//       | "gt"
//       | "gte"
//       | undefined,
//     filterValue: undefined as string | number | boolean | undefined,
//   });

//   const updateQuery = useCallback(
//     (updates: Partial<typeof query>) => {
//       setQuery((prev) => ({
//         ...prev,
//         ...updates,
//       }));
//     },
//     []
//   );

//   React.useEffect(() => {
//     updateQuery({
//       limit: pagination.pageSize,
//       offset: pagination.pageIndex * pagination.pageSize,
//     });
//   }, [pagination, updateQuery]);

//   React.useEffect(() => {
//     if (sorting.length > 0) {
//       const sort = sorting[0]!;
//       updateQuery({
//         sortBy: sort.id,
//         sortDirection: sort.desc ? "desc" : "asc",
//         offset: 0,
//       });
//     } else {
//       updateQuery({
//         sortBy: "createdAt",
//         sortDirection: "desc",
//       });
//     }
//   }, [sorting, updateQuery]);

//   React.useEffect(() => {
//     if (columnFilters.length > 0 && columnFilters[0]) {
//       const { id, value } = columnFilters[0];
//       if (
//         id &&
//         (typeof value === "string" ||
//           typeof value === "number" ||
//           typeof value === "boolean")
//       ) {
//         updateQuery({
//           filterField: id,
//           filterValue: value,
//           filterOperator: "contains",
//           offset: 0,
//         });
//       }
//     } else {
//       updateQuery({
//         filterField: undefined,
//         filterValue: undefined,
//         filterOperator: undefined,
//       });
//     }
//   }, [columnFilters, updateQuery]);

//   const { data: members, isLoading, refetch } = useQuery<MembersResponse>({
//     queryKey: ["members", organizationId, query],
//     queryFn: async () => {
//       try {
//         const { data, error } = await organization.listMembers({
//           query: {
//             organizationId,
//           ...query,
//           }
//         });
//         if (error) throw new Error(error.message || "Failed to list members");
//         setError("");
//         return data;
//       } catch (err) {
//         setError((err as Error).message || "Unknown error fetching members");
//         throw err;
//       }
//     },
//   });

//   const removeMember = useMutation({
//     mutationFn: async (input: { memberId: string }) => {
//       return organization.removeMember({
//         memberIdOrEmail: input.memberId
//       });
//     },
//     onSuccess: () => {
//       setError("");
//       queryClient.invalidateQueries({ queryKey: ["members", organizationId] });
//     },
//     onError: (err) => {
//       setError((err as Error).message || "Failed to remove member");
//     },
//   });

//   return {
//     members,
//     isLoading,
//     refetch,
//     error,
//     setError,
//     columnFilters,
//     sorting,
//     setSorting,
//     setColumnFilters,
//     pagination,
//     setPagination,
//     removeMember,
//   };
// }
