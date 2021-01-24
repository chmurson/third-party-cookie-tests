import React, { FC, useCallback } from 'react'
import { Button } from 'antd'

type Props = {}

export const AccessStorageRequester: FC<Props> = (({}) => {
    const handleRequest = useCallback(() => {
        //@ts-ignore
        document.requestStorageAccess()
    }, [])

    return <Button onClick={handleRequest} type="default">Request Storage Access</Button>
})
