import React, { memo } from "react";
import { Modal } from 'antd-mobile'
import styles from './shareModal.less'

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
  const { visible, onClose } = props;
  return (
    <Modal
      visible={visible}
      transparent
      maskClosable={false}
      onClose={onClose}
      className={styles['modal-share-info']}
      wrapClassName={styles['modal-bg']}
      wrapProps={{ onTouchStart: onWrapTouchStart }}
    >
      <div className={styles['share-warp']}>
        <div>
          <div className={styles['point-warp']}>
            <img src={require('@/assets/tips.png')} className={styles['point-img']} alt="引导分享图片"/>
          </div>
        </div>
        <div className={styles.btn}>
          <div className={styles['point-btn-warp']} onClick={onClose}>
            <img src={require('@/assets/tips-btn.png')} className={styles['point-img']} alt="分享按钮"/>
          </div>
        </div>
      </div>
    </Modal>
  )
})
