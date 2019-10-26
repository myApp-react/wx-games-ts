import React, { Component } from "react"
// import { Turnplate } from "@/components"
import { Modal } from 'antd-mobile'
import styles from './index.less'
const alert = Modal.alert;


interface TurntableState {
  awards: Array<any>;
}

/**
 * interface 给 props 和 state 定义类型
 * */
class Turntable extends Component<{}, TurntableState> {

  public state = {
    awards: [
      {id: '13wer44e5dwsaq2', type: 'losing', content: '未中奖'},
      {id: 'dfsqwe325fdw35a', type: 'text', content: '100元话费'},
      {id: 'dfs325fd4w35a', type: 'text', content: '6元话费'},
      {id: 'dfs325fdw35a', type: 'text', content: '5元话费'},
      {id: 'dfs325fd41w35a', type: 'text', content: '7元话费'},
      {id: 's3123r557wds54', type: 'image', content: require("@/assets/icon_pecan.png")},
      {id: 's3r557wds54', type: 'text', content: 'iphone8plus'},
      {id: '234gsq5', type: 'text', content: '大保健'},
      {id: 's12sa232', type: 'image', content: require("@/assets/icon_avocado.png")},
    ],
  }

  public finish = (index: number, callback?: any) => {
    switch(this.state.awards[index].type) {
      case 'text':
        alert('中奖啦！！！', '🎉恭喜您中得：' + this.state.awards[index].content, [
          { text: 'OK', onPress: () => callback() },
        ]);
        break;
      case 'image':
        alert('中奖啦！！！', '🎉恭喜您中得：战争磨坊水冷机箱', [
          { text: 'OK', onPress: () => callback() },
        ]);
        break;
      case 'losing':
        alert('未中奖', '💔很遗憾，您没有中奖~', [
          { text: 'OK', onPress: () => callback() },
        ]);
        break;
    }

  }

  public render() {
    // const { awards } = this.state;
    // const canvasWidth = window.innerWidth;
    // const devicePixelRatio = window.devicePixelRatio || 1;
    // const TurnplateProps = {
    //   canvasWidth,
    //   centerX: canvasWidth*devicePixelRatio / 2,
    //   centerY: canvasWidth*devicePixelRatio / 2,
    //   outsideRadius: canvasWidth * devicePixelRatio / 2 - 146,
    //   startRadian: 0,
    //   awards,
    //   finish: this.finish,
    //   activeId: "dfsqwe325fdw35a", //中奖的id
    //   duration: 3000,
    //   velocity: 20,
    //   buttonFont: '开始抽奖',
    //   oddColor: '#FD5757',
    // }

    return (
      <div className={styles['games-warp']}>
        <div className={styles['games-inner']}>
          <div className={styles['bg-warp']}>
            <img src={require("@/assets/turnplate-bg.jpg")} className={styles.bgImg} alt="底图"/>
          </div>
          <div className={styles.main}>
            {/*<Turnplate {...TurnplateProps}/>*/}
          </div>
        </div>

      </div>
    )
  }
}

export default Turntable;
