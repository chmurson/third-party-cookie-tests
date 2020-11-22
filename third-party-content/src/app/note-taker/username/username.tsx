import React, { FC, useCallback, useState } from 'react'
import { Input, Button, Form } from 'antd'
import { usePersistentUsernameState } from './use-persistent-username-state'

export const UserName: FC<{ onChange: (name: string) => void }> = (({ onChange }) => {
    const [name, setName] = useState('')
    const [, setPersistentUserName] = usePersistentUsernameState()

    const handleSubmit = useCallback(() => {
        setName(name => {
            setPersistentUserName(name)
            onChange(name);
            return name
        })
    }, [setName, setPersistentUserName, onChange])

    return <div>
        <p>Hello, there is no trace of your activity here.</p>
        <p>Please set up your name first.</p>
        <Form.Item label="Username">
            <Input autoFocus value={name} onChange={e => setName(e.target.value)} onPressEnter={handleSubmit} />
        </Form.Item>
        <Button onClick={handleSubmit} type="primary">Set Name</Button>
    </div>
})

