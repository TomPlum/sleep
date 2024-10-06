import {useQuery} from "@tanstack/react-query";
import {useCallback} from "react";
import {GetPillowDataProps} from "data/usePillowData/types.ts";

export const usePillowData = ({ type }: GetPillowDataProps) => {
    const readFile = useCallback(async () => {
        const fileName = type === 'raw' ? 'PillowDataRaw.txt' : 'PillowData.csv'
        const response = await fetch(fileName)

        if (!response.ok) {
            throw new Error('Failed to read sleep data.')
        }

        return await response.text()
    }, [type])

    return useQuery({
        queryKey: ['sleepData', type],
        queryFn: readFile
    })
}