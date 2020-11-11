import React, { FC, KeyboardEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Button, Typography, Alert } from 'antd'
import cookies from 'js-cookie'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import styles from './App.module.scss'
import { DateFormatter } from './DateFormatter'

const { TextArea } = Input
const { Text } = Typography

function App() {
    return <Router><Switch>
        <Route path="/direct-document-cookie" render={() => <NoteTaker />} />
        <Route path="/request-storage-api" render={() => <NoteTaker storageAccessApi />} />
        <Redirect to="/direct-document-cookie" />
    </Switch>
    </Router>
}

const NoteTaker: FC<{ storageAccessApi?: boolean }> = ({ storageAccessApi }) => {
    const [text, setText] = useState<string>('')
    const [entries, addEntry] = usePersistentEntryState(storageAccessApi)
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

    if (storageAccessApi && !supportsStorageAccessAPI()) {
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
        <div className={styles.App}>
            <TextArea rows={5} cols={30} value={text} onChange={e => setText(e.currentTarget.value)}
                      onKeyDown={onKeyPress} placeholder="Write a short note here" />
            <Button onClick={handleSubmission} type="primary">Submit</Button>
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

const STATE_COOKIE_NAME = 'showcookie2mestate'

type Entry = {
    date: string,
    text: string
}

function usePersistentEntryState(storageAccessApi?: boolean): [Entry[], (entry: Entry) => void] {
    const [entries, setEntries] = useState<Entry[]>([])
    const { getCookieState, setCookieState } = useCookieState(storageAccessApi)
    useEffect(() => {
        getCookieState().then(state => setEntries(state))
    }, [getCookieState])
    const addEntry = useCallback((entry: Entry) => {
        setEntries((entries) => {
            const newEntries = [...entries, entry]
            setCookieState(newEntries)
            return newEntries
        })
    }, [setCookieState, setEntries])
    return [entries, addEntry]
}


const cookieStateConverters = {
    decode: (cookieValue: any): Entry[] => {
        if (!cookieValue) {
            return []
        }
        try {
            const decoded = window.atob('' + cookieValue)
            return JSON.parse(decodeURIComponent(decoded))
        } catch (e) {
            console.error('Could not parse the cookie value')
            console.error(e)
            return []
        }
    },
    encode: (state: Entry[]) => window.btoa(encodeURIComponent(JSON.stringify(state))),
}

function useCookieState(storageAccessApi?: boolean) {
    const { setCookie, getCookie } = useCookieAccessMethods(storageAccessApi)

    return useMemo(() => ({
        async setCookieState(state: Entry[]) {
            await setCookie(STATE_COOKIE_NAME, cookieStateConverters.encode(state))
        },
        async getCookieState(): Promise<Entry[]> {
            const cookieValue = await getCookie(STATE_COOKIE_NAME)
            return cookieStateConverters.decode(cookieValue)
        },
    }), [setCookie, getCookie])
}

function useCookieAccessMethods(storageAccessApi?: boolean) {
    const normalMethods = useMemo(() => ({
        async getCookie(key: string) {
            return cookies.get(key)
        },
        async setCookie(key: string, value: string) {
            cookies.set(key, value)
        },
    }), [])
    const storageAccessApiMethods = useMemo(() => ({
        async getCookie(key: string) {
            try {
                // @ts-ignore
                await document.requestStorageAccess()
                return cookies.get(key)
            } catch (e) {
                console.error(e)
                console.error('getCookie failed')
            }
        },
        async setCookie(key: string, value: string) {
            try {
                // @ts-ignore
                await document.requestStorageAccess()
                cookies.set(key, value)
            } catch (e) {
                console.error(e)
                console.error('setCookie failed')
            }
        },
    }), [])

    if (storageAccessApi) {
        return storageAccessApiMethods
    }
    return normalMethods
}

function supportsStorageAccessAPI() {
    //@ts-ignore
    return document.requestStorageAccess != null
}

export default App
