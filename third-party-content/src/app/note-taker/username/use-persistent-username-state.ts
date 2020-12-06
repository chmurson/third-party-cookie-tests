import { useCallback, useEffect, useState } from 'react'
import { CookieStateConverter, useStorageState } from '../hooks'

const usernameStateConverted = new CookieStateConverter<string>('')

export function usePersistentUsernameState(): [string, (userName: string) => void, () => void, boolean] {
    const [userName, setUsername] = useState<string>('')
    const { getStorageState, setStorageState, hasError } = useStorageState(usernameStateConverted, 'username')

    const refreshFromStorage = useCallback(() => {
        getStorageState().then(state => setUsername(state))
    }, [getStorageState, setUsername])

    useEffect(() => {
        refreshFromStorage()
    }, [refreshFromStorage])

    const setPersistentUserName = useCallback((newUsername: string) => {
        setUsername(newUsername)
        setStorageState(newUsername)
    }, [setStorageState, setUsername])

    return [userName, setPersistentUserName, refreshFromStorage, hasError]
}
