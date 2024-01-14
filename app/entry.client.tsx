import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { I18nClientProvider, initI18nextClient } from './integrations/i18n' // your i18n configuration file

function hydrate() {
	startTransition(() => {
		hydrateRoot(
			document,
			<StrictMode>
				<I18nClientProvider>
					<RemixBrowser />
				</I18nClientProvider>
			</StrictMode>
		)
	})
}

initI18nextClient(hydrate)

if (typeof requestIdleCallback === 'function') {
	requestIdleCallback(hydrate)
} else {
	// Safari doesn't support requestIdleCallback
	// https://caniuse.com/requestidlecallback
	setTimeout(hydrate, 1)
}
