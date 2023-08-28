import Image from 'next/image'
import { useState } from 'react'

import styles from './deprecation-notice-modal.module.css'

const DeprecationNoticeModal = () => {
  const [show, setShow] = useState(true)
  const hide = (ev) => {
    ev.stopPropagation()
    setShow(false)
  }

  return show ? (
    <>
      <div className={styles.Wrapper} onClick={hide}>
        <div className={styles.Dialog} onClick={(ev) => ev.stopPropagation()}>
          <p>
            Please notice that the <strong className="bold underline">displayed data are not up to date</strong>.
          </p>
          <p>
            Solplorer is currently not maintained.<br />
            May or may not forever.<br />
            <a href="https://github.com/ronnyhaase/solplorer">Here&apos;s the code.</a><br />
            <br />
            We love you. We love Solana. &hearts;<br />
            <br />
            Thank you, for your support!<br />
            - Ronny (<a href="https://ronnyhaase.com">WWW</a> | <a href="https://x.com/ronnyhaase">Twitter</a>)<br />
          </p>
          <p className="text-center">
            <button className="px-md py-sm border-0 rounded-sm bg-white" onClick={hide}>OK, got it!</button>
          </p>
        </div>
      </div>
    </>
  ) : null
}

export {
  DeprecationNoticeModal,
}
