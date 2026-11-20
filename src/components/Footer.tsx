import { site } from '../data/site'
import { Container } from './Container'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer data-theme="dark" className="border-t border-line bg-bg text-fg">
      <Container className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand & Motto */}
          <div>
            <p className="font-serif text-2xl font-normal text-fg">{site.name}</p>
            <p className="mt-1 text-sm font-medium text-muted">{site.role}</p>
            <p className="mt-1.5 text-xs text-muted/70 italic">Designing with curiosity. Solving with creativity.</p>
          </div>

          {/* Direct Contact info (Clean & Minimal) */}
          <div className="flex flex-col gap-1.5 md:items-end text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Get In Touch</span>
            <a
              href={`mailto:${site.email}`}
              className="text-fg hover:text-accent-text hover:underline transition-colors font-mono text-xs sm:text-sm"
            >
              {site.email}
            </a>
            <a
              href="tel:+917096447726"
              className="text-muted hover:text-fg transition-colors text-xs sm:text-sm"
            >
              +91 70964 47726
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between sm:pr-20">
          <p className="text-xs text-muted">© {year} {site.name}. All rights reserved.</p>
          <span className="text-xs text-muted/60">Portfolio &bull; Ahmedabad, Gujarat</span>
        </div>
      </Container>
    </footer>
  )
}
