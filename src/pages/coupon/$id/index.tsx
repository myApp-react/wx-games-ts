import React, { PureComponent } from 'react'
import { Page } from '@/components'
import styles from './index.less'
import { ActivityIndicator } from 'antd-mobile'
import AcBarcode from "ac-barcode";
import QRCode from "qrcode.react";

interface couponType {
  animating: boolean
}

class CouponDetail extends PureComponent<{}, couponType> {

  state: couponType = {
    animating: false
  }

  showQrCode = () => {
    this.setState({
      animating: true
    })
  }

  render() {
    const { animating } = this.state;
    const barcodeH = window.innerWidth / 100 * 16
    const barcodeW = window.innerWidth / 100 * 0.6
    return (
      <Page holdText='正在加载详情' loading={false}>
        <ActivityIndicator
          toast
          text="Loading..."
          animating={animating}
        />
        <div className={styles.detail}>
          <div className={styles.bg}>
            <img src={require('@/assets/coupon/parking-fee-bg.png')} className={styles["bg-img"]} alt=""/>
          </div>
          <div className={styles.main}>
            <div className={styles["main-cont"]}>
              <div className={styles['panel-warp']}>
                <div className={styles["panel-top"]}>
                  <div className={styles['tips-circle']}>
                    <img src={require('@/assets/coupon/gift-cash.png')} alt=""/>
                  </div>
                  <h3 className={styles.title}>现金券满1000减50</h3>
                  <p className={styles['extra-des']}>￥50</p>
                  <div className={styles['explain-img']}>
                    <img src={require('@/assets/coupon/cash-bg.png')} alt=""/>
                  </div>
                  <div className={styles["btn-primary"]}>
                    <button onClick={this.showQrCode}>立即领取</button>
                  </div>
                  <div className={styles.barcode}>
                    <AcBarcode
                      value="1911110959682"
                      displayValue={false}
                      width={barcodeW}
                      height={barcodeH}
                      margin={0}
                    />
                  </div>
                  <div className={styles.QRcode}>
                    <QRCode value="1911110959682" />
                  </div>
                  <p className={styles.codeNo}>1911110959682</p>
                </div>
                <div className={styles['card-bar-img']}>
                  <img src={require('@/assets/coupon/card-bar-img.png')} alt=""/>
                </div>
                <div className={styles["panel-bottom"]}>
                    <div className={styles['panel-bottom-list']}>
                      <p className={styles['left-title']}>有效期</p>
                      <p className={styles['right-cont']}>2019.06.02-2019.07.31</p>
                    </div>
                    <div className={styles['panel-bottom-list']}>
                      <p className={styles['left-title']}>最低消费金额</p>
                      <p className={styles['right-cont']}>1000元</p>
                    </div>
                    <div className={styles['panel-bottom-list']}>
                      <p className={styles['left-title']}>使用说明</p>
                      <p className={styles['right-cont']}>仅适用于实体店铺购买商品，使用过程 中如果遇到其他问题，请到商场一楼服 务台咨询</p>
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Page>
    )
  }
}

export default CouponDetail
