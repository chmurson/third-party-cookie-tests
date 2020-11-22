import { createContext, useContext } from 'react'
import { StorageType } from './types'

type StorageContext = {
    storageType: StorageType,
    useStorageAccessAPI: boolean
}
const storageContext = createContext<StorageContext>({
    storageType: 'cookies',
    useStorageAccessAPI: false,
})

export const StorageProvider = storageContext.Provider

export function useStorage() {
    return useContext(storageContext)
}
