import React, { FC } from 'react'
import { Space } from 'antd'

import { AccessStorageInfo } from './access-storage-info'
import { AccessStorageRequester } from './access-storage-requester'
import styles from './access-storage-panel.module.scss'

type Props = {}

export const AccessStoragePanel: FC<Props> = (() => {
    return <div className={styles.container}>
        <Space>
            <AccessStorageInfo />
            <AccessStorageRequester />
        </Space>
    </div>
})
