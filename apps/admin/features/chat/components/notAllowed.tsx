export function NotAllowed({ message }: { message?: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-6 shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          {message || "You do not have permission to view this page."}
        </p>
      </div>
    </div>
  )
}