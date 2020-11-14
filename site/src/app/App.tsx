import React, { FC, memo, useEffect, useMemo, useState } from 'react'
import styles from './App.module.scss'
import { Radio, Spin, Switch } from 'antd'
import clsx from 'clsx'
import { StorageType, useLocalState } from './hooks'

const SHOWCOOKIE2ME_URL = process.env.REACT_APP_SHOWCOOKIE2ME_URL

const storageOptions: { label: string, value: StorageType }[] = [{
    value: 'cookie',
    label: 'Cookies',
}, { value: 'localStorage', label: 'Local Storage' }]

export function App() {
    const [iframeVisible, setIframeVisible] = useState<boolean>(false)
    const { setUseRequestStorageAPI, setStorageType, localState: { useStorageAccessAPI, storageType } } = useLocalState()
    const iframeUrl = useMemo(() => {
        const storageTypeToUrlPart: Record<StorageType, string> = {
            localStorage: 'local-storage',
            cookie: 'cookies',
        }
        return `${storageTypeToUrlPart[storageType]}/${useStorageAccessAPI ? '1' : ''}`
    }, [useStorageAccessAPI, storageType])

    return (
        <div className={styles.App}>
            <div className={styles.topContainer}>
                <h2>A site {window.location.host}</h2>

                <div className="">
                    <label htmlFor="firstname1" className="">Iframe border <Switch size="default"
                                                                                   checkedChildren="visible"
                                                                                   unCheckedChildren="hidden"
                                                                                   onChange={setIframeVisible}
                                                                                   defaultChecked={iframeVisible} /></label>
                    <br /><br />
                    <label htmlFor="firstname1" className="">Storage method</label>
                    <div className="">
                        <Radio.Group
                            options={storageOptions}
                            value={storageType}
                            onChange={e => setStorageType(e.target.value)}
                            optionType="button"
                            size={'large'}
                            buttonStyle="solid" />
                    </div>
                    <br />
                    <label htmlFor="firstname1" className="">Storage Access API <Switch size="default"
                                                                                        onChange={setUseRequestStorageAPI}
                                                                                        checkedChildren="on"
                                                                                        unCheckedChildren="off"
                                                                                        defaultChecked={useStorageAccessAPI} /></label>
                </div>

            </div>
            <IFrameContent url={SHOWCOOKIE2ME_URL + '/' + iframeUrl} iframeVisible={iframeVisible} />

        </div>
    )
}

const IFrameContent: FC<{ url: string, iframeVisible: boolean }> = memo(({ iframeVisible, url }) => {
    const [spinning, setSpinning] = useState<boolean>(true)
    useEffect(() => {
        setSpinning(true)
    }, [url])

    return <>
        <p className={clsx({ [styles.invisible]: !iframeVisible })}>Iframe
            URL: {url}</p>
        <Spin size="large" spinning={spinning} wrapperClassName={styles.iframeSpinWrapper} className={styles.iframeSpinWrapper}>
            <iframe title="A note maker"
                    className={clsx(styles.iframe, { [styles.iframeVisible]: iframeVisible })}
                    src={url}
                    onLoad={() => setSpinning(false)}
            />
        </Spin>
    </>
})

IFrameContent.displayName = 'IFrameContent'
