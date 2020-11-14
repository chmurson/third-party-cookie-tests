import { useCallback, useEffect, useMemo, useState } from 'react'
import cookies from 'js-cookie'

export type Entry = {
    date: string,
    text: string
}

export type StorageType = 'cookies' | 'localStorage';

export function usePersistentEntryState(storageType: StorageType, storageAccessApi?: boolean): [Entry[], (entry: Entry) => void] {
    const [entries, setEntries] = useState<Entry[]>([])
    const { getStorageState, setStorageState } = useStorageState(storageType, storageAccessApi)
    useEffect(() => {
        getStorageState().then(state => setEntries(state))
    }, [getStorageState])
    const addEntry = useCallback((entry: Entry) => {
        setEntries((entries) => {
            const newEntries = [...entries, entry]
            setStorageState(newEntries)
            return newEntries
        })
    }, [setStorageState, setEntries])
    return [entries, addEntry]
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
            try {
                if (storageAccessApi) {
                    // @ts-ignore
                    await document.requestStorageAccess()
                }
                return cookies.get(key)
            } catch (e) {
                console.error(e)
                console.error('getStorageValue failed')
            }
        },
        async setStorageValue(key: string, value: string) {
            try {
                if (storageAccessApi) {
                    // @ts-ignore
                    await document.requestStorageAccess()
                }
                cookies.set(key, value)
            } catch (e) {
                console.error(e)
                console.error('setStorageValue failed')
            }
        },
    }), [storageAccessApi])
    const localStorage = useMemo(() => ({
        async getStorageValue(key: string) {
            try {
                if (storageAccessApi) {
                    // @ts-ignore
                    await document.requestStorageAccess()
                }
                return window.localStorage.get(key)
            } catch (e) {
                console.error(e)
                console.error('getStorageValue failed')
            }
        },
        async setStorageValue(key: string, value: string) {
            try {
                if (storageAccessApi) {
                    // @ts-ignore
                    await document.requestStorageAccess()
                }
                window.localStorage.set(key, value)
            } catch (e) {
                console.error(e)
                console.error('setStorageValue failed')
            }
        },
    }), [storageAccessApi])

    if (storageAccessApi) {
        return localStorage
    }
    return cookiesMethods
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
