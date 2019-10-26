import React, { memo } from "react"
import styles from './ItemCard.less'
export type ModalProps = {
  title: string;
  holdText: string;
  background?: string;
  children: any
}

export default memo((props: ModalProps) => {
  const { title, holdText, background, children } = props
  return (
    <>
      <div className={styles['game-explain-list']}>
        <div className={styles['explain-list-card']} style={{background}}>
          <h3 className={styles.title}>
            <span className={styles['title-text']}>{title}</span>
          </h3>
          { children ? children : <div className={styles['no-data']}>{holdText}</div>}
        </div>
      </div>
    </>
  )
})
