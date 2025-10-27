"use client";

import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import * as React from "react";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@t2p-admin/ui/components/data-table/data-table-action-bar";
import { Separator } from "@t2p-admin/ui/components/separator";
import { exportTableToCSV } from "@t2p-admin/ui/lib/export";
import { Transactions } from "../helpers/transaction-schema";

type Action = "export";

interface TransactionssTableActionBarProps {
  table: Table<Transactions>;
}

export function TransactionssTableActionBar({
  table,
}: TransactionssTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const onTransactionsExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />

      <div className="flex items-center gap-1.5">
        {/* Export */}
        <DataTableActionBarAction
          size="icon"
          tooltip="Export transactions"
          isPending={getIsActionPending("export")}
          onClick={onTransactionsExport}
        >
          <Download />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
