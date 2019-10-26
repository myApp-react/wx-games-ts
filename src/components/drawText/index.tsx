import React, { memo } from "react"
import { useMediaQuery } from 'react-responsive'
import styles from './index.less'
export type ModalProps = {
  text: string
  color: string
  fontSize: number
  children?: any
}

export default memo((props: ModalProps) => {
  const { text, color } = props
  const textLen = text.length;
  const isDesktopOrLaptop = useMediaQuery(
    // { minDeviceWidth: 1224 },
    { deviceWidth: 320 } // `device` prop
  )
  if(textLen <= 12){
    return <>
      {
        isDesktopOrLaptop ?
          <p className={styles['text-size-18']} style={{color, textAlign: 'center'}}>{text}</p> :
          <p className={styles['text-size-24']} style={{color, textAlign: 'center'}}>{text}</p>
      }
    </>
  }else if(textLen > 12 && textLen <= 21) {
    return <>
      {
        isDesktopOrLaptop ?
          <p className={styles['text-size-16']} style={{color, textAlign: 'center'}}>{text}</p> :
          <p className={styles['text-size-20']} style={{color, textAlign: 'center'}}>{text}</p>
      }
    </>
  }
  return <>
    {
      isDesktopOrLaptop ?
        <p className={styles['text-size-14']} style={{color, fontSize: 14, textAlign: 'center'}}>{text}</p> :
        <p className={styles['text-size-16']} style={{color, fontSize: 16, textAlign: 'center'}}>{text}</p>
    }
  </>
})
