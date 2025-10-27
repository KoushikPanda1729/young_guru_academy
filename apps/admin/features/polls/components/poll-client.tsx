"use client";

import { IconTrophy, IconPlus } from "@tabler/icons-react";
import { Button } from "@t2p-admin/ui/components/button";
import { toast } from "sonner";
import { useEffect } from "react";
import { CreatePollInput, PollResponse } from "../helpers/polls.schema";
import { usePollSheet } from "../hooks/usePollSheet";
import { usePolls } from "../hooks/usePolls";
import { Header } from "../../../components/dashboard/page-header";
import { PollGrid } from "./poll-card";
import { Shell } from "@t2p-admin/ui/components/extra/shell";
import { PollSheet } from "./poll-sheet";

export default function PollClient() {
  const {
    isLoading,
    error,
    refetch,
    data,
    handleDelete,
    handleOpen,
    handleClose,
  } = usePolls({
    initialPageSize: 10,
    enabled: true,
  });

  const {
    isOpen,
    currentPoll,
    mode,
    isLoading: isSheetLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  } = usePollSheet();

  const handleSheetSave = async (data: CreatePollInput) => {
    await handleSave(data);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleEdit = (poll: PollResponse) => {
    openSheet(poll, "edit");
  };

  const handleDeletePoll = async (poll: PollResponse) => {
    try {
      await handleDelete(poll);
      toast.success("Poll deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete poll");
    }
  };

  const handleOpenPoll = async (poll: PollResponse) => {
    try {
      await handleOpen(poll);
      toast.success("Poll opened successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to open poll");
    }
  };

  const handleClosePoll = async (poll: PollResponse) => {
    try {
      await handleClose(poll);
      toast.success("Poll closed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to close poll");
    }
  };

  return (
    <>
      <section>
        <Header
          icon={<IconTrophy className="size-6 text-primary" />}
          title="Poll Management"
          description="Manage and organize Poll schedules"
          onRefresh={handleRefresh}
          refreshing={isLoading}
          actions={
            <Button
              size="sm"
              className="gap-2"
              onClick={() => openSheet(undefined, "create")}
            >
              <IconPlus className="size-4" />
              Add Poll
            </Button>
          }
        />
      </section>

      <section>
        <Shell>
          <PollGrid
            polls={data?.data ?? []}
            onEdit={handleEdit}
            onDelete={handleDeletePoll}
            onOpen={handleOpenPoll}
            onClose={handleClosePoll}
          />
        </Shell>
        <PollSheet
          poll={currentPoll}
          isOpen={isOpen}
          onClose={closeSheet}
          mode={mode}
          onModeChange={setMode}
          onSave={handleSheetSave}
          isLoading={isSheetLoading}
        />
      </section>
    </>
  );
}
