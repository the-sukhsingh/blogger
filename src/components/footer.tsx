import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background transition-colors mt-auto">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Books
            </h4>
            <ul className="space-y-2.5 text-muted-foreground">
              <li>
                <Link to="/books" className="hover:text-foreground transition-colors">
                  Book Library
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-foreground transition-colors">
                  Create Book
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/80">Multi-Chapter Drafting</span>
              </li>
              <li>
                <span className="text-muted-foreground/80">Print PDF Formatting</span>
              </li>
              <li>
                <span className="text-muted-foreground/80">Shareable Preview Links</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Articles
            </h4>
            <ul className="space-y-2.5 text-muted-foreground">
              <li>
                <Link to="/blogs" className="hover:text-foreground transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/new" className="hover:text-foreground transition-colors">
                  Write Article
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/80">Markdown & Visual Mode</span>
              </li>
              <li>
                <span className="text-muted-foreground/80">Archive & Drafts</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Documentation
            </h4>
            <ul className="space-y-2.5 text-muted-foreground">
              <li>
                <Link to="/docs" className="hover:text-foreground transition-colors">
                  Overview & Guides
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-foreground transition-colors">
                  Print Trim Standards
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-foreground transition-colors">
                  Multilingual Writing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              About Beelog
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              A distraction-free publishing workspace for authors and engineers to write books, craft multi-chapter manuscripts, and format print-ready publications.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Beelog Press. Clean, calm writing and publishing.</p>
          <div className="flex items-center gap-6">
            <Link to="/books" className="hover:text-foreground transition-colors">
              Books
            </Link>
            <Link to="/blogs" className="hover:text-foreground transition-colors">
              Articles
            </Link>
            <Link to="/docs" className="hover:text-foreground transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
