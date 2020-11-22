import React, { FC, KeyboardEventHandler, useCallback, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router'
import styles from './note-taker-styles.module.scss'
import { Alert, Button, Input, Space, Typography } from 'antd'
import { DateFormatter } from '../../DateFormatter'
import { StorageType, supportsStorageAccessAPI, usePersistentEntryState } from './hooks'
import { AccessStorageInfo } from '../access-storage-info'

const { TextArea } = Input
const { Text } = Typography

export const NoteTaker: FC<{ storage: StorageType }> = ({ storage }) => {
    const { params: { useStorageAccessAPI } } = useRouteMatch<{ useStorageAccessAPI: string }>()
    const [text, setText] = useState<string>('')
    const [entries, addEntry, refreshFromStorage] = usePersistentEntryState(storage, !!useStorageAccessAPI)
    const sortedEntries = useMemo(() => entries.sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()), [entries])
    const handleSubmission = useCallback(() => {
        if (!text.trim()) {
            return
        }
        addEntry({
            date: new Date().toISOString(),
            text: text.trim(),
        })
        setText('')
    }, [text, setText, addEntry])
    const handleRefresh = useCallback(() => {
        refreshFromStorage();
    }, [refreshFromStorage])

    const onKeyPress = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>((e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmission()
        }
    }, [handleSubmission])

    if (useStorageAccessAPI && !supportsStorageAccessAPI()) {
        return <div className={styles.App}>
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
            <div className={styles.noteFormContainer}>

                <TextArea rows={5} cols={30} value={text} onChange={e => setText(e.currentTarget.value)}
                          onKeyDown={onKeyPress} placeholder="Write a short note here" />
                <Space>
                    <Button onClick={handleSubmission} type="primary">Submit</Button>
                    <Button onClick={handleRefresh} type="default">Refresh</Button>

                </Space>
            </div>
            <div>
                {sortedEntries.map(entry => (
                    <p className="p-field" key={entry.date}>
                        <span
                            dangerouslySetInnerHTML={{ __html: decodeURIComponent(entry.text).replaceAll('\n', '</br>') }} />
                        <br />
                        <Text type="secondary"><DateFormatter date={new Date(entry.date)} /></Text>
                    </p>
                ))}
            </div>
        </div>
    )
}
