import React, { PureComponent } from 'react'
import styles from './index.less'
import { Page } from '@/components'
import { Icon } from 'antd-mobile'
import classNames from "classNames";


interface CouponState {
  activeid: string
  couponData: Array<any>
}


export default class CouponList extends PureComponent<{}, CouponState> {

  state: CouponState = {
    activeid: "1",
    couponData: [
      {
        id: '1',
        preIcon: require("@/assets/coupon/coupon-before.png"),
        title: '未使用',
        count: 2
      },
      {
        id: '2',
        preIcon: require("@/assets/coupon/coupon-used.png"),
        title: '已使用',
        count: 2
      },
      {
        id: '3',
        preIcon: require("@/assets/coupon/coupon-after.png"),
        title: '已过期',
        count: 2
      },
    ]
  }

  componentDidMount() {

  }

  onChange = (e: any) => {
    console.log(e)
    const activeid = e.target.getAttribute("data-id")
    this.setState((pre) => ({
      activeid
    }))
  }


  render() {
    const { activeid } = this.state;
    const beforeD = [1,2,3,4,5];
    const beforeHeight = activeid === '1' ? `${1 * 26.13333 + 16}vw` : '16vw'
    const usedHeight = activeid === '2' ? `${1 * 26.13333 + 16}vw` : '16vw'
    const afterHeight = activeid === '3' ? `${2 * 26.13333 + 16}vw` : '16vw'

    return (
      <Page loading={false} holdText={'正在加载优惠券'}>
          <div className={styles.coupon}>
            <ul className={styles["title-warp"]}>
              <li style={{height: beforeHeight}}>
                <div
                  className={styles["title-main"]}
                  data-id="1"
                  onClick={this.onChange}
                >
                  <img className={styles["left-img"]} src={require("@/assets/coupon/coupon-before.png")} alt=""/>
                  <h3 className={styles["title-text"]}>未使用（12）</h3>
                  <Icon className={classNames(styles["right-point"], {
                    [styles["to-bottom"]]: activeid === '1'
                  })} type="right" size='md' />
                </div>
                <div className={classNames(styles["coupon-list"], {
                  [styles["coupon-hide"]]: activeid === '1'
                })}>
                  <div className={styles['coupon-list-cont']}>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src="" alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>即将过期</div>
                    </div>
                  </div>
                </div>
              </li>
              <li style={{height: usedHeight}}>
                <div className={styles["title-main"]} data-id="2" onClick={this.onChange}>
                  <img className={styles["left-img"]} src={require("@/assets/coupon/coupon-used.png")} alt=""/>
                  <h3 className={styles["title-text"]}>已使用（12）</h3>
                  <Icon className={classNames(styles["right-point"], {
                    [styles["to-bottom"]]: activeid === '2'
                  })} type="right" size='md' />
                </div>
                <div className={classNames(styles["coupon-list"], {
                  [styles["coupon-hide"]]: activeid === '2'
                })}>
                  <div className={styles['coupon-list-cont']}>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src="" alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>即将过期</div>
                    </div>
                  </div>
                </div>
              </li>
              <li style={{height: afterHeight}}>
                <div
                  className={styles["title-main"]}
                  data-id="3"
                  onClick={this.onChange}
                >
                  <img className={styles["left-img"]} src={require("@/assets/coupon/coupon-after.png")} alt=""/>
                  <h3 className={styles["title-text"]}>已过期（12）</h3>
                  <Icon className={classNames(styles["right-point"], {
                    [styles["to-bottom"]]: activeid === '3'
                  })} type="right" size='md' />
                </div>
                <div className={classNames(styles["coupon-list"], {
                  [styles["coupon-hide"]]: activeid === '3'
                })}>
                  <div className={styles['coupon-list-cont']}>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src="" alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>即将过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src="" alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>即将过期</div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
      </Page>
    )
  }

}
