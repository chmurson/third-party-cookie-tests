import React, { FC, useCallback, useState } from 'react'
import styles from './App.module.scss'
import { Radio } from 'antd'
import clsx from 'clsx'

const SHOWCOOKIE2ME_URL = process.env.REACT_APP_SHOWCOOKIE2ME_URL
console.log(process.env)

type HiddenIframeOptions = 'Visible' | 'Hidden';
const hiddenIframeOptions: HiddenIframeOptions[] = ['Visible', 'Hidden']

function App() {
    const [iframeVisible, setIframeVisible] = useState<HiddenIframeOptions>('Hidden')
    const handleIframeSwitchChange = useCallback(e => {
        setIframeVisible(e.target.value)
    }, [])
    const initialTabValue = new URLSearchParams(window.location.search).get('tab') || 'direct-document-cookie'
    const [tabValue, setTabValue] = useState(initialTabValue)
    const z = useCallback((e) => {
        const tabValue = e.target.value
        setTabValue(tabValue)
        window.history.pushState(null, tabValue, '?' + new URLSearchParams({ tab: tabValue }).toString())
    }, [])


    return (
        <div className={styles.App}>
            <div className={styles.topContainer}>
                <h2>A site {window.location.host}</h2>

                <div className="">
                    <label htmlFor="firstname1" className="">Iframe</label>
                    <div className="">
                        <Radio.Group options={hiddenIframeOptions}
                                     value={iframeVisible}
                                     onChange={handleIframeSwitchChange}
                                     optionType="button"
                                     size={'small'}
                                     buttonStyle="outline" />
                    </div>
                    <label htmlFor="firstname1" className="">Cookie method</label>
                    <div className="">
                        <Radio.Group
                            options={[{
                                value: 'direct-document-cookie',
                                label: 'Direct document.cookie ',
                            }, { value: 'storage-access-api', label: 'Storage access' }]}
                            value={tabValue}
                            onChange={z}
                            optionType="button"
                            size={'large'}
                            buttonStyle="solid" />
                    </div>
                </div>

            </div>
            <IFrameContent url={SHOWCOOKIE2ME_URL + '/' + tabValue} iframeVisible={iframeVisible} />

        </div>
    )
}

const IFrameContent: FC<{ url: string, iframeVisible: HiddenIframeOptions }> = ({ iframeVisible, url }) => {
    return <>
        <p className={clsx({ [styles.invisible]: iframeVisible === 'Hidden' })}>Iframe
            URL: {url}</p>
        <iframe title="A note maker"
                className={clsx(styles.iframe, { [styles.iframeVisible]: iframeVisible === 'Visible' })}
                src={url}
        />
    </>
}

export default App
