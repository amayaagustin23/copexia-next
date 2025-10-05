import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artículos - Copexia',
  description: 'Descubre las últimas tendencias, consejos y conocimientos sobre transformación digital y gestión organizacional.',
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
