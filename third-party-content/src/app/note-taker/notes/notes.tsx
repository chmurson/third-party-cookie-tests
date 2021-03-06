import React, { FC, KeyboardEventHandler, useCallback, useMemo, useState } from 'react'
import { DateFormatter } from '../../../DateFormatter'
import { Input, Typography, Button, Space } from 'antd'
import { usePersistentEntryState } from './use-persistent-entry-state'
import styles from './notes-styles.module.scss'
import { usePersistentUsernameState } from '../username'

const { TextArea } = Input
const { Text } = Typography


export const Notes: FC = (() => {
    const [text, setText] = useState<string>('')
    const [entries, addEntry, refreshFromStorage] = usePersistentEntryState()
    const [userName] = usePersistentUsernameState()
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
        refreshFromStorage()
    }, [refreshFromStorage])

    const onKeyPress = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>((e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmission()
        }
    }, [handleSubmission])

    return <div>
        <div className={styles.noteFormContainer}>
            <p>Hello {userName}!</p>
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
            {sortedEntries.length === 0 && <Text type="secondary">Notes will appear here.</Text>}
        </div>
    </div>
})
