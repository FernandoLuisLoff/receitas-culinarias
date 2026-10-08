import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'
import AppRouter from './AppRouter.tsx'
import { theme } from './theme'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <FavoritesProvider>
            <AppRouter />
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)
