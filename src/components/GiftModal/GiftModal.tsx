import React, { memo } from "react";
import { Modal, Icon } from 'antd-mobile'
import styles from './GiftModal.less'
import noPrize from '@/assets/game/noPrize.png';

const wxPrefix = process.env.NODE_ENV === 'development' ? 'http://ydhtest.fetower.com/' : '';

function closest(el: any, selector: any) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export type ModalProps = {
  visible: boolean;
  status: boolean;
  img: string;
  onClose(): void;
}

export default memo((props: ModalProps) => {

  const onWrapTouchStart = (e: React.BaseSyntheticEvent) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }
  const { visible, onClose, status, img } = props;

  return (
    <Modal
      visible={visible}
      transparent
      maskClosable={false}
      onClose={onClose}
      className={styles['modal-gift-info']}
      wrapClassName={styles['modal-bg']}
      wrapProps={{ onTouchStart: onWrapTouchStart }}
    >
      <Icon
        type="cross-circle"
        size={'xxs'}
        color="#E5E5E5"
        className={styles['clise-btn']}
        onClick={onClose}
      />
      <div className={styles['gift-info-main']}>
        <div className={styles['gift-img']}>
          <img src={img ? `${wxPrefix + img}` : noPrize} alt=""/>
        </div>
        <div className={styles['gift-main-info']}>
          <p className={styles['gift-main-text']}>{status ? '恭喜你，中奖了！' : '好遗憾 您与大奖擦肩而过'}</p>
          <button className={styles['gift-main-btn']} onClick={onClose}>再来一次</button>
        </div>
      </div>
    </Modal>
  )
})
