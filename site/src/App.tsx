import React, { useCallback, useState } from 'react'
import styles from './App.module.scss'
import { InputSwitch } from 'primereact/inputswitch'
import clsx from 'clsx'

const SHOWCOOKIE2ME_URL = process.env.REACT_APP_SHOWCOOKIE2ME_URL
console.log(process.env)

function App() {
    const [iframeVisible, setIframeVisible] = useState(false)
    const handleIframeSwitchChange = useCallback(e => {
        setIframeVisible(e.value)
    }, [])

    console.log('render')
    return (
        <div className={styles.App}>
            <div>
                <h2>A site {window.location.host}</h2>

                <div className="p-field p-grid">
                    <label htmlFor="firstname1" className="p-col-fixed">Visible iframe</label>
                    <div className="p-col p-justify-start">
                        <InputSwitch checked={iframeVisible} onChange={handleIframeSwitchChange}
                                     ariaLabelledBy="iframe-switch" />
                    </div>
                </div>
                <p className={clsx({ [styles.invisible]: !iframeVisible })}>Iframe URL: {SHOWCOOKIE2ME_URL}</p>
            </div>
            <iframe className={clsx(styles.iframe, { [styles.iframeVisible]: iframeVisible })}
                    src={SHOWCOOKIE2ME_URL} />

        </div>
    )
}

export default App
