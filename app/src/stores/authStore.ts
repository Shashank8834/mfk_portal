import { create } from 'zustand'

export type UserRole = 'admin' | 'mentor' | 'public'

export type AuthUser = {
  id: string
  name: string
  phone: string
  role: UserRole
  schoolIds?: string[]
}

type AuthStore = {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))

// Design-pass mock users — swap these to preview different roles
export const MOCK_USERS: Record<UserRole, AuthUser> = {
  admin: {
    id: 'ADMIN001',
    name: 'Shiva Krishnamurthy',
    phone: '9000000001',
    role: 'admin',
  },
  mentor: {
    id: 'M001',
    name: 'Priya Sharma',
    phone: '9876543210',
    role: 'mentor',
    schoolIds: ['SCH001', 'SCH002'],
  },
  public: {
    id: 'PUB001',
    name: 'Guest User',
    phone: '9000000099',
    role: 'public',
  },
}
