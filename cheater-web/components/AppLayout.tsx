'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Camera, Library, User, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Profile', href: '/profile', icon: User },
]

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Cheater</h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-colors',
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* New Quiz Button (Desktop) */}
          <div className="mt-auto">
            <Link href="/capture">
              <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-6 text-base font-semibold shadow-md">
                <Plus className="h-5 w-5 mr-2" />
                New Quiz
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="pb-20 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around px-4 py-2 safe-area-inset-bottom">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors min-w-[72px]',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
          {/* New Quiz FAB */}
          <Link
            href="/capture"
            className="flex flex-col items-center gap-1"
          >
            <div className="bg-primary hover:bg-primary-hover text-white rounded-full p-3 shadow-lg transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-gray-500">New</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
