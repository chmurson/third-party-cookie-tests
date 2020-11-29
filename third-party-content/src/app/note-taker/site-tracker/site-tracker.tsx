import React, { FC, useEffect, useMemo, useState } from 'react'
import { CookieStateConverter, useStorageState } from '../hooks'
import { Tooltip, Typography } from 'antd'

const cookieListOfHotsConverter = new CookieStateConverter<string[]>([])

export const SiteTracker: FC = () => {
    const [listOfVisitedHosts, setListVisitedOfHosts] = useState<string[]>([])
    const [isFirstVisitHere, setIsFirstVisitHere] = useState<boolean | undefined>(undefined)
    const { setStorageState, getStorageState } = useStorageState(cookieListOfHotsConverter, 'LIST_OF_HOSTS')
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
            {isFirstVisitHere && <Typography.Text>Hello, nice to mee you! </Typography.Text>}
            {!isFirstVisitHere && <Typography.Text>Welcome back! </Typography.Text>}
        </p>
        {hasVisitedOtherSites && <p>
            I've seen you on other sites.
            {<Tooltip title={<ul>
                {listOfVisitedHosts.map(host => <li key="host">{host}</li>)}
            </ul>}>
                <Typography.Text type="secondary">hover see to see all list of pages</Typography.Text>
            </Tooltip>}
        </p>}
    </div>

}


