import { useCallback, useEffect, useMemo, useState } from 'react'
import cookies from 'js-cookie'

export type Entry = {
    date: string,
    text: string
}

export type StorageType = 'cookies' | 'localStorage';

export function usePersistentEntryState(storageType: StorageType, storageAccessApi?: boolean): [Entry[], (entry: Entry) => void, () => void] {
    const [entries, setEntries] = useState<Entry[]>([])
    const { getStorageState, setStorageState } = useStorageState(storageType, storageAccessApi)

    const refreshFromStorage = useCallback(() => {
        getStorageState().then(state => setEntries(state))
    }, [getStorageState, setEntries])

    useEffect(() => {
        refreshFromStorage()
    }, [refreshFromStorage])

    const addEntry = useCallback((entry: Entry) => {
        setEntries((entries) => {
            const newEntries = [...entries, entry]
            setStorageState(newEntries)
            return newEntries
        })
    }, [setStorageState, setEntries])

    return [entries, addEntry, refreshFromStorage]
}

function useStorageState(storageType: StorageType, storageAccessApi?: boolean) {
    const { getStorageValue, setStorageValue } = useStorageAccessMethods(storageType, storageAccessApi)

    return useMemo(() => ({
        async setStorageState(state: Entry[]) {
            await setStorageValue(STATE_COOKIE_NAME, cookieStateConverters.encode(state))
        },
        async getStorageState(): Promise<Entry[]> {
            const cookieValue = await getStorageValue(STATE_COOKIE_NAME)
            return cookieStateConverters.decode(cookieValue)
        },
    }), [getStorageValue, setStorageValue])
}

function useStorageAccessMethods(storageType: StorageType, storageAccessApi?: boolean) {
    const cookiesMethods = useMemo(() => ({
        async getStorageValue(key: string) {
            if (storageAccessApi) {
                await assureRequestStorageAccess()
            }
            return cookies.get(key)
        },
        async setStorageValue(key: string, value: string) {
            if (storageAccessApi) {
                await assureRequestStorageAccess()
            }
            cookies.set(key, value)
        },
    }), [storageAccessApi])
    const localStorage = useMemo(() => ({
        async getStorageValue(key: string) {
            if (storageAccessApi) {
                await assureRequestStorageAccess()
            }
            return window.localStorage.getItem(key)
        },
        async setStorageValue(key: string, value: string) {
            if (storageAccessApi) {
                await assureRequestStorageAccess()
            }
            window.localStorage.setItem(key, value)
        },
    }), [storageAccessApi])

    if (storageType === 'localStorage') {
        return localStorage
    }
    if (storageType === 'cookies') {
        return cookiesMethods
    }
    throw new Error(`${storageType} is not supported`)
}

const STATE_COOKIE_NAME = 'showcookie2mestate'

const cookieStateConverters = {
    decode: (cookieValue: any): Entry[] => {
        if (!cookieValue) {
            return []
        }
        try {
            const decoded = window.atob('' + cookieValue)
            return JSON.parse(decodeURIComponent(decoded))
        } catch (e) {
            console.error('Could not parse the cookie value')
            console.error(e)
            return []
        }
    },
    encode: (state: Entry[]) => window.btoa(encodeURIComponent(JSON.stringify(state))),
}

export function supportsStorageAccessAPI() {
    //@ts-ignore
    return document.requestStorageAccess != null
}

async function assureRequestStorageAccess() {
    try {
        //@ts-ignore
        await document.hasStorageAccess()
        return
    } catch (e) {
        if (e == null) {
            console.error('hasStorageAccess failed')
        } else {
            console.error(e)
        }
    }
    try {
        //@ts-ignore
        await document.requestStorageAccess()
        return
    } catch (e) {
        if (e == null) {
            console.error('requestStorageAccess failed')
        } else {
            console.error(e)
        }
    }
}
