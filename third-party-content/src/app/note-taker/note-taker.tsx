import React, { FC } from 'react'
import { useRouteMatch } from 'react-router'
import { Alert } from 'antd'

import { StorageType, supportsStorageAccessAPI } from './hooks'
import { AccessStorageInfo } from '../access-storage-info'
import { Notes } from './notes'

export const NoteTaker: FC<{ storage: StorageType }> = ({ storage }) => {
    const { params: { useStorageAccessAPI } } = useRouteMatch<{ useStorageAccessAPI: string }>()

    if (useStorageAccessAPI && !supportsStorageAccessAPI()) {
        return <div>
            <Alert
                message="Error"
                description="Storage access API is not supported by this browser."
                type="error"
                showIcon
            />
        </div>
    }

    return (
        <div>
            {useStorageAccessAPI && <AccessStorageInfo />}
            <Notes storage={storage} useStorageAccessAPI={!!useStorageAccessAPI}/>
        </div>
    )
}
