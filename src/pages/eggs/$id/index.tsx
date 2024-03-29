/**
 * title: 砸金蛋，赢红包
 */
import React, { PureComponent } from "react";
import egg from '@/assets/game/egg-normal.png';
import openEgg from '@/assets/game/egg-prize.png';
import emptyEgg from '@/assets/game/egg-empty.png';
import { Modal } from 'antd-mobile';
import styles from './index.less';
import { GiftModal, ShareModal, GameItemCard, Carousel, Page } from '@/components'
import { ConnectState } from "@/models/connect";
import { EggsModelState, prizeStatus } from "@/utils/types";
import { DateRangeRender, _shareFriendAndCommunity } from '@/utils';
import { connect } from "dva";
import wx from "weixin-js-sdk";
import moment from "moment";
import produce from "immer"
import { codeMessage, eggData } from "@/utils/constant";

const alert = Modal.alert;

interface EggState {
  awards: Array<any>;
  visible: boolean;
  shareStatus: boolean;
  status: boolean;
  shareVisible: boolean;
  img: string;
}


@connect(({ app, eggs, loading }: ConnectState) => ({app, eggs, loading}))
class EGG extends PureComponent<EggsModelState, EggState> {
  timer = null;
  state: EggState = {
    awards: eggData,
    visible: false,
    status: false,
    img: "",
    shareVisible: false,
    shareStatus: true,
  }

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

    wx.ready(() => {
      _self.setState((pre) => ({shareStatus: false}))
      const { eggs, dispatch } = _self.props;
      const { initConfig, activityId } = eggs;
      const { OpenId, CustomerId, ShareImage  } = initConfig;
      if(activityId && OpenId && CustomerId && ShareImage) {
        _shareFriendAndCommunity('eggs','eggs', dispatch, ShareImage, activityId, OpenId, CustomerId, '2', '1');
      }
    });

    wx.error(() => {
      _self.setState((pre) => ({shareStatus: true}))
    });
  }


  openHandle = (status: boolean, img: string) => {
    const { eggs, dispatch } = this.props;
    const { initConfig } = eggs;
    const {  LuckyChanceCount, ...other } = initConfig;
    this.setState((pre) => ({
      status,
      img,
      visible: !pre.visible
    }), () => {
      const newCount = LuckyChanceCount - 1;
      dispatch({
        type: 'eggs/updateCount',
        payload: {
          initConfig: {...other, LuckyChanceCount: newCount}
        }
      })
    })
  }

  onClose = () => {
    this.setState((pre) => ({
      visible: false,
      awards: eggData
    }));
  }

  shareOnClose = () => {
    this.setState({
      shareVisible: false,
    });
  }

  shareHandle = () => {
    const { eggs, dispatch } = this.props;
    const { initConfig, activityId } = eggs;
    const { OpenId, CustomerId, ShareImage  } = initConfig;
    if(!OpenId) {
      alert('分享失败', '活动仅限会员参与，是否注册会员?', [
        { text: '取消', onPress: () => {} },
        { text: '去注册', onPress: () => window.location.href = 'http://ydhtest.fetower.com/WestMember/RegisteMember?fromtype=1' },
      ])
    }else {
      this.setState((pre) => ({
        shareVisible: true
      }), () => {

        _shareFriendAndCommunity('eggs', 'eggs', dispatch, ShareImage, activityId, OpenId, CustomerId, '2', '1');

        // wx.onMenuShareAppMessage({
        //   title: '分享好友', // 分享标题
        //   desc: '抽奖活动分享', // 分享描述
        //   link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=eggs&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=2`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: ShareImage, // 分享图标
        //   success: function () {},
        // })
        //
        // wx.onMenuShareTimeline({
        //   title: '分享朋友圈', // 分享标题
        //   link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=eggs&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=1`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: ShareImage, // 分享图标
        //   success: function () {
        //     dispatch({
        //       type: 'eggs/shareCommunity',
        //       payload: { activityId }
        //     }).then((e: any) => {
        //       if(e.flag){//朋友圈分享成功，更新可用次数
        //         dispatch({
        //           type: 'eggs/getAvailableCount',
        //           payload: { activityId }
        //         })
        //       }
        //     })
        //   }
        // })


      })
    }
  }



  _pickerHandle = (record: any, e: any) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    const { eggs, dispatch } = this.props;
    const { UnUseCount, initConfig, activityId } = eggs;
    const { EndTimeStamp, StartTimeStamp } = initConfig;
    //过期拦截
    if(moment().valueOf() < StartTimeStamp) return;
    if(moment().valueOf() > EndTimeStamp) return;
    //禁止重复点击
    if(record.status !== 0) return;

    if(UnUseCount > 0){

      dispatch({
        type: "eggs/lotteryHandle",
        payload: { activityId }
      }).then((e: prizeStatus) => {
        const { Status, PrizeImage } = e;
        if( Status === 100 ) {
          this._changeEggsStatus(record.id, 1, PrizeImage);
          //更新
          dispatch({type: 'eggs/getAllRecord', payload: { activityId }});
          dispatch({type: 'eggs/getUserRecord', payload: { activityId }});
        } else if( Status === 101 ) {
          this._changeEggsStatus(record.id, 2, PrizeImage);
        }else {
          const errorText = codeMessage[Status] || "抽奖失败";
          alert(errorText, '')
        }
      })
    }else {
      alert('抽奖次数已用完', '');
    }

  }

  _changeEggsStatus = (id: string, status: number, img: string) => {
    const { eggs, dispatch } = this.props;
    const { UnUseCount } = eggs;

    const Index = eggData.findIndex((e) => e.id === id)
    const neweggData = produce(eggData, nextData => {
      nextData[Index].status = status
    });

    this.setState((pre) => ({
      awards: neweggData,
      visible: true,
      status: status === 1,
      img
    }), () => {
      const newCount = UnUseCount - 1;
      dispatch({
        type: 'eggs/updateCount',
        payload: {
          UnUseCount: newCount
        }
      })
    });
  }


  render() {
    const { eggs, loading } = this.props;
    const { initConfig, allRecord, userRecord, UnUseCount } = eggs;
    const { StartTimeStamp, EndTimeStamp } = initConfig;
    const { visible, status, shareVisible, img, shareStatus, awards } = this.state;

    const modalProps = {
      status,
      visible,
      img,
      onClose: this.onClose,
    }

    const shareProps = {
      visible: shareVisible,
      onClose: this.shareOnClose
    }

    return (
      <Page loading={loading.effects['eggs/getInit']} holdText={'加载初始数据中, 请稍后...'}>
        <div className={styles.eggwarp}>
          <div className={styles['bg-warp']}>
            <img src={require("@/assets/game/eggs-bg.png")} className={styles.innerImg} alt=""/>
            <p className={styles.Date}>{ DateRangeRender(StartTimeStamp, EndTimeStamp) }</p>
          </div>
          {/*<Eggs {...eggsProps}/>*/}
          <div>
            <ul className={styles['egg-item-cont']}>
              {
                awards.map((_, i )=> (
                  <li className={styles['egg-list']} key={_.id} data-id={_.id} onClick={e => this._pickerHandle(_, e)}>
                    <div className={styles['eggs-warp']}>
                      <img src={_.status === 0 ? egg : _.status === 1 ? openEgg : emptyEgg} className={styles.egg + ' ' + `${ _.status === 0 ? styles['egg-active'] : ''}`} alt=""/>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className={styles['join-num']}><span>可参与{ UnUseCount }次</span></div>
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
              {/*<button className={styles.btn} onClick={() => this.setState({shareVisible: true})}>去注册</button>*/}
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
          <GiftModal {...modalProps}/>
          <ShareModal {...shareProps}/>

        </div>
      </Page>

    );
  }
}
export default EGG;
