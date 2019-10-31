import React  from 'react';
// import { Result, Icon } from 'antd-mobile';
// import styles from './index.less'

// interface LayoutState {
//   error: boolean
// }
// class Layout extends Component<{}, LayoutState>{
//   state: LayoutState = {
//     error: false
//   }
//
//   componentDidCatch(error: any, errorInfo: any) {
//     console.log(error)
//     this.setState({ error: true });
//   }
//
//   render(){
//     if(!this.state.error){
//       return (
//         <Result
//           className={styles["error-page"]}
//           img={<Icon type="cross-circle-o" size={'md'} className="spe" style={{ fill: '#F13642' }} />}
//           title="打开错误"
//           message="遇到了一些错误，请稍后再试"
//         />
//       )
//     }else {
//       return this.props.children
//     }
//   }
// }

const BasicLayout: React.FC = ({children}) => {
  return (
    <>{children}</>
  )
};

export default BasicLayout;
