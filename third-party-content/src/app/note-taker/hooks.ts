import { useMemo } from 'react'
import cookies from 'js-cookie'

export type StorageType = 'cookies' | 'localStorage';

export function useStorageState<T>(storageType: StorageType, storageAccessApi: boolean, cookiesConverters: CookieStateConverter<T>) {
    const { getStorageValue, setStorageValue } = useStorageAccessMethods(storageType, storageAccessApi)

    return useMemo(() => ({
        async setStorageState(state: T) {
            await setStorageValue(STATE_COOKIE_NAME, cookiesConverters.encode(state))
        },
        async getStorageState(): Promise<T> {
            const cookieValue = await getStorageValue(STATE_COOKIE_NAME)
            return cookiesConverters.decode(cookieValue)
        },
    }), [getStorageValue, setStorageValue, cookiesConverters])
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
