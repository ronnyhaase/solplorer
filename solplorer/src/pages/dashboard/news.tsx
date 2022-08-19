import { DateTimeDisplay, Panel } from '../../components'

const News = ({ news }) => {
  return (
    <Panel>
      <h2 className="m-0 mt-md mb-xl text-center">Solana News</h2>
      {!news ? 'Loading...' : (<div>
        {news.data.map(article => (
          <a
            className="d-block p-md odd:bg-inset no-underline text-inherit"
            key={article.url}
            href={article.url}
            target="_blank"
            rel="noreferrer"
          >
            <article>
              <div className="text-muted text-right">
                <address className="d-inline font-bold not-italic">{article.source}</address>, {' '}
                <DateTimeDisplay
                  val={new Date(article.publishedAt)}
                  dateStyle="short"
                  timeStyle="short"
                  />
              </div>
              <h6 className="m-0 mb-sm text-md font-normal">{article.title}</h6>
            </article>
          </a>
        ))}
      </div>)}
      <div className="d-flex items-center justify-center my-md">
        <span>Data provided by</span>
        <a href="https://cryptopanic.com/" className="d-flex">
          <img alt="CryptoPanic" src="/assets/images/cryptopanic.svg" />
        </a>
      </div>
      <div className="text-center">
        Last updated: {news ? (<DateTimeDisplay val={new Date(news.updatedAt)} dateStyle="medium" timeStyle="short" />) : '-'}
      </div>
    </Panel>
  )
}

export default News
