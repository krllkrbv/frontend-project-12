import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE || 'test',
  captureUncaught: true,
  captureUnhandledRejections: true,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
	<RollbarProvider config={rollbarConfig}>
		<ErrorBoundary>
          <App />
		</ErrorBoundary>
	</RollbarProvider>
  </StrictMode>,
)
