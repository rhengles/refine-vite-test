
export default function abortablePromise<T>(signal: AbortSignal) {
	return new Promise<T>((_, reject) => {
		signal.addEventListener('abort', () => reject((signal as any).reason))
	})
}
