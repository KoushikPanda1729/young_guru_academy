import Logo from '@/components/logo'
import type React from 'react'

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10 w-screen items-center justify-center'>
        <div className='flex flex-col gap-y-10 flex-1 items-center justify-center'>
          <Logo />
          <div className='w-full'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}