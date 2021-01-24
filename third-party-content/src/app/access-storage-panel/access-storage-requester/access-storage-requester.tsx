import React, { FC, useCallback } from 'react'
import { Button } from 'antd'

type Props = {
    onSuccess?: () => void
    onFail?: () => void
}

export const AccessStorageRequester: FC<Props> = (({ onSuccess, onFail }) => {
    const handleRequest = useCallback(() => {
        //@ts-ignore
        document.requestStorageAccess().then(() => {
            onSuccess?.()
        }).catch(() => {
            onFail?.()
        })
    }, [onSuccess, onFail])

    return <Button onClick={handleRequest} type="default">Request Storage Access</Button>
})
