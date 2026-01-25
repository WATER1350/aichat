import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { IconMessageChatbot, IconSettings, IconUser } from '@tabler/icons-react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsSmallScreen } from '../hooks/useScreenChange'
import platform from '../platform'

export default function MobileTabBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { location } = useRouterState()
  const isSmallScreen = useIsSmallScreen()
  const isMobile = platform.type === 'mobile' || isSmallScreen

  const [value, setValue] = useState(0)

  useEffect(() => {
    // 简单的路由匹配
    const path = location.pathname
    if (path.startsWith('/settings') || path.startsWith('/companions')) {
      setValue(1)
    } else {
      setValue(0)
    }
  }, [location.pathname])

  if (!isMobile) {
    return null
  }

  // 如果是在具体会话页面，可能需要隐藏 TabBar？
  // 目前先不隐藏，看看效果。如果键盘弹出，TabBar 可能会被顶上来，需要处理。

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
          if (newValue === 0) {
            navigate({ to: '/' })
          } else if (newValue === 1) {
            navigate({ to: '/companions' }) // 跳转到推荐页
          }
        }}
      >
        <BottomNavigationAction value={0} icon={<IconMessageChatbot />} />
        <BottomNavigationAction value={1} icon={<IconUser />} />
      </BottomNavigation>
      {/* 适配 iPhone 底部安全区域 */}
      <div className="safe-area-bottom h-[env(safe-area-inset-bottom)] bg-white dark:bg-[#1A1B1E]" />
    </Paper>
  )
}
