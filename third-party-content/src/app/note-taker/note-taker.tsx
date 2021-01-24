import React, { FC, useCallback, useMemo } from 'react'
import { useRouteMatch } from 'react-router'
import { Alert, Space } from 'antd'

import { supportsStorageAccessAPI } from './hooks'
import { Notes } from './notes'
import { StorageProvider, useStorage } from './storage-provider'
import { StorageType } from './storage-provider/types'
import { usePersistentUsernameState, UserName } from './username'
import { SiteTracker } from './site-tracker'
import { AccessStoragePanel } from '../access-storage-panel'

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
    const [persistentUserName, , refreshFromStorage, hasError] = usePersistentUsernameState()

    const handleUsernameSet = useCallback(() => {
        refreshFromStorage()
    }, [refreshFromStorage])

    const handleStorageAccessGranted = useCallback(() => {
        localStorage.getItem("showcookie2me-username")
        refreshFromStorage()
    }, [refreshFromStorage])

    if (useStorageAccessAPI && !supportsStorageAccessAPI()) {
        return <div>
            <Alert
                message="Error"
                description="Storage access API is not supported by this browser."
                type="error"
            />
        </div>
    }

    const showNotes = !!persistentUserName && !hasError
    const showUserName = !persistentUserName && !hasError

    return (
        <div>
            <Space direction="vertical">
                {useStorageAccessAPI && <AccessStoragePanel onRequestSuccess={handleStorageAccessGranted} />}
                <SiteTracker />
                {showNotes && <Notes />}
                {showUserName && <UserName onChange={handleUsernameSet} />}
                {hasError &&
                <Alert message={Error} description={`Saving user name in ${storageType} has failed.`} type="error" />}
            </Space>
        </div>
    )
})
