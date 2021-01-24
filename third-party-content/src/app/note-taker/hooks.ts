import { useEffect, useMemo, useRef, useState } from 'react'
import cookies from 'js-cookie'
import { useStorage } from './storage-provider'
import { StorageType } from './storage-provider/types'

export function useStorageState<T>(cookiesConverters: CookieStateConverter<T>, cookieName: string) {
    const checkHandler = useRef<NodeJS.Timeout>()
    const [hasError, setHasError] = useState<boolean | undefined>(undefined)
    const { storageType, useStorageAccessAPI } = useStorage()
    const { getStorageValue, setStorageValue } = useStorageAccessMethods(storageType, useStorageAccessAPI)

    const finalCookieName = BASE_COOKIE_NAME + cookieName

    useEffect(() => {
        return () => {
            if (checkHandler.current) {
                clearTimeout(checkHandler.current)
            }
        }
    }, [checkHandler])

    const { getStorageState, setStorageState } = useMemo(() => ({
        async setStorageState(state: T) {
            await setStorageValue(finalCookieName, cookiesConverters.encode(state))

            if (checkHandler.current) {
                clearTimeout(checkHandler.current)
            }

            checkHandler.current = setTimeout(() => {
                const cookieValue = getStorageValue(finalCookieName)
                setHasError(() => cookieValue == null)
            }, 500)
        },
        async getStorageState(): Promise<T> {
            const cookieValue = await getStorageValue(finalCookieName)
            return cookiesConverters.decode(cookieValue)
        },
    }), [getStorageValue, setStorageValue, cookiesConverters, finalCookieName])

    return { setStorageState, getStorageState, hasError }
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

const BASE_COOKIE_NAME = 'showcookie2me-'


export class CookieStateConverter<T> {
    defaultValue: T

    constructor(defaultValue: T) {
        this.defaultValue = defaultValue
    }

    decode(cookieValue: any): T {
        if (!cookieValue) {
            return this.defaultValue
        }
        try {
            const decoded = window.atob('' + cookieValue)
            return JSON.parse(decodeURIComponent(decoded))
        } catch (e) {
            console.error('Could not parse the cookie value')
            console.error(e)
            return this.defaultValue
        }
    }

    encode(state: T): string {
        return window.btoa(encodeURIComponent(JSON.stringify(state)))
    }
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
