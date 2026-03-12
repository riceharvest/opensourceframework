import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { ReactNode } from 'react'

export const metadata = {
  title: '@opensourceframework',
  description: 'Maintained, compatibility-first forks of important Next.js/React packages'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          navbar={<Navbar logo={<b>@opensourceframework</b>} />}
          footer={<Footer> {new Date().getFullYear()} © OpenSource Framework</Footer>}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
