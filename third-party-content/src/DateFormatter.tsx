import React, { FC } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import dayDiff from 'date-fns/differenceInCalendarDays'
import format from 'date-fns/format'


export const DateFormatter: FC<{ date: Date }> = ({ date }) => {
    const now = new Date()
    const resultDatInDiff = dayDiff(now, date)
    if (resultDatInDiff > 14) {

        return <span>{format(date, 'do MMM yyyy')}</span>
    }
    return <span>{formatDistanceToNow(date)} ago</span>
}
