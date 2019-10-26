import React, { memo } from "react"
import styles from './index.less'
import Swiper from 'react-id-swiper';

interface SwiperProps {
  children: any
}

const SwiperComponent = ({ children }: SwiperProps) => {
  const height = window.innerWidth / 100 * 8;
  const params = {
    height,
    direction: 'vertical',
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 0,
    noSwiping: true,
    observer: true,
    loop: true,
    observeParents: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
      stopOnLastSlide: true,
    },
  }

  return (
    <>
      {
        children ? <Swiper {...params}>{children}</Swiper> : <div className={styles['no-prize']} >暂无中奖记录</div>
      }
    </>
  )
};

export type ModalProps = {
  title: string
  children: any
}

export default memo((props: ModalProps) => {
  const { children } = props;
  return (
    <>
      <div className={styles.history}>
        <div className={styles['history-inner']}>
          <h3 className={styles['history-title']}>
            <img className={styles.wordimg} src={require("@/assets/allPrize-word.png")} alt=""/>
          </h3>
          <div className={styles['carousel-main']}>
            <SwiperComponent>
              { children }
            </SwiperComponent>
            {/*<Carousel*/}
              {/*className="my-carousel"*/}
              {/*vertical*/}
              {/*dots={false}*/}
              {/*dragging={false}*/}
              {/*swiping={false}*/}
              {/*autoplayInterval={2000}*/}
              {/*autoplay*/}
              {/*infinite*/}
            {/*>*/}
              {/*{ children ? children : <div style={{color: '#fff'}}>暂无中奖记录</div> }*/}
            {/*</Carousel>*/}
          </div>
        </div>
      </div>
    </>
  )
})
