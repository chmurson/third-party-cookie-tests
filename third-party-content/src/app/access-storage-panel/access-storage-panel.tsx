import React, { FC } from 'react'
import { Space } from 'antd'

import { AccessStorageInfo } from './access-storage-info'
import { AccessStorageRequester } from './access-storage-requester'
import styles from './access-storage-panel.module.scss'

type Props = {
    onRequestSuccess?: () => void
    onRequestFailed?: () => void
}

export const AccessStoragePanel: FC<Props> = (({ onRequestFailed, onRequestSuccess }) => {
    return <div className={styles.container}>
        <Space>
            <AccessStorageInfo />
            <AccessStorageRequester onFail={onRequestFailed} onSuccess={onRequestSuccess} />
        </Space>
    </div>
})
