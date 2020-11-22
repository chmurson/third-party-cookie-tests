import React, { FC, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Alert } from 'antd'

import { supportsStorageAccessAPI } from './hooks'
import { AccessStorageInfo } from '../access-storage-info'
import { Notes } from './notes'
import { StorageProvider, useStorage } from './storage-provider'
import { StorageType } from './storage-provider/types'
import { usePersistentUsernameState, UserName } from './username'

export const NoteTaker: FC<{ storage: StorageType }> = ({ storage }) => {
    const { params: { useStorageAccessAPI } } = useRouteMatch<{ useStorageAccessAPI: string }>()

    const storageContextValue = useMemo(() => ({
        storageType: storage,
        useStorageAccessAPI: !!useStorageAccessAPI,
    }), [useStorageAccessAPI, storage])

    return (
        <StorageProvider value={storageContextValue}>
            <NoteTakeContent />
        </StorageProvider>
    )
}

const NoteTakeContent: FC = (() => {
    const { useStorageAccessAPI } = useStorage()
    const [persistentUserName] = usePersistentUsernameState()
    const [isUserNameSet, setIsUserNameSet] = useState<boolean|undefined>(undefined)

    useEffect(()=>{
        setIsUserNameSet(!!persistentUserName);
    },[persistentUserName, setIsUserNameSet])


    if (useStorageAccessAPI && !supportsStorageAccessAPI()) {
        return <div>
            <Alert
                message="Error"
                description="Storage access API is not supported by this browser."
                type="error"
                showIcon
                banner
                closable
                closeText="close"
            />
        </div>
    }

    return (
        <div>
            {useStorageAccessAPI && <AccessStorageInfo />}
            {isUserNameSet === true && <Notes />}
            {isUserNameSet === false && <UserName onChange={() => setIsUserNameSet(true)} />}
        </div>
    )
})
