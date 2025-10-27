"use client";

import { Button } from "@t2p-admin/ui/components/button";
import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { exportTableToCSV } from "@t2p-admin/ui/lib/export";
import { Transactions } from "../helpers/transaction-schema";

interface TransactionTableToolbarActionsProps {
  table: Table<Transactions>;
}

export function TransactionTableToolbarActions({
  table,
}: TransactionTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Download />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
