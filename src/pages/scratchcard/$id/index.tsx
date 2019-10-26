/**
 * title: 刮刮乐，刮好礼
 */
import React, { PureComponent } from "react"
import { ScratchCard, GiftModal, GameItemCard, ShareModal, Page } from "@/components"
import { WhiteSpace, Modal } from "antd-mobile"
import { ConnectState } from "@/models/connect"
import { connect } from "dva"
import moment from "moment"
import wx from "weixin-js-sdk";
import { CardModelState } from "@/utils/types"
import { _shareFriendAndCommunity, DateRangeRender } from '@/utils';
import pointImg from "@/assets/scratch-card-bg.png"
import coverImg from "@/assets/scratch-card-cover.png"
import innerImg from "@/assets/scratch-card-inner-bg.png"
import styles from "./index.less"
const alert = Modal.alert


interface PageState {
  status: boolean;
  visible: boolean;
  shareVisible: boolean;
  shareStatus: boolean;
  img: string;
}

@connect(({ app, card, loading }: ConnectState) => ({ app, card, loading}))
class ScratchcardPage extends PureComponent<CardModelState, PageState> {

  state: PageState = {
    status: false,
    visible: false,
    shareVisible: false,
    shareStatus: true,
    img: '',
  };

  componentDidMount() {
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

    wx.ready(function(){

      _self.setState((pre) => ({
        shareStatus: false
      }))
      const { card, dispatch, } = _self.props;
      const { initConfig, activityId } = card;
      const { OpenId, CustomerId, ShareImage } = initConfig;
      if(activityId && OpenId && CustomerId && ShareImage){
        _shareFriendAndCommunity('card','scratchcard', dispatch, ShareImage, activityId, OpenId, CustomerId, '2', '1');
      }

    });

    wx.error((res: any) => {
      _self.setState((pre) => ({
        shareStatus: true
      }))
    });
  }

  onComplete = (status: boolean, img: string) => {
    this.setState((pre) => ({
      status,
      img,
      visible: !pre.visible
    }))
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  shareOnClose = () => {
    this.setState({
      shareVisible: false,
    });
  }

  shareHandle = () => {
    const { card, dispatch, } = this.props;
    const { initConfig, activityId } = card;
    const { OpenId, CustomerId, ShareImage } = initConfig;
    if(!OpenId) {
      alert('分享失败', '活动仅限会员参与，是否注册会员?', [
        { text: '取消', onPress: () => {} },
        { text: '去注册', onPress: () => window.location.href = 'http://ydhtest.fetower.com/WestMember/RegisteMember?fromtype=1' },
      ])
    }else {

      this.setState((pre) => ({
        shareVisible: true
      }), () => {

        _shareFriendAndCommunity('card', 'scratchcard', dispatch, ShareImage, activityId, OpenId, CustomerId, '2', '1');

        // wx.onMenuShareAppMessage({
        //   title: '分享好友', // 分享标题
        //   desc: '抽奖活动分享', // 分享描述
        //   link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=scratchcard&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=2`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: ShareImage, // 分享图标
        //   success: function () {},
        // })
        //
        //
        // wx.onMenuShareTimeline({
        //   title: '分享朋友圈', // 分享标题
        //   link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=scratchcard&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=1`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: ShareImage, // 分享图标
        //   success: function () {
        //     dispatch({
        //       type: 'scratchcard/shareCommunity',
        //       payload: { activityId }
        //     }).then((e: any) => {
        //       if(e.flag){//朋友圈分享成功，更新可用次数
        //         dispatch({
        //           type: 'scratchcard/getAvailableCount',
        //           payload: { activityId }
        //         })
        //       }
        //     })
        //   }
        // })
      })
    }
  }


  render() {
    const { card, loading, dispatch, location } = this.props;
    const { initConfig, allRecord, userRecord, UnUseCount, activityId } = card;
    const { StartTimeStamp, EndTimeStamp  } = initConfig;
    const { visible, status, img, shareStatus, shareVisible } = this.state;
    const canvasWidth = window.innerWidth;
    const canvasWidth1 = window.innerWidth / 100 * 19.2;
    const eraserSize = window.innerWidth / 100 * 5;
    const innerProps = {
      canvasWidth: canvasWidth - canvasWidth1,
      eraserSize,
      coverColor: '#ddd', //纯色涂层
      sampleStep: 1,
      coverImage: coverImg,
      isShowCover: true,
      bgImage: innerImg,
      finishPercent: 8,
      onComplete: this.onComplete,
      dispatch,
      location,
      activityId,
      endDate: EndTimeStamp,
      startDate: StartTimeStamp
    }

    const modalProps = {
      visible,
      img,
      status,
      onClose: this.onClose,
    }

    const shareProps = {
      visible: shareVisible,
      onClose: this.shareOnClose
    }

    return (
      <Page loading={loading.effects['card/getInit']} holdText={'加载初始数据中, 请稍后...'}>
        <div className={styles['games-warp']} id='scratchCard-warp'>
          <div className={styles['bg-warp']}>
            <img src={pointImg} className={styles.bgImg} alt=""/>
            <p className={styles.Date}>{ DateRangeRender(StartTimeStamp, EndTimeStamp) }</p>
          </div>
          <div className={styles['swiper-area']}>
            {
              userRecord.map((e: any, i: number) => (
                <ScratchCard
                  key={i}
                  {...innerProps}
                  isShowCover={false}
                  status={2}
                  PrizeName={e.PrizeName}
                  isEmpty={false}
                />
              ))
            }
            {
              UnUseCount > 0 ? (new Array(UnUseCount)).fill(0).map((e, i) => (
                <ScratchCard
                  key={i}
                  {...innerProps}
                  isShowCover={true}
                  status={0}
                  PrizeName={''}
                  isEmpty={true}
                />
              )) : <p style={{padding: '12px 0', textAlign: 'center', color: '#fff'}}>暂无更多抽奖</p>
            }

            <WhiteSpace />
            <WhiteSpace />
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
              title={"中奖记录"}
              holdText={"暂无中奖记录"}
              background={'rgba(255, 255, 255, 0.1)'}
            >
              {
                allRecord.length !== 0 ? (
                  <ul className={styles['gift-list-flex']}>
                    {
                      allRecord.map((_: any, i: number) => (
                        <li key={i}>
                          <div className={styles['list-flex-name']} style={{WebkitBoxOrient: 'vertical'}}>{_.CustomerName}</div>
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
          </div>
          <GiftModal {...modalProps}/>
          <ShareModal {...shareProps}/>
        </div>
      </Page>

    );
  }
}
export default ScratchcardPage;
