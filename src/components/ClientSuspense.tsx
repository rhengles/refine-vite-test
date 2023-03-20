import { useState, useEffect, useMemo, useRef } from "react"
import abortablePromise from "~/logic/abortablePromise"

export default function ClientSuspense<T>({
	promise,
	abort,
	empty: Empty = () => null,
	loading: Loading = Empty,
	success: Success = Empty,
	failure: Failure = Empty,
}: {
	promise: Promise<T>
	abort?: AbortSignal | undefined
	empty?: (() => JSX.Element | null) | undefined
	loading?: (() => JSX.Element | null) | undefined
	success?: ((props: { data?: T }) => JSX.Element | null) | undefined
	failure?: ((props: { error?: any }) => JSX.Element | null) | undefined
}) {
	const STATE_LOADING = 1
	const STATE_SUCCESS = 2
	const STATE_FAILURE = 3
	type State =
		| typeof STATE_LOADING
		| typeof STATE_SUCCESS
		| typeof STATE_FAILURE
	const [state, setState] = useState<State>()
	const [data, setData] = useState<T>()
	const [error, setError] = useState<any>()
    const reqNumRef = useRef(0)
	const abortProm = useMemo(() => {
		console.warn(`ClientSuspense: useMemo abortProm`, { abort, promise })
		return abort
			? Promise.race([promise, abortablePromise<T>(abort)])
			: promise
	}, [promise, abort])
	useEffect(() => {
		(async () => {
            const currentReqNum = reqNumRef.current + 1
            reqNumRef.current = currentReqNum
			try {
				setData(undefined)
				setError(undefined)
				setState(STATE_LOADING)
                const data = await abortProm
                if (currentReqNum !== reqNumRef.current) return undefined
				setData(data)
				setState(STATE_SUCCESS)
			} catch (error) {
                if (currentReqNum !== reqNumRef.current) return undefined
				setError(error)
				setState(STATE_FAILURE)
			}
		})()
	}, [abortProm])

	return <>{
		state === STATE_LOADING ? <Loading /> :
		state === STATE_SUCCESS ? <Success data={data as T} /> :
		state === STATE_FAILURE ? <Failure error={error} /> :
		<Empty />
	}</>
}
