import React, { PureComponent } from "react"
import { windowToCanvas } from "@/utils/canvasFun"
import { CardProps, prizeStatus } from "@/utils/types"
import { codeMessage } from "@/utils/constant"
import styles from "./index.less"
import { throttle } from "lodash"
import { DrawText } from "@/components"
import { Modal } from "antd-mobile"
import moment from 'moment'

const alert = Modal.alert

interface CardSate {
  canvasHeight: number,
  currentStatus: number,
  currentPrize: string,
  currentName: string,
  hasError: boolean
  fetchStatus: boolean
  swiperStatus: boolean
}

export default class ScratchCard extends PureComponent<CardProps, CardSate> {

  private canvasRef: React.RefObject<any> = React.createRef();
  private canvasWarpRef: React.RefObject<any> = React.createRef();
  private _dragging: boolean = false;
  //private devicePixelRatio: number = window.devicePixelRatio || 1;
  private isEnd: boolean = false;

  state: CardSate = {
    canvasHeight: 90,
    currentStatus: 0,
    currentPrize: '',
    currentName: '',
    hasError: false,
    fetchStatus: false,
    swiperStatus: false,
  }

  static defaultProps = {
    eraserSize: 30,
    sampleStep: 1, //数字越大精度越小
    coverColor: '#b5b5b5',
  };

  componentDidMount() {
    if(this.canvasWarpRef){
      const canvasHeight = this.canvasWarpRef.current.clientHeight - 40;
      this.setState((pre) => ({
        canvasHeight
      }), () => {
        this.draw();
      })
    }
  }

  /**
   * 绘制刮涂层
   * @param {Obj} context
   */
  drawCover = (context: any) => {
    const { coverColor, coverImage } = this.props;
    if(coverImage) {
      let image = new Image();
      image.crossOrigin = ''; //解决跨域问题
      image.src = coverImage;

      function drawPointImage(context: any) {
        context.save();
        context.drawImage(
          image, -1, -1,
          context.canvas.width + 2, context.canvas.height + 1
        );
        context.restore();
      }

      if (!image.complete) {
        image.onload = function (e) {
          drawPointImage(context);
        }
      } else {
        drawPointImage(context);
      }
      return
    }
    context.save();
    context.fillStyle = coverColor;
    context.beginPath();
    context.rect(0, 0, context.canvas.width, context.canvas.height);
    context.fill();
    context.restore();

  };

  getInfo = throttle(() => {
      const { dispatch, activityId } = this.props
      const _self = this;
      // this.isEnd = true;
      dispatch({
        type: "card/lotteryHandle",
        payload: {
          activityId
        }
      }).then((e: prizeStatus) => {
          const { Status, PrizeImage, PrizeName } = e;
          switch (Status){
            case 100:
              // this.isEnd = false;
              _self.setState((pre) => ({
                currentStatus: 2,
                currentPrize: PrizeImage,
                currentName: PrizeName,
                fetchStatus: true
              }), () => {
                dispatch({type: 'card/getAllRecord', payload: { activityId }});
              })
              break;
            case 101:
              // this.isEnd = false;
              _self.setState((pre) => ({
                currentStatus: 1,
                currentPrize: PrizeImage,
                currentName: PrizeName,
                fetchStatus: true
              }))
              break;
            default:
              const errorText = codeMessage[Status] || "抽奖失败";
              alert("", errorText)
              _self.setState((pre) => ({
                hasError: true
              }))
          }
      })
    },
    100000,
    { 'trailing': false }
    )

  /**
   * 绘制橡皮擦
   * @param {Obj} context
   * @param {Obj} loc
   */
  drawEraser = (context: any, loc: any) => {
    this.getInfo()
    const { eraserSize } = this.props;
    context.save();
    context.beginPath();
    context.arc(loc.x, loc.y, eraserSize, 0, Math.PI * 2, false);
    context.clip();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.restore();
  };





  getAreaHandle = (context: any) => {
    const { finishPercent, sampleStep } = this.props;
    const step = sampleStep;
    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data;
    const total = imageData.length / step;
    let count = 0;
    for (let i = 0; i < imageData.length; i += step) {
      if (parseInt(imageData[i], 10) === 0) {
        count++;
      }
    }
    const pencent = Math.round((count / total) * 100);
    if(pencent > finishPercent) {
      //清空
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.restore();
      if(this.state.hasError) return;//如果报错，不能反馈抽奖结果信息
      this.setState((pre) => ({
        swiperStatus: true
      }))
      // onComplete(currentStatus, currentPrize)
    }
  }


  draw = () => {
    const canvas = this.canvasRef.current;
    if (!canvas.getContext) {
      return;
    }
    const context = canvas.getContext('2d');
    //拦截
    if(!this.props.isShowCover) return;

    this.drawCover(context);
    //未到活动时间阻止
    if(moment().valueOf() < this.props.startDate) return;
    if(moment().valueOf() > this.props.endDate) return;

    // 设置画的线的宽度
    context.lineWidth = 35;
    // 设置线交汇时，是圆角的
    context.lineJoin = "round";

    ['touchstart', 'mousedown'].forEach((event) => {
      canvas.addEventListener(event, (e: any) => {
        let loc = windowToCanvas(canvas, e);
        this._dragging = true;
        this.drawEraser(context, loc);
      })
    });

    ['touchmove', 'mousemove'].forEach((event) => {
      canvas.addEventListener(event, (e: any) => {
        let loc;
        if (this._dragging) {
          loc = windowToCanvas(canvas, e);
          this.drawEraser(context, loc);
        }
      })
    });

    //停止刮卡
    ['touchend', 'mouseup'].forEach((event) => {
      canvas.addEventListener(event, () => {
        this._dragging = false;
        if(!this.isEnd){
          this.getAreaHandle(context);
        }
      })
    });
  }

  componentDidUpdate(props: any, state: any) {
    console.warn("监控测试", this.state)
    if(this.state.fetchStatus && this.state.swiperStatus ){
      this.props.onComplete(this.state.currentStatus, this.state.currentPrize)
    }
  }


  render() {
    const { canvasWidth, bgImage, status, PrizeName, isEmpty } = this.props;
    const { currentStatus, currentName } = this.state;
    const prizeStatus = {
      2: `抽中了${PrizeName}`,
      1: '你没有中奖',
      0: ''
    };

    const currentPrizeStatus = {
      2: `抽中了${currentName}`,
      1: '你没有中奖',
      0: ''
    };

    const canvasHeight = window.innerWidth / 100 * 24;

    return (
      <div className={styles.scratchcard}>
        <div className={styles.inner} ref={this.canvasWarpRef}>
          <img className={styles['out-bg']} src={require("@/assets/scratch-card-out-bg.png")} alt=""/>
        </div>
        <div className={styles['canvas-warp']}>
          <div className={styles['canvas-group']}>
            <canvas ref={this.canvasRef} width={canvasWidth} height={canvasHeight} >Sorry,Explorer not support.</canvas>
            <div className={styles['inner-border-hold']}>
              <div className={styles['result-warp-in']} style={{background: `url("${bgImage}") no-repeat`, backgroundSize: 'cover'}}>
                <div>
                  {
                    isEmpty ? <>
                      <h3 className={styles['result-title']}>{currentStatus === 2 ? '恭喜您！' : currentStatus === 1 ? '很遗憾' : ''}</h3>
                      <DrawText
                        text={currentPrizeStatus[currentStatus]}
                        fontSize={16}
                        color={"#fff"}
                      />
                    </> : <>
                      <h3 className={styles['result-title']}>{status === 2 ? '恭喜您！' : status === 1 ? '很遗憾' : ''}</h3>
                      <DrawText
                        text={prizeStatus[status]}
                        fontSize={16}
                        color={"#fff"}
                      />
                    </>
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
