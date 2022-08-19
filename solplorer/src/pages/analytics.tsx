import { Container } from '../components'

export default function Analytics({}) {
  return (
    <>
      <Container className="text-center mt-md">
        We ♥ Transparency, this is why we share our visitor analytics data publicly.
      </Container>
      <iframe
        plausible-embed
        src={'https://plausible.io/share/solplorer.org?auth=kkh2o9ve9b9S2LCrNNyKv&embed=true&theme=dark&background=transparent'}
        scrolling="yes"
        frameBorder="0"
        loading="lazy"
        style={{ width: '1px', minWidth: '100%', height: '1600px' }}
      />
      <Container className="mb-md text-center text-sm">
        Stats powered by{' '}
        <a
          href="https://plausible.io"
          rel="noreferrer"
          target="_blank"
        >
          Plausible Analytics
        </a>
      </Container>
      <script async src="https://plausible.io/js/embed.host.js"></script>
    </>
  )
}
