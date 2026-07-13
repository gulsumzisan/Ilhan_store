import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store/store'

// Uygulama genelinde tip güvenli dispatch ve selector hook'ları.
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
