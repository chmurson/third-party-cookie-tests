import React, { FC, useEffect, useMemo, useState } from 'react'
import { CookieStateConverter, useStorageState } from '../hooks'
import { Tooltip, Typography, Alert } from 'antd'

const cookieListOfHotsConverter = new CookieStateConverter<string[]>([])

export const SiteTracker: FC = () => {
    const [listOfVisitedHosts, setListVisitedOfHosts] = useState<string[]>([])
    const [isFirstVisitHere, setIsFirstVisitHere] = useState<boolean | undefined>(undefined)
    const { setStorageState, getStorageState, hasError } = useStorageState(cookieListOfHotsConverter, 'LIST_OF_HOSTS')
    const currentHost = document.referrer || document.location.origin

    useEffect(() => {
        getStorageState().then(returnedListOfVisitedHosts => {

            const hasUserBeenHereBefore = returnedListOfVisitedHosts.includes(currentHost)
            setIsFirstVisitHere(returnedListOfVisitedHosts.length === 0)

            if (!hasUserBeenHereBefore) {
                returnedListOfVisitedHosts.push(currentHost)
                setStorageState(returnedListOfVisitedHosts)
            }

            setListVisitedOfHosts(returnedListOfVisitedHosts)
        })
    }, [setListVisitedOfHosts, setStorageState, currentHost, getStorageState])
    const hasVisitedOtherSites = useMemo(() => listOfVisitedHosts.filter(x => x !== currentHost).length > 0, [listOfVisitedHosts, currentHost])

    return <div>
        <p>
            {isFirstVisitHere === true && <Typography.Text>Hello, nice to mee you! </Typography.Text>}
            {isFirstVisitHere === false && <Typography.Text>Welcome back! </Typography.Text>}
        </p>
        {hasError === true && <Alert
            message="Error"
            description="Could not save info about the visit in the storage."
            type="error"
            showIcon
        />}
        {hasVisitedOtherSites && <p>
            I've seen you on other sites.&nbsp;
            {<Tooltip title={<ul>
                {listOfVisitedHosts.map(host => <li key="host">{host}</li>)}
            </ul>}>
                <Typography.Text type="secondary">hover see to see all list of the sites</Typography.Text>
            </Tooltip>}
        </p>}
    </div>

}


