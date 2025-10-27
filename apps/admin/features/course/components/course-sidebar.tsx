// "use client"

// import React, { useCallback, useEffect, useState } from "react"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarRail,
// } from "@t2p-admin/ui/components/sidebar"
// import {
//   ChevronRight,
//   File,
//   Folder,
//   Video,
//   ListChecks,
//   FileText,
//   MoreVertical,
//   Upload,
//   FolderPlus,
//   Edit,
//   Trash,
// } from "lucide-react"
// import {
//   Collapsible,
//   CollapsibleTrigger,
//   CollapsibleContent,
// } from "@t2p-admin/ui/components/collapsible"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@t2p-admin/ui/components/dropdown-menu"
// import { Input } from "@t2p-admin/ui/components/input"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@t2p-admin/ui/components/alert-dialog"
// import {
//   CourseContentNode,
//   CourseFolderNode,
//   CourseTree,
// } from "../helpers/course.schema"
// import { api } from "@/lib/api"

// export function CourseSidebar({
//   courseId,
//   onSelectContent,
//   ...props
// }: {
//   courseId: string
//   onSelectContent?: (c: CourseContentNode) => void
// } & React.ComponentProps<typeof Sidebar>) {
//   const [tree, setTree] = useState<CourseTree | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [creatingFolder, setCreatingFolder] = useState(false)
//   const [newFolderName, setNewFolderName] = useState("")
//   const [submitting, setSubmitting] = useState(false)
//   const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

//   const fetchTree = useCallback(async () => {
//     setLoading(true)
//     try {
//       const course = await api.courses.getCourseTree({ id: courseId })
//       setTree(course.data)
//     } catch (error) {
//       console.error("Failed to fetch course tree:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [courseId])

//   useEffect(() => {
//     if (courseId) fetchTree()
//   }, [courseId, fetchTree])

//   const toggleFolder = useCallback((folderId: string) => {
//     setOpenFolders((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(folderId)) {
//         newSet.delete(folderId)
//       } else {
//         newSet.add(folderId)
//       }
//       return newSet
//     })
//   }, [])

//   async function handleCreateFolder(parentId: string | null, name: string) {
//     if (!name.trim() || submitting) return
//     setSubmitting(true)
//     try {
//       await api.courses.createFolder(
//         { id: courseId },
//         {
//           name: name.trim(),
//           order: parentId
//             ? tree?.folders.find((f) => f.id === parentId)?.children.length ?? 0
//             : tree?.folders.length ?? 0,
//           parentId,
//         }
//       )
//       if (parentId) {
//         setOpenFolders((prev) => new Set(prev).add(parentId))
//       }
//       await fetchTree()
//     } catch (err) {
//       console.error("Failed to create folder:", err)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   async function handleCreateContent(
//     folderId: string,
//     type: "VIDEO" | "FILE" | "QUIZ",
//     title: string
//   ) {
//     if (!title.trim() || submitting) return
//     setSubmitting(true)
//     try {
//       const folder = tree?.folders.find((f) => f.id === folderId)

//       await api.courses.createContent(
//         { id: courseId, folderId },
//         {
//           title: title.trim(),
//           type,
//           order: folder ? folder.contents.length : 0,
//         }
//       )
//       setOpenFolders((prev) => new Set(prev).add(folderId))
//       await fetchTree()
//     } catch (err) {
//       console.error("Failed to create content:", err)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <Sidebar
//       {...props}
//       collapsible="none"
//       className="hidden flex-1 md:flex bg-background border-r"
//       variant="floating"
//     >
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Course Content</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {loading ? (
//                 <SidebarMenuItem>
//                   <SidebarMenuButton disabled>Loading…</SidebarMenuButton>
//                 </SidebarMenuItem>
//               ) : !tree ? (
//                 <SidebarMenuItem>
//                   <SidebarMenuButton disabled>No content</SidebarMenuButton>
//                 </SidebarMenuItem>
//               ) : (
//                 <>
//                   {creatingFolder ? (
//                     <SidebarMenuItem>
//                       <div className="flex items-center gap-2 px-2">
//                         <Folder size={16} />
//                         <Input
//                           autoFocus
//                           value={newFolderName}
//                           onChange={(e) => setNewFolderName(e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               handleCreateFolder(null, newFolderName)
//                               setCreatingFolder(false)
//                               setNewFolderName("")
//                             }
//                             if (e.key === "Escape") {
//                               setCreatingFolder(false)
//                               setNewFolderName("")
//                             }
//                           }}
//                           onBlur={() => {
//                             setCreatingFolder(false)
//                             setNewFolderName("")
//                           }}
//                           placeholder="Folder name..."
//                           className="h-7 px-2 text-sm"
//                           disabled={submitting}
//                         />
//                       </div>
//                     </SidebarMenuItem>
//                   ) : (
//                     <SidebarMenuItem>
//                       <SidebarMenuButton
//                         onClick={() => setCreatingFolder(true)}
//                         className="text-primary"
//                       >
//                         <FolderPlus size={16} className="mr-2" />
//                         Create Folder
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   )}

//                   {tree.contents
//                     .filter((content) => !content.folderId)
//                     .map((content) => (
//                       <ContentNode
//                         key={content.id}
//                         content={content}
//                         fetchTree={fetchTree}
//                         onSelect={onSelectContent}
//                       />
//                     ))}

//                   {tree.folders.map((folder) => (
//                     <FolderNode
//                       key={folder.id}
//                       folder={folder}
//                       courseId={courseId}
//                       fetchTree={fetchTree}
//                       onCreateFolder={handleCreateFolder}
//                       onCreateContent={handleCreateContent}
//                       submitting={submitting}
//                       isOpen={openFolders.has(folder.id)}
//                       onToggle={toggleFolder}
//                       openFolders={openFolders}
//                       onSelectContent={onSelectContent}
//                     />
//                   ))}
//                 </>
//               )}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   )
// }


// function FolderNode({
//   folder,
//   courseId,
//   fetchTree,
//   onCreateFolder,
//   onCreateContent,
//   submitting,
//   isOpen,
//   onToggle,
//   openFolders,
//   onSelectContent,
// }: {
//   folder: CourseFolderNode
//   courseId: string
//   fetchTree: () => Promise<void>
//   onCreateFolder: (parentId: string | null, name: string) => Promise<void>
//   onCreateContent: (folderId: string, type: "VIDEO" | "FILE" | "QUIZ", title: string) => Promise<void>
//   submitting: boolean
//   isOpen: boolean
//   onToggle: (folderId: string) => void
//   openFolders: Set<string>
//   onSelectContent?: (c: CourseContentNode) => void
// }) {
//   const [creatingSubFolder, setCreatingSubFolder] = useState(false)
//   const [subFolderName, setSubFolderName] = useState("")
//   const [renaming, setRenaming] = useState(false)
//   const [renameValue, setRenameValue] = useState(folder.name)
//   const [actionLoading, setActionLoading] = useState(false)
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false)

//   // content creation
//   const [creatingContent, setCreatingContent] = useState<null | "VIDEO" | "FILE" | "QUIZ">(null)
//   const [contentTitle, setContentTitle] = useState("")

//   async function handleRename() {
//     if (!renameValue.trim()) return
//     setActionLoading(true)
//     try {
//       await api.courses.updateFolder(
//         { id: courseId, folderId: folder.id },
//         { name: renameValue.trim() }
//       )
//       await fetchTree()
//       setRenaming(false)
//     } catch (err) {
//       console.error("Failed to rename folder:", err)
//     } finally {
//       setActionLoading(false)
//     }
//   }

//   async function handleDelete() {
//     setActionLoading(true)
//     try {
//       await api.courses.deleteFolder({ id: courseId, folderId: folder.id })
//       await fetchTree()
//     } catch (err) {
//       console.error("Failed to delete folder:", err)
//     } finally {
//       setActionLoading(false)
//       setShowDeleteDialog(false)
//     }
//   }

//   return (
//     <SidebarMenuItem>
//       <Collapsible
//         className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
//         open={isOpen}
//         onOpenChange={() => onToggle(folder.id)}
//       >
//         <CollapsibleTrigger asChild>
//           <SidebarMenuButton className="justify-between">
//             <div className="flex items-center gap-2 truncate">
//               <ChevronRight className="transition-transform" size={16} />
//               <Folder size={16} />
//               {renaming ? (
//                 <Input
//                   autoFocus
//                   value={renameValue}
//                   onChange={(e) => setRenameValue(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleRename()
//                     if (e.key === "Escape") setRenaming(false)
//                   }}
//                   onBlur={() => setRenaming(false)}
//                   className="h-6 px-2 text-sm"
//                   disabled={actionLoading}
//                 />
//               ) : (
//                 folder.name
//               )}
//             </div>
//             <FolderMenu
//               onCreateFolder={() => {
//                 setCreatingSubFolder(true)
//                 // Open folder if it's not already open
//                 if (!isOpen) {
//                   onToggle(folder.id)
//                 }
//               }}
//               onRename={() => {
//                 setRenameValue(folder.name)
//                 setRenaming(true)
//               }}
//               onDelete={() => setShowDeleteDialog(true)}
//               onCreateContent={(type) => {
//                 setCreatingContent(type)
//                 // Open folder if it's not already open
//                 if (!isOpen) {
//                   onToggle(folder.id)
//                 }
//               }}
//             />
//           </SidebarMenuButton>
//         </CollapsibleTrigger>
//         <CollapsibleContent>
//           <SidebarMenuSub>
//             {folder.contents.map((content) => (
//               <ContentNode 
//                 key={content.id} 
//                 content={content} 
//                 fetchTree={fetchTree}
//                 onSelect={onSelectContent} 
//                 />
//             ))}

//             {folder.children.map((child) => (
//               <FolderNode
//                 key={child.id}
//                 folder={child}
//                 courseId={courseId}
//                 fetchTree={fetchTree}
//                 onCreateFolder={onCreateFolder}
//                 onCreateContent={onCreateContent}
//                 submitting={submitting}
//                 isOpen={openFolders.has(child.id)}
//                 onToggle={onToggle}
//                 openFolders={openFolders}
//               />
//             ))}

//             {creatingSubFolder && (
//               <SidebarMenuItem>
//                 <div className="flex items-center gap-2 px-2">
//                   <Folder size={16} />
//                   <Input
//                     autoFocus
//                     value={subFolderName}
//                     onChange={(e) => setSubFolderName(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         onCreateFolder(folder.id, subFolderName)
//                         setCreatingSubFolder(false)
//                         setSubFolderName("")
//                       }
//                       if (e.key === "Escape") {
//                         setCreatingSubFolder(false)
//                         setSubFolderName("")
//                       }
//                     }}
//                     onBlur={() => {
//                       setCreatingSubFolder(false)
//                       setSubFolderName("")
//                     }}
//                     placeholder="Folder name..."
//                     className="h-7 px-2 text-sm"
//                     disabled={submitting}
//                   />
//                 </div>
//               </SidebarMenuItem>
//             )}

//             {creatingContent && (
//               <SidebarMenuItem>
//                 <div className="flex items-center gap-2 px-2">
//                   {getIcon(creatingContent)}
//                   <Input
//                     autoFocus
//                     value={contentTitle}
//                     onChange={(e) => setContentTitle(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         onCreateContent(folder.id, creatingContent, contentTitle)
//                         setCreatingContent(null)
//                         setContentTitle("")
//                       }
//                       if (e.key === "Escape") {
//                         setCreatingContent(null)
//                         setContentTitle("")
//                       }
//                     }}
//                     onBlur={() => {
//                       setCreatingContent(null)
//                       setContentTitle("")
//                     }}
//                     placeholder="Title..."
//                     className="h-7 px-2 text-sm"
//                     disabled={submitting}
//                   />
//                 </div>
//               </SidebarMenuItem>
//             )}
//           </SidebarMenuSub>
//         </CollapsibleContent>
//       </Collapsible>

//       {/* AlertDialog for deletion */}
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Folder</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete {folder.name}? This action cannot
//               be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </SidebarMenuItem>
//   )
// }

// function ContentMenu({
//   onRename,
//   onDelete,
// }: {
//   onRename: () => void
//   onDelete: () => void
// }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <div 
//           className="p-1 rounded hover:bg-muted"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <MoreVertical size={16} />
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent side="right" align="start">
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onRename()
//           }}
//         >
//           <Edit size={16} className="mr-2" />
//           Rename
//         </DropdownMenuItem>
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onDelete()
//           }} 
//           className="text-destructive"
//         >
//           <Trash size={16} className="mr-2 text-destructive" />
//           Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// function ContentNode({ 
//   content, 
//   fetchTree, 
//   onSelect 
//   }: { 
//     content: CourseContentNode, 
//     fetchTree: () => Promise<void>,
//     onSelect?: (c: CourseContentNode) => void 
//    }) {
//   const [renaming, setRenaming] = useState(false)
//   const [renameValue, setRenameValue] = useState(content.title)
//   const [actionLoading, setActionLoading] = useState(false)
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false)

//   async function handleRename() {
//     if (!renameValue.trim()) return
//     setActionLoading(true)
//     try {
//       await api.courses.updateContent(
//         { 
//           id: content.courseId,
//           contentId: content.id,
//           folderId: content.folderId
//         },
//         { title: renameValue.trim() }
//       )
//       await fetchTree()
//     } catch (err) {
//       console.error("Failed to rename content:", err)
//     } finally {
//       setActionLoading(false)
//       setRenaming(false)
//     }
//   }

//   async function handleDelete() {
//     setActionLoading(true)
//     try {
//       await api.courses.deleteContent({
//         id: content.courseId, 
//         contentId: content.id,
//         folderId: content.folderId 
//       })
//       await fetchTree()
//     } catch (err) {
//       console.error("Failed to delete content:", err)
//     } finally {
//       setActionLoading(false)
//       setShowDeleteDialog(false)
//     }
//   }

//   return (
//     <SidebarMenuItem>
//       <SidebarMenuButton 
//         className="justify-between data-[active=true]:bg-transparent"
//         onClick={() => onSelect?.(content)}
//         >
//         <div className="flex items-center gap-2 truncate">
//           {getIcon(content.type)}
//           {renaming ? (
//             <Input
//               autoFocus
//               value={renameValue}
//               onChange={(e) => setRenameValue(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleRename()
//                 if (e.key === "Escape") setRenaming(false)
//               }}
//               onBlur={() => setRenaming(false)}
//               className="h-6 px-2 text-sm"
//               disabled={actionLoading}
//             />
//           ) : (
//             content.title
//           )}
//         </div>
//         <ContentMenu
//           onRename={() => {
//             setRenameValue(content.title)
//             setRenaming(true)
//           }}
//           onDelete={() => setShowDeleteDialog(true)}
//         />
//       </SidebarMenuButton>

//       {/* Delete confirmation dialog */}
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Content</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete {content.title}? This action cannot
//               be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </SidebarMenuItem>
//   )
// }


// function getIcon(type: CourseContentNode["type"]) {
//   switch (type) {
//     case "VIDEO":
//       return <Video size={16} />
//     case "QUIZ":
//       return <ListChecks size={16} />
//     case "FILE":
//       return <FileText size={16} />
//     default:
//       return <File size={16} />
//   }
// }

// function FolderMenu({
//   onCreateFolder,
//   onRename,
//   onDelete,
//   onCreateContent,
// }: {
//   onCreateFolder: () => void
//   onRename: () => void
//   onDelete: () => void
//   onCreateContent: (type: "VIDEO" | "FILE" | "QUIZ") => void
// }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <div 
//           className="p-1 rounded hover:bg-muted"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <MoreVertical size={16} />
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent side="right" align="start">
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onCreateContent("VIDEO")
//           }}
//         >
//           <Video size={16} className="mr-2" />
//           Upload Video
//         </DropdownMenuItem>
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onCreateContent("FILE")
//           }}
//         >
//           <Upload size={16} className="mr-2" />
//           Upload File
//         </DropdownMenuItem>
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onCreateContent("QUIZ")
//           }}
//         >
//           <ListChecks size={16} className="mr-2" />
//           Create Quiz
//         </DropdownMenuItem>
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onCreateFolder()
//           }}
//         >
//           <FolderPlus size={16} className="mr-2" />
//           Create Folder
//         </DropdownMenuItem>
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onRename()
//           }}
//         >
//           <Edit size={16} className="mr-2" />
//           Rename Folder
//         </DropdownMenuItem>
//         <DropdownMenuItem 
//           onClick={(e) => {
//             e.stopPropagation()
//             onDelete()
//           }} 
//           className="text-destructive"
//         >
//           <Trash size={16} className="mr-2 text-destructive" />
//           Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }