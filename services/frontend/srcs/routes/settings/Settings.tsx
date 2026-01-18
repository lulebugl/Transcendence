import { useState } from 'react'
import { User, Shield, Key } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { ProfileSettings } from './ProfileSettings'
import { SecuritySettings } from './SecuritySettings'
import { ApiKeySettings } from './ApiKeySettings'
import { useSearchParams } from 'react-router'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API', icon: Key }
]

export const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || TABS[0].id

  const isValidTab = TABS.some(tab => tab.id === activeTab)
  const currentTab = isValidTab ? activeTab : TABS[0].id

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId })
  }
  return (
    <Layout>
      <div className='flex flex-col md:flex-row gap-8 max-w-5xl mx-auto pb-12'>
        {/* Sidebar Navigation */}
        <aside className='w-full md:w-64 shrink-0 mt-12'>
          <div className='bg-card border border-border rounded-xl p-4 sticky top-24'>
            <h2 className='text-xl font-bold px-4 mb-4'>Account Settings</h2>
            <nav className='space-y-1'>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <tab.icon className='w-4 h-4' />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className='flex-1 min-w-0 mt-12'>
          <div className='bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-in-up space-y-8'>
            {currentTab === 'profile' && <ProfileSettings />}
            {currentTab === 'security' && <SecuritySettings />}
            {currentTab === 'api' && <ApiKeySettings />}
          </div>
        </div>
      </div>
    </Layout>
  )
}
