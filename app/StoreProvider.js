'use client'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { apiRequest } from '@/lib/api'
import { setProduct } from '@/lib/features/product/productSlice'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiRequest('/products')
        storeRef.current.dispatch(setProduct(data.data || []))
      } catch {
        // Keep existing data if API fails.
      }
    }
    loadProducts()
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
