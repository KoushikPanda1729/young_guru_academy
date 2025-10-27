"use client"

import {
  IconCirclePlusFilled,
  IconMail,
  IconChevronDown,
  type Icon,
} from "@tabler/icons-react"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@t2p-admin/ui/components/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@t2p-admin/ui/components/sidebar"

type NavItem = {
  title: string
  url?: string
  icon?: Icon
  permission?: {
    resource: string
    action: string
  }
  roles?: string[]
  subMenu?: NavItem[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Show all items, no permission checks
  const allowedItems = items

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create Section */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Main Menu */}
        <SidebarMenu>
          {allowedItems.map((item) => {
            const isActive = pathname === item.url
            const hasSub = !!item.subMenu?.length
            const isSubOpen = openMenus[item.title] || false

            return (
              <SidebarMenuItem key={item.title}>
                {hasSub ? (
                  <>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => toggleMenu(item.title)}
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1">{item.title}</span>
                      <IconChevronDown
                        className={`transition-transform ${
                          isSubOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </SidebarMenuButton>
                    {isSubOpen && (
                      <SidebarMenuSub>
                        {item.subMenu?.map((subItem) => {
                          const isSubActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={isSubActive}
                                onClick={() =>
                                  subItem.url && router.push(subItem.url)
                                }
                              >
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    onClick={() => item.url && router.push(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
