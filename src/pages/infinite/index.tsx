import React, { PureComponent } from 'react'
import { ListView } from 'antd-mobile';
import styles from './index.less'
const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
const NUM_ROWS = 20;
let pageIndex = 0;

function genData(pIndex = 0) {
  const dataBlob = {};
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = (pIndex * NUM_ROWS) + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1: any, row2: any) => row1 !== row2,
});

interface ListScrollState {
  dataSource: any,
  isLoading: boolean,
  hasMore: boolean,
}

export default class ListScroll extends PureComponent<{}, ListScrollState> {
  lv: React.RefObject<any> = React.createRef();
  rData: any;

  state: ListScrollState = {
    dataSource,
    isLoading: true,
    hasMore: false,
  };

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    // simulate initial Ajax
    setTimeout(() => {
      this.rData = genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 600);
  }

  onEndReached = (event: any) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.rData = { ...this.rData, ...genData(++pageIndex) };
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  }


  render() {

    const separator = (sectionID: any, rowID: any) => (
      <div
        key={`${sectionID}-${rowID}`}
        className={styles.separator}
      />
    );
    let index = data.length - 1;
    const row = (rowData: any, sectionID: any, rowID: any) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      console.log(this.state.dataSource)
      return (
        <div key={rowID} className={styles["card-warp"]}>
          <div
            className={styles.title}
          >{obj.title}</div>
          <div className={styles["card-flex"]}>
            <img className={styles["card-flex-img"]} src={obj.img} alt="" />
            <div>
              <div className={styles.des}>{obj.des}</div>
              <div><span className={styles.number} style={{ color: '#FF6E27' }}>{rowID}</span>¥</div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <ListView
        ref={this.lv}
        dataSource={this.state.dataSource}
        renderHeader={() => <span>header</span>}
        renderFooter={() => (<div className={styles.loading} >
          {this.state.isLoading ? '加载更多中...' : '加载完成'}
        </div>)}
        renderRow={row}
        renderSeparator={separator}
        className="am-list"
        pageSize={4}
        useBodyScroll
        onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    )
  }

}
