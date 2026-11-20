import { ButtonLink } from '../components/ButtonLink'
import { Section } from '../components/Section'

export function NotFound() {
  return (
    <Section id="not-found" theme="light" label="Page not found" size="hero">
      <title>Page not found | Vipul Khunti</title>
      <meta name="robots" content="noindex" />
      <h1 className="font-serif text-h1 font-normal">Page not found</h1>
      <p className="mt-4 max-w-prose text-muted">This address does not match any page on the site.</p>
      <div className="mt-8">
        <ButtonLink to="/">Back to home</ButtonLink>
      </div>
    </Section>
  )
}
