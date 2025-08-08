import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import { User, LoginCredentials } from '../types'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  register: (data: any) => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const isAuthenticated = !!user

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.access_token) {
          // Set token in API client
          api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`
          
          // Get user profile from backend
          const response = await api.get('/auth/me')
          setUser(response.data)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        await supabase.auth.signOut()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`
          try {
            const response = await api.get('/auth/me')
            setUser(response.data)
          } catch (error) {
            console.error('Error getting user profile:', error)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          delete api.defaults.headers.common['Authorization']
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      
      const response = await api.post('/auth/login', credentials)
      const { access_token, user: userData } = response.data
      
      // Set token in API client
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(userData)
      
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: any) => {
    try {
      setIsLoading(true)
      
      const response = await api.post('/auth/register', data)
      const { access_token, user: userData } = response.data
      
      // Set token in API client
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(userData)
      
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setUser(null)
      delete api.defaults.headers.common['Authorization']
      navigate('/login')
      toast.success('Logged out successfully')
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}