import { useState, useEffect, useMemo } from "react"
import { Navigate, useLocation } from "react-router-dom";
import { authProvider } from "~/authProvider";
import ClientSuspense from "~/components/ClientSuspense"

function AuthError({ error }: { error?: any }) {
	return <div>
		<h3>Auth Error</h3>
		<p>{ error instanceof Error ? error.message : String(error) }</p>
	</div>
}

export default function RequireAuth({
	children,
	RenderAuthFailure = AuthError,
}: {
	children: JSX.Element
	RenderAuthFailure?: ((props: { error?: any }) => JSX.Element | null) | undefined
}) {
	let location = useLocation();
	const [authProm, setAuthProm] = useState<Promise<any>>()
	useEffect(() => {
		setAuthProm(authProvider.getIdentity?.() ?? Promise.reject(new Error(`authProvider.getIdentity is undefined or did not return a promise`)))
	}, [])
	const RenderAuthSuccess = useMemo(() => ({ data }: { data?: any }) => {
		return data
            ? children
            : <Navigate to="/login" state={{ from: location }} replace />
	}, [children, location])

	return authProm
		? <ClientSuspense
			promise={authProm}
			success={RenderAuthSuccess}
			failure={RenderAuthFailure}
		/>
		: null
}
