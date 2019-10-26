import React, { PureComponent } from "react"
import { windowToCanvas, drawText, easeInOut } from "@/utils/canvasFun"
import { TurnplateProps } from "@/utils/types"
import styles from './index.less'


/**
 * public是公共接口 private是私有的
 * */
export default class TurnplatePage extends PureComponent<TurnplateProps, {}> {


  private canvasRef: React.RefObject<any> = React.createRef();
  private _spinTotalTime: number = 0; // 旋转时间总长
  //private _spinningChange: number = 0; // 旋转变化值的峰值
  private _canvasStyle: any = "";
  private _isAnimate: boolean = false;
  private _spinningTime: number = 0; // 旋转当前时间
  private startRadian: number = 0; // 绘制奖项的起始角，改变该值实现旋转效果
  private devicePixelRatio: number = window.devicePixelRatio || 1;
  private currentRadian: number = 0;

  static defaultProps = {
    evenColor: '#FF6766',
    // evenColor: '#fff',
    oddColor: '#FD5757',
    // oddColor: '#FBCC96',
    loseColor: '#F79494',
    textColor: 'White',
    arrowColorFrom: '#FFFC95',
    arrowColorTo: '#FF9D37',
    buttonFont: '开始抽奖',
    buttonFontColor: '#88411F',
    buttonColorFrom: '#FDC964',
    buttonColorTo: '#FFCB65',
    startRadian: 0,
    duration: 4000, // 旋转事件
    velocity: 20, // 旋转速率
  };

  componentDidMount() {
    const { activeId, awards } = this.props;
    const awardsLen = awards.length;
    const activeIndex = awards.findIndex(_ => _.id === activeId);
    const singleRadian = 360 / awards.length;

    let newAwards = [];
    for(let i = 0; i < awardsLen; ++i){
      newAwards.push({
        radian: singleRadian * (1 + i) - singleRadian / 2
      })
    }
    const centerRadian = 270 - newAwards[activeIndex].radian;
    this.currentRadian = 5 * 360 + centerRadian;

    this.draw();
  }

  componentDidUpdate(props: {}, state: {}){
    console.log(props)
    // this.drawRouletteWheel();
  }

  /**
   * 绘制转盘
   * @param {Obj} context
   */
  drawRouletteWheel = (context: any) => {
    const {
      awards,
      oddColor,
      centerX,
      centerY,
      outsideRadius,
      loseColor,
      evenColor,
      textColor,
      arrowColorFrom,
      arrowColorTo,
      buttonColorFrom,
      buttonColorTo,
      buttonFontColor,
      buttonFont,
      pointImg
    } = this.props;

    context.clearRect(0, 0, context.canvas.width * this.devicePixelRatio, context.canvas.height * this.devicePixelRatio); //清空一个区域：

    // ---------- 绘制外表盘
    context.save();
    const rgb = oddColor.replace('#', ''),
      r = parseInt(rgb[0] + rgb[1], 16),
      g = parseInt(rgb[2] + rgb[3], 16),
      b = parseInt(rgb[4] + rgb[5], 16);

    context.fillStyle = `rgba(${r}, ${g}, ${b}, .72)`;
    context.shadowColor = 'rgba(0, 0, 0, .24)';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 6;
    context.shadowBlur = 16; //outsideRadius
    context.arc(centerX, centerY, outsideRadius, 0, Math.PI * 2);
    context.fill();
    context.restore();
    // ----------

    const AWARDS_COUNT = awards.length || 5;
    const AWARD_RADIAN = (Math.PI * 2) / AWARDS_COUNT; //每个扇形的角度度数
    // console.log("每个扇形的角度度数", AWARD_RADIAN)
    const INSIDE_RADIUS = 0;
    const FONT_STYLE = `bold ${outsideRadius * .07}px Helvetica, Arial`;
    const TEXT_RADIAS = outsideRadius * .8;
    const ARROW_RADIUS = outsideRadius / 3.6;
    const BUTTON_RADIUS = ARROW_RADIUS * .8;

    // --------- 绘制表盘中的色块，和对应的文字与图片
    for (let i = 0; i < AWARDS_COUNT; i++) {
      // 绘制色块
      context.save();
      if (awards[i].type === 'losing') context.fillStyle = loseColor;
      else if (i % 2 === 0) context.fillStyle = evenColor
      else context.fillStyle = oddColor;


      let _startRadian = this.startRadian + AWARD_RADIAN * i,
        _endRadian =   _startRadian + AWARD_RADIAN;

      context.beginPath();
      context.arc(centerX, centerY, outsideRadius - 5*this.devicePixelRatio, _startRadian, _endRadian, false);
      context.arc(centerX, centerY, INSIDE_RADIUS, _endRadian, _startRadian, true);
      context.fill();
      context.restore();

      // 绘制图片
      if (awards[i].type === 'image') {
        let image = new Image();
            image.src = awards[i].content;

        function drawImage(context: any) {
          let size = Math.sin(AWARD_RADIAN) * outsideRadius / 2.5;
          context.save();
          context.translate(
            centerX + Math.cos(_startRadian + AWARD_RADIAN / 2) * TEXT_RADIAS,
            centerY + Math.sin(_startRadian + AWARD_RADIAN / 2) * TEXT_RADIAS
          )
          context.rotate(_startRadian + AWARD_RADIAN / 2 + Math.PI / 2);
          context.drawImage(
            image,
            - size / 2, 0,
            size, size
          );
          context.restore();
        }

        // 如果图片未加载，则加载
        // 如果图片已经加载完成，则直接使用
        if (!image.complete) {
          image.onload = function () {
            drawImage(context);
          }
        } else {
          drawImage(context);
        }

      }
      // 绘制文字
      else if (awards[i].type === 'text' || awards[i].type === 'losing') {
        let award = awards[i].content;
        context.save();
        context.fillStyle = textColor;
        context.font = FONT_STYLE;
        context.translate(
          centerX + Math.cos(_startRadian + AWARD_RADIAN / 2) * TEXT_RADIAS,
          centerY + Math.sin(_startRadian + AWARD_RADIAN / 2) * TEXT_RADIAS
        );
        context.rotate(_startRadian + AWARD_RADIAN / 2 + Math.PI / 2);
        context.fillText(award, - context.measureText(award).width / 2, 0);
        context.restore();
      }
    }
    // ----------

    // ---------- 绘制按钮指针

    if(pointImg){
      let image = new Image();
      image.src = pointImg;

      function drawPointImage(context: any) {
        const swidth = 100 * (window.devicePixelRatio || 1);
        const sheight = 133 * (window.devicePixelRatio || 1);

        context.save();
        context.translate(
          centerX,
          centerY - (sheight / 2)
        )
        // context.rotate(_startRadian + AWARD_RADIAN / 2 + Math.PI / 2);
        context.drawImage(
          image, - swidth / 2, 0,
          swidth, sheight
        );
        context.restore();
      }

      // 如果图片未加载，则加载
      // 如果图片已经加载完成，则直接使用
      if (!image.complete) {
        image.onload = function () {
          drawPointImage(context);
        }
      } else {
        drawPointImage(context);
      }
    }else {
      let moveX = centerX,
          moveY = centerY - ARROW_RADIUS + 5;

      context.save();
      context.fillStyle = arrowColorFrom;
      context.beginPath();
      context.moveTo(moveX, moveY);
      context.lineTo(moveX - 10*this.devicePixelRatio, moveY);
      context.lineTo(moveX, moveY - 20*this.devicePixelRatio);
      context.closePath();
      context.fill();
      context.restore();

      context.save();
      context.fillStyle = arrowColorTo;
      context.beginPath();
      context.moveTo(moveX, moveY);
      context.lineTo(moveX + 10*this.devicePixelRatio, moveY);
      context.lineTo(moveX, moveY - 20*this.devicePixelRatio);
      context.closePath();
      context.fill();
      context.restore();
      // ----------

      // ---------- 绘制按钮圆盘
      let gradient_1 = context.createLinearGradient(
        centerX - ARROW_RADIUS, centerY - ARROW_RADIUS,
        centerX - ARROW_RADIUS, centerY + ARROW_RADIUS
      );
      context.save();
      gradient_1.addColorStop(0, arrowColorFrom);
      gradient_1.addColorStop(1, arrowColorTo);
      context.fillStyle = gradient_1;

      context.shadowColor = 'rgba(0, 0, 0, .12)';
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 5;
      context.shadowBlur = 15;

      context.beginPath();
      context.arc(centerX, centerY, ARROW_RADIUS, 0, Math.PI * 2, false);
      context.fill();
      context.restore();
      // ----------

      // ---------- 绘制按钮
      let gradient_2 = context.createLinearGradient(
        centerX - BUTTON_RADIUS, centerY - BUTTON_RADIUS,
        centerX - BUTTON_RADIUS, centerY + BUTTON_RADIUS
      );
      context.save();
      gradient_2.addColorStop(0, buttonColorFrom);
      gradient_2.addColorStop(1, buttonColorTo);
      context.fillStyle = gradient_2;
      context.beginPath();
      context.arc(centerX, centerY, BUTTON_RADIUS, 0, Math.PI * 2, false);
      context.fill();
      context.restore();
      // ----------

      // ---------- 绘制按钮文字
      context.save();
      context.fillStyle = buttonFontColor;
      context.font = `bold ${BUTTON_RADIUS / 2}px helvetica`;
      drawText(
        context,
        buttonFont,
        centerX - BUTTON_RADIUS / 2, centerY - BUTTON_RADIUS / 2 - 4,
        BUTTON_RADIUS * .8,
        BUTTON_RADIUS / 2 + 4
      );
      context.restore();
      //----------
    }
  };

  resetRotateWheel = (context: any) => {
    if(context){
      this.startRadian = 0;
      this.drawRouletteWheel(context);
    }
  }

  /**
   * 开始旋转
   * @param {Obj} context
   */
  public rotateWheel = (context: any) => {
    const { finish } = this.props;
    this._spinningTime += 20;
    if (this._spinningTime >= this._spinTotalTime ) {
      this._isAnimate = false;
      if (finish) {
        finish(this.getValue(), () => this.resetRotateWheel(context));
      }
      return;
    }

    // let newSpinningChange = (this._spinningChange - (easeInOut(this._spinningTime, 0, this._spinningChange, this._spinTotalTime)))
    //   * (Math.PI / 180);

    // this.startRadian += newSpinningChange;

    // const awardsLen = awards.length;
    // const currentRadian = 360 / awardsLen * activeIndex + 4 * 360;

    this.startRadian = easeInOut(this._spinningTime, 0, this.currentRadian, this._spinTotalTime) * (Math.PI / 180);

    this.drawRouletteWheel(context);
    window.requestAnimationFrame(this.rotateWheel.bind(this, context));
  };

  /**
   * 获取奖品的值
   */
  public getValue = () => {
    const { awards } = this.props;
    const AWARDS_COUNT = awards.length || 5;
    const AWARD_RADIAN = (Math.PI * 2) / AWARDS_COUNT;

    let degrees = this.startRadian * 180 / Math.PI + 90,
      arcd = AWARD_RADIAN * 180 / Math.PI,
      Index = Math.floor((360 - degrees % 360) / arcd);
    return Index;
  };

  /**
   * 执行旋转，用于绑定在按钮上
   * @param {Obj} context
   */
  public luckyDraw = (context: any) => {
    const { duration } =this.props;
    this._isAnimate = true;
    this._spinningTime = 0;
    this._spinTotalTime = Math.random() * 1000 + duration;
    //this._spinningChange = Math.random() * 100 + velocity;
    this.rotateWheel(context);
  };

  public draw = () => {
    const canvas = this.canvasRef.current;
    if (!canvas.getContext) {
      return;
    }

    const context = canvas.getContext('2d');
    this._canvasStyle = canvas.getAttribute('style');
    this.drawRouletteWheel(context);
    // 获取绘图上下文

    const { centerX, centerY, outsideRadius } = this.props;
    const ARROW_RADIUS = outsideRadius / 3;
    const BUTTON_RADIUS = ARROW_RADIUS * .8;
    const devicePixelRatio = window.devicePixelRatio || 1;

    ['touchstart', 'mousedown'].forEach((event) => {
      canvas.addEventListener(event, (e: any) => {
        if (!this._isAnimate) {
          let loc = windowToCanvas(canvas, e);
          context.beginPath();
          context.arc(centerX, centerY, BUTTON_RADIUS, 0, Math.PI * 2, false);
          if (loc && context.isPointInPath(loc.x*devicePixelRatio, loc.y*devicePixelRatio)) {
            this.luckyDraw(context);
          }
        }
      })
    });

    canvas.addEventListener('mousemove', (e: any) => {
      let loc = windowToCanvas(canvas, e);
      context.beginPath();
      context.arc(centerX, centerY, BUTTON_RADIUS, 0, Math.PI * 2, false);
      if (loc && context.isPointInPath(loc.x, loc.y)) {
        canvas.setAttribute('style', `cursor: pointer;${this._canvasStyle}`);
      } else {
        canvas.setAttribute('style', this._canvasStyle);
      }
    });
  }


  render() {
    const { canvasWidth } = this.props;
    const devicePixelRatio = window.devicePixelRatio || 1;
    return (
      <div className={styles.turnplate} key={12}>
        <canvas ref={this.canvasRef} width={canvasWidth*devicePixelRatio} height={canvasWidth*devicePixelRatio} style={{width: canvasWidth, height: canvasWidth}} >Sorry,Explorer not support.</canvas>
      </div>
    );
  }
}
