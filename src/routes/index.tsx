import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '#/components/navbar'
import { Footer } from '#/components/footer'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors selection:bg-accent selection:text-accent-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 w-full py-16 sm:py-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-3xl mx-auto pt-6">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-muted-foreground border border-border px-3 py-1 rounded-full">
            Publishing Workspace
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.15]">
            Write books and articles with complete editorial clarity.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed max-w-2xl mx-auto">
            A quiet, distraction-free environment to write multi-chapter books in any language, format manuscripts for print-ready PDFs, and publish technical articles.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/books">
              <Button size="lg" className="px-6 h-11 text-sm font-sans">
                Open Books
              </Button>
            </Link>
            <Link to="/blogs">
              <Button variant="outline" size="lg" className="px-6 h-11 text-sm font-sans">
                Read Articles
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Grid with calm whitespace */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 border-t border-border">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block">
              01 · Multi-Chapter Books
            </span>
            <h2 className="font-serif text-xl font-medium text-foreground">
              Manuscripts in any language
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organize long-form work into structured chapters. Full support for any language, including right-to-left scripts like Arabic and Hebrew, with seamless draft status tracking.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block">
              02 · Print PDF Formatting
            </span>
            <h2 className="font-serif text-xl font-medium text-foreground">
              Precision print-on-demand
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adjust trim sizes (6"x9" Trade, 5.5"x8.5" Digest, A5), binding gutters, outer margins, font sizes, and running headers. Ready for instant browser printing or PDF download.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block">
              03 · Link Sharing & Previews
            </span>
            <h2 className="font-serif text-xl font-medium text-foreground">
              Direct private feedback
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Share any book or draft with editors and beta readers using a private link. Readers can adjust typography and themes (light, dark, sepia) in their own browser.
            </p>
          </div>
        </section>

        {/* Book & Article preview showcase */}
        <section className="border border-border rounded-xl p-8 sm:p-12 bg-card space-y-8">
          <div className="max-w-xl space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              The Writing Canvas
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
              Built for writers who value words over widgets.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No bloated sidebars, no distracting popups. Switch between a clean visual editor and raw Markdown. Word counts, reading time estimates, and chapter outlines stay out of your way until you need them.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/books">
              <Button variant="default" size="sm" className="text-xs h-9 px-4 font-sans">
                Start a New Book
              </Button>
            </Link>
            <Link to="/new">
              <Button variant="outline" size="sm" className="text-xs h-9 px-4 font-sans">
                Write a Standalone Article
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
