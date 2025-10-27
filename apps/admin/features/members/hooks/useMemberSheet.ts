// "use client"

// import { useState, useCallback } from "react"
// import type { CreateMemberInput, MemberType } from "@/features/members/helpers/members-schema"
// import { api } from "@/lib/api"
// import { toast } from "sonner"

// interface UseMemberSheetReturn {
//   isOpen: boolean
//   currentMember: MemberType | null
//   mode: "view" | "edit" | "create"
//   isLoading: boolean
//   openSheet: (member?: MemberType | null, mode?: "view" | "edit" | "create") => void
//   closeSheet: () => void
//   setMode: (mode: "view" | "edit" | "create") => void
//   handleSave: (data: Partial<MemberType>) => Promise<void>
// }

// export function useMemberSheet(): UseMemberSheetReturn {
//   const [isOpen, setIsOpen] = useState(false)
//   const [currentMember, setCurrentMember] = useState<MemberType | null>(null)
//   const [mode, setMode] = useState<"view" | "edit" | "create">("view")
//   const [isLoading, setIsLoading] = useState(false)

//   const openSheet = useCallback(
//     (member?: MemberType | null, initialMode: "view" | "edit" | "create" = "view") => {
//       setCurrentMember(member ?? null)
//       setMode(initialMode)
//       setIsOpen(true)
//     },
//     [],
//   )

//   const closeSheet = useCallback(() => {
//     setIsOpen(false)
//     setCurrentMember(null)
//     setMode("view")
//   }, [])

//   const handleSave = useCallback(
//     async (data: CreateMemberInput) => {
//       setIsLoading(true)
//       try {
//         if (mode === "create") {
//           const created = await api.members.createMember(data)
//           setCurrentMember(created.data)
//           setMode("view")
//           toast.success("Member added successfully")
//         } else if (currentMember) {
//           await api.members.updateMemberById(
//             { id: currentMember.id },
//             data
//           )
//           setCurrentMember((prev) => (prev ? { ...prev, ...data } : null))
//           toast.success("Member updated successfully")
//         }
//       } catch (error) {
//         console.error("Error saving member:", error)
//         throw error
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [currentMember, mode]
//   )

//   return {
//     isOpen,
//     currentMember,
//     mode,
//     isLoading,
//     openSheet,
//     closeSheet,
//     setMode,
//     handleSave,
//   }
// }
