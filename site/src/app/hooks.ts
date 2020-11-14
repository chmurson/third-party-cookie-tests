import { useCallback, useEffect, useMemo, useState } from 'react'
import { BooleansToStringRecord } from './type-utils'

export type StorageType = 'cookie' | 'localStorage';
type LocalState = { useStorageAccessAPI: boolean, storageType: StorageType }

type LocalStageForSearch = BooleansToStringRecord<LocalState>;

export function useLocalState() {
    const initValues = useMemo<LocalState>(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const maybeStorageType = searchParams.get('storageType')
        const storageType = (maybeStorageType === 'cookie' || maybeStorageType === 'localStorage') ? maybeStorageType : undefined

        return {
            storageType: storageType || 'cookie',
            useStorageAccessAPI: !!searchParams.get('useStorageAccessAPI'),
        }
    }, [])

    const [localState, setLocalState] = useState<LocalState>(initValues)

    useEffect(() => {
        const localStateForSearch: LocalStageForSearch = {
            storageType: localState.storageType,
            useStorageAccessAPI: localState.useStorageAccessAPI ? '1' : '',
        }
        const searchURLPart = '?' + new URLSearchParams(localStateForSearch).toString()
        console.log(searchURLPart);
        window.history.pushState(null, 'local stage change', searchURLPart)
    }, [localState])

    const setStorageType = useCallback((newStorageType: StorageType) => {
        setLocalState(prevState => ({ ...prevState, storageType: newStorageType }))
    }, [])

    const setUseRequestStorageAPI = useCallback((newUseRequestStorageAPI: boolean) => {
        setLocalState(prevState => ({ ...prevState, useStorageAccessAPI: newUseRequestStorageAPI }))
    }, [])

    return { localState, setStorageType, setUseRequestStorageAPI }
}
