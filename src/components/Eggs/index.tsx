import React, { PureComponent } from "react";
import styles from "./index.less";
import { Modal } from "antd-mobile";
import { windowToCanvas, roundedRect, easeInOut } from "@/utils/canvasFun";
import { codeMessage } from "@/utils/constant"
import { EggsProps } from "@/utils/types"
const alert = Modal.alert;
const devicePixelRatio: number = window.devicePixelRatio || 1;

export default class EggsComponent extends PureComponent<EggsProps, {}> {

  private canvasRef: React.RefObject<any> = React.createRef();
  private AWARDS_ROW_LENGTH: number =  3;
  private _positions: Array<any>= [];
  private OPENDATA: Array<any> = [];
  private initTime: number = 0;
  private AWARDS_LEN: number = 0;
  private EGGS_ITEM_MARGIN: number = 0;
  private EGGS_ITEM_SIZE: number = 0;

  public static defaultProps = {
    eraserSize: 15,
    eggsItemRadius: 0,
    coverColor: '#b5b5b5',
  };

  componentDidMount() {
    const { awards, canvasWidth } = this.props;
    this.AWARDS_LEN =  awards.length;
    this.EGGS_ITEM_MARGIN = Math.round(canvasWidth / this.AWARDS_ROW_LENGTH / 4 * devicePixelRatio);
    this.EGGS_ITEM_SIZE = (canvasWidth / this.AWARDS_ROW_LENGTH - this.EGGS_ITEM_MARGIN / devicePixelRatio) * devicePixelRatio;
    this.draw();
  }

  /**
   * 绘制
   * @param {Obj} context
   */
  drawCover = (context: any) => {
    const { eggsItemRadius, eggsImg, baseImg } = this.props;
    context.save();
    context.clearRect(0, 0, context.canvas.width * devicePixelRatio, context.canvas.height * devicePixelRatio);
    const itemMargin = 16 * devicePixelRatio;

    for (let i = 0; i < this.AWARDS_LEN; i++) {
      if (i >= 0 && i < this.AWARDS_ROW_LENGTH) {
        let row = i,
              x = row * this.EGGS_ITEM_SIZE + row * this.EGGS_ITEM_MARGIN + itemMargin,
              y = 20 * devicePixelRatio;
        this._positions.push({x, y});
        this.drawEggsItem(
          context,
          x,
          y,
          this.EGGS_ITEM_SIZE,
          eggsItemRadius,
          eggsImg,
          baseImg,
        )

      }else if(i >= this.AWARDS_ROW_LENGTH && i < this.AWARDS_ROW_LENGTH + 3) {
        let row = Math.abs(this.AWARDS_ROW_LENGTH * 2 - (i+1)),
          x = row * this.EGGS_ITEM_SIZE + row * this.EGGS_ITEM_MARGIN + itemMargin,
          y = 150 * devicePixelRatio;
        this._positions.push({x, y});
        this.drawEggsItem(
          context,
          x, y,
          this.EGGS_ITEM_SIZE,
          eggsItemRadius,
          eggsImg,
          baseImg,
        )
      } else if(i >= 5 && i < 10) {
        let row = Math.abs(this.AWARDS_ROW_LENGTH * 2 - i),
          x = row * this.EGGS_ITEM_SIZE + row * this.EGGS_ITEM_MARGIN + itemMargin,
          y = 270 * devicePixelRatio;
        this._positions.push({x, y});
        this.drawEggsItem(
          context,
          x, y,
          this.EGGS_ITEM_SIZE,
          eggsItemRadius,
          eggsImg,
          baseImg,
        )
      }
    }
  };

  drawEggsItem = (context: any, x: number, y: number, size: number, radius: number, egg: string, base: string) => {
    context.save();
    context.beginPath();
    roundedRect(
      context,
      x, y,
      size, size,
      radius
    );
    context.restore();

    if (egg) {
      this.drawEggImage(egg, context, x + (size * .2 / 4.2), y - 6 * devicePixelRatio, size * .9, size * 1.1)
    }
  }

  translate = (context: any) => {
    // context.clearRect(x, y, this.EGGS_ITEM_SIZE, this.EGGS_ITEM_SIZE + 10 * devicePixelRatio)
    this.initTime += 30;
    if(this.initTime >= 900) return;
    const tetssd = easeInOut(this.initTime, 0, 900, 8000);
    console.log(tetssd)

    context.context.clearRect(context.x, context.y, this.EGGS_ITEM_SIZE, this.EGGS_ITEM_SIZE + 10 * devicePixelRatio);
    context.context.fill();
    context.context.restore();
    window.requestAnimationFrame(this.translate.bind(this, context));
  }

  drawEggImage = (imageUrl: string, context: any, x: number, y: number, imageW: number, imageH: Number ) => {
    // var width = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
    // console.warn("width=", width)
    let image = new Image();
    image.src = imageUrl;

    const drawImage = () => {
      context.drawImage(
        image,
        x,
        y,
        imageW,
        imageH
      );

    };
    if (!image.complete) image.onload = (e) => {drawImage();};
    else drawImage();
  }

  draw = () => {
    const canvas = this.canvasRef.current;
    if (!canvas.getContext) {
      return;
    }
    const context = canvas.getContext('2d');
    const _self = this;
    this.drawCover(context);
    const { eggsItemRadius, eggsOpen, openHandle, emptyEgg, dispatch, activityId } = this.props;

    ['touchstart', 'mousedown'].forEach((event) => {
      canvas.addEventListener(event, (e: any) => {
        let loc = windowToCanvas(canvas, e);
        this._positions.forEach(_ => {
          context.beginPath();
          roundedRect(
            context,
            _.x, _.y,
            this.EGGS_ITEM_SIZE, this.EGGS_ITEM_SIZE,
            eggsItemRadius
          );

          if (loc && context.isPointInPath(loc.x * devicePixelRatio, loc.y * devicePixelRatio)) {
            if(this.props.LuckyChanceCount === 0){
              alert("抽奖失败", "抽奖次数已用完");
              return
            }

            /*是否重复点击同一个**/
            if(this.OPENDATA.includes(_)) return;
            this.OPENDATA.push(_);

            //ajax
            dispatch({
              type: "eggs/lotteryHandle",
              payload: { activityId }
            }).then((e: any) => {
              const { Status, PrizeImage } = e;
              context.clearRect(_.x, _.y, this.EGGS_ITEM_SIZE, this.EGGS_ITEM_SIZE + 10 * devicePixelRatio);
              // if (baseImg) {
              //   this.drawEggImage(baseImg, context,  _.x, _.y + (_self.EGGS_ITEM_SIZE / 2 + 26 * devicePixelRatio), _self.EGGS_ITEM_SIZE, _self.EGGS_ITEM_SIZE * .26)
              // }

              if( Status === 100 ) {
                // this.drawCover(context);
                openHandle(true, PrizeImage);
                if (eggsOpen) {
                  this.drawEggImage(eggsOpen, context, _.x + (_self.EGGS_ITEM_SIZE * .2 / 4.2), _.y - 6 * devicePixelRatio, _self.EGGS_ITEM_SIZE * .9, _self.EGGS_ITEM_SIZE * 1.1)
                }
                //更新
                dispatch({type: 'eggs/getAllRecord', payload: activityId});
                dispatch({type: 'eggs/getUserRecord', payload: activityId});
              } else if( Status === 101 ) {
                openHandle(false, PrizeImage);
                if (emptyEgg) {
                  this.drawEggImage(emptyEgg, context, _.x + (_self.EGGS_ITEM_SIZE * .2 / 4.2), _.y - 6 * devicePixelRatio, _self.EGGS_ITEM_SIZE * .9, _self.EGGS_ITEM_SIZE * 1.1)
                }
              }else {
                const errorText = codeMessage[Status] || "抽奖失败";
                alert("", errorText)
              }
              context.restore();
            })
          }
        })
      }, false)
    });
  }

  render() {
    const { canvasWidth, canvasHeight } = this.props;
    return (
      <div className={styles.turnplate}>
        <canvas
          ref={this.canvasRef}
          width={canvasWidth * devicePixelRatio}
          height={canvasHeight * devicePixelRatio}
          style={{width: canvasWidth, height: canvasHeight}}
        >
          Sorry,Explorer not support.
        </canvas>
      </div>

    );
  }
}
