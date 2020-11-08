import React, { KeyboardEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Button, Typography } from 'antd'
import cookies from 'js-cookie'
import styles from './App.module.scss'
import { DateFormatter } from './DateFormatter'

const { TextArea } = Input
const { Text } = Typography

function App() {
    const [text, setText] = useState<string>('')
    const [entries, addEntry] = useCookieState()
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

    const onKeyPress = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>((e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmission()
        }
    }, [handleSubmission])


    return (
        <div className={styles.App}>
            <TextArea rows={5} cols={30} value={text} onChange={e => setText(e.currentTarget.value)}
                      onKeyDown={onKeyPress} placeholder="Write a short note here" />
            <Button onClick={handleSubmission} type="primary">Submit</Button>
            <div>
                {sortedEntries.map(entry => (
                    <p className="p-field" key={entry.date}>
                        <div
                            dangerouslySetInnerHTML={{ __html: decodeURIComponent(entry.text).replaceAll('\n', '</br>') }} />
                        <div><Text type="secondary"><DateFormatter date={new Date(entry.date)} /></Text></div>
                    </p>))}
            </div>
        </div>
    )
}

const STATE_COOKIE_NAME = 'showcookie2mestate'

type Entry = {
    date: string,
    text: string
}

function useCookieState(): [Entry[], (entry: Entry) => void] {
    const [entries, setEntries] = useState<Entry[]>([])
    useEffect(() => {
        const state = getCookieState()
        setEntries(state)
    }, [])
    const addEntry = useCallback((entry: Entry) => {
        setEntries((entries) => {
            const newEntries = [...entries, entry]
            setsCookieState(newEntries)
            return newEntries
        })
    }, [])
    return [entries, addEntry]
}

function getCookieState(): Entry[] {
    const cookieValue = '' + cookies.get(STATE_COOKIE_NAME)
    try {
        const decoded = window.atob(cookieValue)
        return JSON.parse(decodeURIComponent(decoded))
    } catch (e) {
        console.error('Could not parse the cookie value')
        console.error(e)
        return []
    }
}

function setsCookieState(state: Entry[]) {
    const cookieValue = window.btoa(encodeURIComponent(JSON.stringify(state)))
    cookies.set(STATE_COOKIE_NAME, cookieValue)
}


export default App
