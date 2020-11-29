import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Alert } from 'antd'

import { supportsStorageAccessAPI } from './hooks'
import { AccessStorageInfo } from '../access-storage-info'
import { Notes } from './notes'
import { StorageProvider, useStorage } from './storage-provider'
import { StorageType } from './storage-provider/types'
import { usePersistentUsernameState, UserName } from './username'
import { SiteTracker } from './site-tracker'

type Timeout = ReturnType<typeof setTimeout>;

export const NoteTaker: FC<{ storage: StorageType }> = ({ storage }) => {
    const { params: { useStorageAccessAPI } } = useRouteMatch<{ useStorageAccessAPI: string }>()

    const storageContextValue = useMemo(() => ({
        storageType: storage,
        useStorageAccessAPI: !!useStorageAccessAPI,
    }), [useStorageAccessAPI, storage])

    return (
        <StorageProvider value={storageContextValue}>
            <NoteTakerContent />
        </StorageProvider>
    )
}

const NoteTakerContent: FC = (() => {
    const { useStorageAccessAPI, storageType } = useStorage()
    const [persistentUserName, , refreshFromStorage] = usePersistentUsernameState()
    const [storageError, setStorageError] = useState<boolean>(false)
    const [timeoutHandle, setTimeoutHandle] = useState<Timeout>()

    const handleUsernameSet = useCallback(() => {
        if (timeoutHandle != null) {
            clearTimeout(timeoutHandle)
        }

        const localTimeoutHandle = setTimeout(() => {
            setStorageError(true)
        }, 500)

        setTimeoutHandle(localTimeoutHandle)
        refreshFromStorage()
    }, [refreshFromStorage, timeoutHandle])

    useEffect(() => {
        setTimeoutHandle(timeoutHandle => {
            if (timeoutHandle != null) {
                clearTimeout(timeoutHandle)
            }
            return timeoutHandle
        })
    }, [persistentUserName, setTimeoutHandle])


    if (useStorageAccessAPI && !supportsStorageAccessAPI()) {
        return <div>
            <Alert
                message="Error"
                description="Storage access API is not supported by this browser."
                type="error"
            />
        </div>
    }

    const showNotes = !!persistentUserName && !storageError
    const showUserName = !persistentUserName && !storageError
    const showError = storageError

    return (
        <div>
            {useStorageAccessAPI && <AccessStorageInfo />}
            <SiteTracker />
            {showNotes && <Notes />}
            {showUserName && <UserName onChange={handleUsernameSet} />}
            {showError &&
            <Alert message={Error} description={`Saving user name in ${storageType} has failed.`} type="error" />}
        </div>
    )
})
