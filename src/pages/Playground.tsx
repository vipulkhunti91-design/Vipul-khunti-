import { ButtonLink } from '../components/ButtonLink'
import { DesignPlayground } from '../components/DesignPlayground'
import { Section } from '../components/Section'

// Kept as a separate route so experimental interactions do not interrupt the
// recruiter-facing portfolio journey.
export function Playground() {
  return (
    <Section id="playground" theme="light" label="Design experiments" size="hero">
      <title>Design Playground | Vipul Khunti</title>
      <ButtonLink to="/#work" variant="secondary" arrow={false}>
        ← Back to selected projects
      </ButtonLink>
      <div className="mt-8 max-w-3xl">
        <h1 className="font-serif text-h1 font-normal">Design Playground</h1>
        <p className="mt-5 max-w-prose text-lg text-muted leading-relaxed">
          A separate space for interface experiments, interaction states, and accessibility checks.
        </p>
      </div>
      <div className="mt-12">
        <DesignPlayground />
      </div>
    </Section>
  )
}
