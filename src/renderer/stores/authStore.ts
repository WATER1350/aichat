import { create } from 'zustand'

export interface AuthUser {
  id: number
  email: string
  nickname: string
  createdAt: string
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    return data.user
  } catch {
    return null
  }
}

export async function loginUser(email: string, password: string): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || '登录失败' }
    return { user: data.user }
  } catch {
    return { error: '网络错误，请稍后重试' }
  }
}

export async function registerUser(
  email: string,
  password: string,
  nickname?: string
): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, nickname }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || '注册失败' }
    return { user: data.user }
  } catch {
    return { error: '网络错误，请稍后重试' }
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  } catch {
  }
  useAuthStore.getState().setUser(null)
}
