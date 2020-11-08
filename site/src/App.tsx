import React, { useCallback, useState } from 'react'
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


    return (
        <div className={styles.App}>
            <div>
                <h2>A site {window.location.host}</h2>

                <div className="p-field p-grid">
                    <label htmlFor="firstname1" className="p-col-fixed">Iframe</label>
                    <div className="p-col p-justify-start">
                        <Radio.Group options={hiddenIframeOptions}
                                     value={iframeVisible}
                                     onChange={handleIframeSwitchChange}
                                     optionType="button"
                                     buttonStyle="outline" />
                    </div>
                </div>
                <p className={clsx({ [styles.invisible]: iframeVisible === 'Hidden' })}>Iframe URL: {SHOWCOOKIE2ME_URL}</p>
            </div>
            <iframe title="A note maker" className={clsx(styles.iframe, { [styles.iframeVisible]: iframeVisible })}
                    src={SHOWCOOKIE2ME_URL} />

        </div>
    )
}

export default App
