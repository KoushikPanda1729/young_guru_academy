import React from "react"

interface LoaderProps {
  label?: string
  size?: number
}

export const Loader: React.FC<LoaderProps> = ({ label = "Loading...", size = 6 }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`w-${size} h-${size} border-4 border-primary border-t-transparent rounded-full animate-spin`}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}
