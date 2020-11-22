import { useCallback, useEffect, useState } from 'react'
import { CookieStateConverter, useStorageState } from '../hooks'

const notesEntriesStateConverted = new CookieStateConverter<Entry[]>([])

export function usePersistentEntryState(): [Entry[], (entry: Entry) => void, () => void] {
    const [entries, setEntries] = useState<Entry[]>([])
    const { getStorageState, setStorageState } = useStorageState(notesEntriesStateConverted, 'note-entries')

    const refreshFromStorage = useCallback(() => {
        getStorageState().then(state => {
            setEntries(state)
        })
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

export type Entry = {
    date: string,
    text: string
}
