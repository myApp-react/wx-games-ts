import React, { memo, useEffect } from 'react'
import styles from './Loader.less'
import classNames from 'classNames'
import lottie from 'lottie-web';
import lottieAni from '@/assets/loading.json'
const lottieRef: React.RefObject<any> = React.createRef();

interface LoaderProps {
  spinning: boolean
  loadText: string
  fullScreen: boolean
}

export default memo(({spinning = true, loadText = '正在加载中...', fullScreen }: LoaderProps) => {
  useEffect(() => {
    lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: lottieAni,
      name: 'loading',
    })
  });

  return (
    <div
      className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
    >
      <div className={styles.warpper}>
        <div ref={lottieRef} />
        <div className={styles.text}>{loadText}</div>
      </div>
    </div>
  )
})
