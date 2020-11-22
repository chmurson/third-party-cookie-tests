import React, { useEffect, useState } from 'react'

export const AccessStorageInfo = () => {
    const [hasAccess, setHasAccess] = useState(false)
    useEffect(() => {
        let intervalHandle: any

        hasStorageAccess().then(access => {
            if (access) {
                setHasAccess(true)
            }

            intervalHandle = setInterval(async () => {
                const result = await hasStorageAccess()
                setHasAccess(result)
            }, 1000)
        })

        return () => clearInterval(intervalHandle)
    }, [])

    return <div>
        Has first-party access: {JSON.stringify(hasAccess)}
    </div>
}

async function hasStorageAccess() {
    try {
        //@ts-ignore
        await document.hasStorageAccess()
        return true
    } catch (e) {
        return false
    }
}
