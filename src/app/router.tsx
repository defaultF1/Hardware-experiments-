import { createBrowserRouter, createMemoryRouter } from 'react-router'
import { RootLayout } from './RootLayout'
import { LabPage } from '../pages/Lab'
import { WorkbenchPage } from '../pages/Workbench'
import { DesignsPage } from '../pages/Designs'
import { PartsPage } from '../pages/Parts'
import { PartDetailPage } from '../pages/PartDetail'
import { TutorialPage } from '../pages/Tutorial'
import { DocsPage } from '../pages/Docs'
import { AboutPage } from '../pages/About'
import { NotFoundPage } from '../pages/NotFound'

const routes = [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <LabPage /> },
        { path: 'workbench', element: <WorkbenchPage /> },
        { path: 'workbench/:designId', element: <WorkbenchPage /> },
        { path: 'designs', element: <DesignsPage /> },
        { path: 'parts', element: <PartsPage /> },
        { path: 'parts/:partId', element: <PartDetailPage /> },
        { path: 'tutorial', element: <TutorialPage /> },
        { path: 'docs', element: <DocsPage /> },
        { path: 'about', element: <AboutPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
]

/** VITE_ROUTER=memory builds a self-contained bundle (no URL routing), used for hosted previews. */
export const router =
  import.meta.env.VITE_ROUTER === 'memory'
    ? createMemoryRouter(routes, { initialEntries: ['/'] })
    : createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' })
