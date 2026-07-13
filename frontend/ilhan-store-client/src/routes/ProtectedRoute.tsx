import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  requireAdmin?: boolean
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation()
  const { token, user } = useAppSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== UserRole.Admin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
