"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@t2p-admin/ui/components/sidebar";
import { Button } from "@t2p-admin/ui/components/button";
import { IconRefresh, IconMenu2, IconX } from "@tabler/icons-react";

interface HeaderProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  actions?: React.ReactNode;
  showModeToggle?: boolean;
  className?: string;
  iconTogglesSidebar?: boolean;
}

export function Header({
  icon,
  title,
  description,
  onRefresh,
  refreshing,
  actions,
  className,
  iconTogglesSidebar = true,
}: HeaderProps) {
  const { toggleSidebar, state } = useSidebar();

  const [hovered, setHovered] = React.useState(false);

  return (
    <header
      className={`flex mt-6 shrink-0 items-center gap-2 transition-[width,height] ease-linear${className ?? ""}`}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {iconTogglesSidebar && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={
                state === "expanded" ? "Close sidebar" : "Open sidebar"
              }
              title={state === "expanded" ? "Close Sidebar" : "Open Sidebar"}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative p-2 bg-primary/10 rounded-lg -ml-1 inline-flex items-center justify-center hover:bg-primary/20 transition"
            >
              <AnimatePresence mode="wait" initial={false}>
                {hovered ? (
                  <motion.div
                    key={state === "expanded" ? "close" : "menu"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {state === "expanded" ? (
                      <IconX className="size-5 text-primary" />
                    ) : (
                      <IconMenu2 className="size-5 text-primary" />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="page-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {icon}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}

          {(title || description) && (
            <div>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="gap-2"
                disabled={refreshing}
              >
                <IconRefresh
                  className={`size-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            )}
            {actions}
          </>
        </div>
      </div>
    </header>
  );
}
