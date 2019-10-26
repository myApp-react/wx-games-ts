/**
 * title: 开礼盒，抽大奖
 */
import React, { PureComponent} from "react";
import {connect} from "dva";
import lottie from 'lottie-web';
import { Carousel, GameItemCard, GiftModal, Page, ShareModal } from '@/components'
import { ConnectState } from "@/models/connect";
import { shakeModelState, prizeStatus } from "@/utils/types";
import { _shareFriendAndCommunity, DateRangeRender, } from '@/utils';
import { codeMessage } from '@/utils/constant'
import moment from 'moment'
import wx from "weixin-js-sdk"
import lottieBOx from '@/assets/shake-main.json'
import styles from './index.less'
import { Modal } from 'antd-mobile'
const alert = Modal.alert

interface ShakeState {
  shareVisible: boolean;
  visible: boolean;
  shareStatus: boolean;
  status: boolean;
  img: string;
}


@connect(({ app, shake, loading }: ConnectState) => ({ app, shake, loading}))
class ShakePage extends PureComponent<shakeModelState, ShakeState> {

  private lottieRef: React.RefObject<any> = React.createRef();
  animation: any = null;

  state: ShakeState = {
    visible: false,
    shareVisible: false,
    shareStatus: true,
    status: false,
    img: ''
  };

  componentDidMount() {
    this.wxConfig();
    lottie.loadAnimation({
      container: this.lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: lottieBOx,
      name: 'lottie1',
    })
  }

  wxConfig = () => {
    const { apiConfig } = this.props.app;
    const { AppId, NonceStr, Timestamp, Signature, } = apiConfig;
    const _self = this;
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: AppId, // 必填，公众号的唯一标识
      timestamp: Timestamp, // 必填，生成签名的时间戳
      nonceStr: NonceStr, // 必填，生成签名的随机串
      signature: Signature,// 必填，签名
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ] // 必填，需要使用的JS接口列表
    });

    wx.ready(() => {
      _self.setState((pre) => ({shareStatus: false}))
      const { shake, dispatch, } = _self.props;
      const { initConfig, activityId } = shake;
      const { OpenId, CustomerId, ShareImage } = initConfig;
      if(activityId && OpenId && CustomerId && ShareImage) {
        _shareFriendAndCommunity('shake','shake', dispatch, ShareImage, activityId, OpenId, CustomerId, '2', '1');
      }

    });

    wx.error(() => {
      _self.setState((pre) => ({shareStatus: true}))
    });
  }


  shareHandle = () => {
    const { shake, dispatch } = this.props;
    const { initConfig, activityId } = shake;
    const { OpenId, CustomerId, ShareImage } = initConfig;
    if(!OpenId) {
      alert('分享失败', '活动仅限会员参与，是否注册会员?', [
        { text: '取消', onPress: () => {}},
        { text: '去注册', onPress: () => window.location.href = 'http://ydhtest.fetower.com/WestMember/RegisteMember?fromtype=1' },
      ])
    }else {
      this.setState((pre) => ({
        shareVisible: true
      }), () => {

        _shareFriendAndCommunity('shake','shake', dispatch, ShareImage, activityId, OpenId, CustomerId, '2', '1');

        // wx.onMenuShareAppMessage({
        //   title: '分享好友', // 分享标题
        //   desc: '抽奖活动分享', // 分享描述
        //   link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=shake&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=2`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: ShareImage, // 分享图标
        //   success: function () {},
        // })
        //
        // wx.onMenuShareTimeline({
        //   title: '分享朋友圈', // 分享标题
        //   link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=shake&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=1`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: ShareImage, // 分享图标
        //   success: function () {
        //     dispatch({
        //       type: 'shake/shareCommunity',
        //       payload: { activityId }
        //     }).then((e: any) => {
        //       if(e.flag){//朋友圈分享成功，更新可用次数
        //         dispatch({
        //           type: 'shake/getAvailableCount',
        //           payload: { activityId }
        //         })
        //       }
        //     })
        //   }
        // })
      })
    }
  }


  componentWillUnmount() {
    lottie.destroy('lottie1')
  }

  onClose = () => {this.setState({ visible: false })}

  getPrizehandle = () => {
    const { dispatch, shake } = this.props;
    const { UnUseCount, initConfig, activityId } = shake;
    const { EndTimeStamp, StartTimeStamp } = initConfig;
    //拦截
    if(moment().valueOf() < StartTimeStamp) return;
    if(moment().valueOf() > EndTimeStamp) return;

    // const match = pathMatchRegexp('/shake/:id', location.pathname)
    //
    // if(!match) return;
    // const activityId = match[1];

    dispatch({
      type: "shake/lotteryHandle",
      payload: { activityId }
    }).then((e: prizeStatus) => {
      const { Status, PrizeImage } = e;
      if( Status === 100 ) {

        dispatch({type: 'shake/getAllRecord', payload: { activityId }});
        dispatch({type: 'shake/getUserRecord', payload: { activityId }});

        this.setState((pre) => ({
          visible: true,
          status: true,
          img: PrizeImage
        }), () => {
          const newCount = UnUseCount - 1;
          dispatch({
            type: 'shake/updateCount',
            payload: {
              UnUseCount: newCount
            }
          })
        })
        //填充文字
      } else if( Status === 101 ){
        this.setState((pre) => ({
          visible: true,
          status: false,
          img: PrizeImage
        }), () => {
          const newCount = UnUseCount - 1;
          dispatch({
            type: 'shake/updateCount',
            payload: {
              UnUseCount: newCount
            }
          })
        })
      }else {
        const errorText = codeMessage[Status] || "抽奖失败";
        alert(errorText, '')
      }
    })
  }

  shareOnClose = () => {this.setState({ shareVisible: false, });}


  render() {
    const { visible, shareStatus, status, img, shareVisible } = this.state;
    const { shake, loading } = this.props;
    const { initConfig, allRecord, userRecord, UnUseCount } = shake;
    const { StartTimeStamp, EndTimeStamp  } = initConfig;
    const shareProps = {
      visible: shareVisible,
      onClose: this.shareOnClose
    }

    const btnStatus = StartTimeStamp > moment().valueOf() ? 1 : moment().valueOf() > EndTimeStamp ? 2 : 0;

    // console.warn("btnStatus", btnStatus)

    return (
      <Page loading={loading.effects['shake/getInit']} holdText={'加载初始数据中, 请稍后...'}>
        <div className={styles['shake-warp']}>
          <div className={styles['top-tips']}>
            <p className={styles.Date}>{ DateRangeRender(StartTimeStamp, EndTimeStamp) }</p>
          </div>
          <div className={styles['bg-main']}  ref={this.lottieRef} />
          <div className={styles.main}>
            <div className={styles['submit-btn']}>
              {
                btnStatus === 0 ? <button className={styles['btn-primary'] + ' ' + styles['btn-primary-wave']} onClick={this.getPrizehandle}>
                  <img className={styles.innerImg} src={require("@/assets/shake-btn.png")} alt=""/>
                </button> : btnStatus === 2 ? <button className={styles['btn-primary']} onClick={this.getPrizehandle}>
                  <img className={styles.innerImg} src={require("@/assets/shake-btn-end.png")} alt=""/>
                </button> : <button className={styles['btn-primary']} onClick={this.getPrizehandle}>
                  <img className={styles.innerImg} src={require("@/assets/shake-btn-nostart.png")} alt=""/>
                </button>
              }
            </div>
            <div className={styles['join-num']}><span>可参与{UnUseCount}次</span></div>
            <Carousel
              title={'中奖记录'}
            >
              {
                allRecord.length !== 0 ? allRecord.map((_: any, i: number) => (
                  <div key={_.RecordId} className={styles['carousel-item']} style={{WebkitBoxOrient: 'vertical'}}>{`${_.CustomerName}抽中${_.PrizeName}`}</div>
                )) : null
              }
            </Carousel>
            <GameItemCard
              title={"获取抽奖次数"}
              holdText={"暂无活动"}
              background={'rgba(255, 255, 255, 0.1)'}
            >
              <ul className={styles['getcount-warp']}>
                {/*<li>*/}
                {/*<p>1.注册会员可以直接获得1次抽奖机会</p>*/}
                {/*<div className={styles['flex-btn']}>*/}
                {/*<button className={styles.btn}>去注册</button>*/}
                {/*</div>*/}
                {/*</li>*/}
                <li>
                  <p>1.每日首次分享到朋友圈可获得1次抽奖机会</p>
                  <div className={styles['flex-btn']}>
                    <button className={styles.btn} disabled={shareStatus} onClick={this.shareHandle}>去分享</button>
                  </div>
                </li>
              </ul>
            </GameItemCard>
            <GameItemCard
              title={"我的奖品"}
              holdText={"暂无中奖记录"}
              background={'rgba(255, 255, 255, 0.1)'}
            >
              {
                userRecord.length !== 0 ? (
                  <ul className={styles['gift-list-flex']}>
                    {
                      userRecord.map((_: any, i: number) => (
                        <li key={_.RecordId}>
                          <div>{moment(_.ShowCeateTime).format("YYYY-MM-DD HH:mm")}</div>
                          <div className={styles['list-flex-text']}>{_.PrizeName}</div>
                        </li>
                      ))
                    }
                  </ul>
                ) : null
              }
            </GameItemCard>
            <GameItemCard
              title={"活动规则"}
              holdText={"暂无活动规则"}
              background={'rgba(255, 255, 255, 0.1)'}
            >
              <p>1，注册会员可以直接获得3次抽奖机会</p>
              <p>2，注册会员可以直接获得3次抽奖机会</p>
            </GameItemCard>
            <GiftModal visible={visible} status={status} img={img} onClose={this.onClose} />
            <ShareModal {...shareProps}/>
          </div>
        </div>
      </Page>

    );
  }
}
export default ShakePage;
