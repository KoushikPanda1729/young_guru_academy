import { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@t2p-admin/ui/components/pagination";

interface TablePaginationNavigationProps<TData> {
  table: Table<TData>;
}

export default function TablePaginationNavigation<TData>({
  table,
}: TablePaginationNavigationProps<TData>) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="rounded-md hover:cursor-pointer">
          <PaginationPrevious onClick={() => table.previousPage()} />
        </PaginationItem>
        {table.getState().pagination.pageIndex + 1 >= 4 && (
          <PaginationItem className="rounded-md hover:cursor-pointer">
            <PaginationLink onClick={() => table.setPageIndex(0)}>
              1
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 >= 5 && (
          <PaginationItem className="rounded-md hover:cursor-pointer">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {/* 2 pages before */}
        {table.getState().pagination.pageIndex + 1 - 2 > 0 && (
          <PaginationItem className="rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex - 2)
              }
            >
              {table.getState().pagination.pageIndex + 1 - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {/* 1 page before */}
        {table.getState().pagination.pageIndex + 1 - 1 > 0 && (
          <PaginationItem className="rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex - 1)
              }
            >
              {table.getState().pagination.pageIndex + 1 - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {/* Current page */}
        <PaginationItem className="rounded-md">
          <PaginationLink>
            {table.getState().pagination.pageIndex + 1}
          </PaginationLink>
        </PaginationItem>
        {/* 1 page after */}
        {table.getState().pagination.pageIndex + 1 + 1 <=
          table?.getPageCount() && (
          <PaginationItem className="rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex + 1)
              }
            >
              {table.getState().pagination.pageIndex + 1 + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {/* 2 page after */}
        {table.getState().pagination.pageIndex + 1 + 2 <=
          table?.getPageCount() && (
          <PaginationItem className="rounded-md hover:cursor-pointer">
            <PaginationLink
              onClick={() =>
                table.setPageIndex(table.getState().pagination.pageIndex + 2)
              }
            >
              {table.getState().pagination.pageIndex + 1 + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 + 2 <
          table?.getPageCount() - 1 && (
          <PaginationItem className="rounded-md">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {table.getState().pagination.pageIndex + 1 + 2 <
          table?.getPageCount() && (
          <>
            <PaginationItem className="rounded-md hover:cursor-pointer">
              <PaginationLink
                onClick={() => table.setPageIndex(table?.getPageCount())}
              >
                {table?.getPageCount()}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem className=" rounded-md hover:cursor-pointer">
          <PaginationNext onClick={() => table.nextPage()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}