"use client"

import { useLoadingScreen } from "@/hooks/use-loading-screen"
import { LoadingScreen } from "@/components/loading-screen"
import { DebugLoading } from "@/components/debug-loading"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { showLoading, completeLoading, forceShowLoading } = useLoadingScreen()

  console.log("🎯 AppWrapper renderizado, showLoading:", showLoading)

  if (showLoading) {
    return <LoadingScreen onComplete={completeLoading} />
  }

  return (
    <>
      {children}
      <DebugLoading forceShowLoading={forceShowLoading} />
    </>
  )
}
