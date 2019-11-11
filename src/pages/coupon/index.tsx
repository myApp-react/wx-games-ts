
import React, { PureComponent } from 'react'
import Link from 'umi/link';
import styles from './index.less'
import { Page } from '@/components'
import { Icon } from 'antd-mobile'
import classNames from "classNames";
import giftCash from '@/assets/coupon/gift-cash.png'
import giftCashAfter from '@/assets/coupon/gift-cash-after.png'

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
    const activeid = e.target.getAttribute("data-id")
    this.setState((pre) => ({
      activeid
    }))
  }


  render() {
    const { activeid } = this.state;

    return (
      <Page loading={false} holdText={'正在加载优惠券'}>
          <div className={styles.coupon}>
            <ul className={styles["title-warp"]}>
              <li>
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
                    <Link to="coupon/123123123">
                      <div className={styles['list-item']}>
                        <div className={styles["list-item-img"]}><img src={giftCash} alt=""/></div>
                        <div className={styles["list-item-label"]}>
                          <p className={styles["item-label-title"]}>现金券满100减20</p>
                          <p className={styles["item-label-des"]}>￥20</p>
                        </div>
                        <div className={styles["list-item-tips"]}>即将过期</div>
                      </div>
                    </Link>
                    <Link to="coupon/1231aasd23123">
                      <div className={styles['list-item']}>
                        <div className={styles["list-item-img"]}><img src={giftCash} alt=""/></div>
                        <div className={styles["list-item-label"]}>
                          <p className={styles["item-label-title"]}>现金券满100减20</p>
                          <p className={styles["item-label-des"]}>￥20</p>
                        </div>
                        <div className={styles["list-item-tips"]}>即将过期</div>
                      </div>
                    </Link>
                    <Link to="coupon/12312312323">
                      <div className={styles['list-item']}>
                        <div className={styles["list-item-img"]}><img src={giftCash} alt=""/></div>
                        <div className={styles["list-item-label"]}>
                          <p className={styles["item-label-title"]}>现金券满100减20</p>
                          <p className={styles["item-label-des"]}>￥20</p>
                        </div>
                        <div className={styles["list-item-tips"]}>即将过期</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles["title-main"]} data-id="2" onClick={this.onChange}>
                  <img className={styles["left-img"]} src={require("@/assets/coupon/coupon-used.png")} alt=""/>
                  <h3 className={styles["title-text"]}>已使用（12）</h3>
                  <Icon className={classNames(styles["right-point"], {
                    [styles["to-bottom"]]: activeid === '2'
                  })} type="right" size='md' />
                </div>
                <div className={classNames(styles["coupon-list"], {
                  [styles["coupon-hide"]]: activeid === '2',
                  [styles.expired]: true
                })}>
                  <div className={styles['coupon-list-cont']}>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已使用</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已使用</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已使用</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已使用</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已使用</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已使用</div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
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
                  [styles["coupon-hide"]]: activeid === '3',
                  [styles.expired]: true
                })}>
                  <div className={styles['coupon-list-cont']}>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
                    </div>
                    <div className={styles['list-item']}>
                      <div className={styles["list-item-img"]}><img src={giftCashAfter} alt=""/></div>
                      <div className={styles["list-item-label"]}>
                        <p className={styles["item-label-title"]}>现金券满100减20</p>
                        <p className={styles["item-label-des"]}>￥20</p>
                      </div>
                      <div className={styles["list-item-tips"]}>已过期</div>
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
