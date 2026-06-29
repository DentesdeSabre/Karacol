import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Karacol & Linha',
  description: 'Receitas e mostruário — artesanal e lúdico'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-karacol-cream text-#333 font-sans">
        <div className="max-w-5xl mx-auto p-4">
          <header className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold" style={{color:'#945846'}}>Karacol & Linha</h1>
            <nav>
              <a href="/" className="mr-4 text-karacol-brown">Início</a>
              <a href="/admin" className="text-karacol-brown">Admin</a>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="mt-12 py-6 text-center text-sm text-karacol-brown">
            Feito com carinho — Karacol & Linha
          </footer>
        </div>
      </body>
    </html>
  )
}
