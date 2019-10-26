//抽奖返回参数
export interface prizeStatus {
  Status: number,
  PrizeImage: string,
  PrizeName: string
  PrizeAngle: number
}

export interface initConfigType {
  CustomerId: string
  EndTimeStamp: number
  LuckyChanceCount: number
  Name: string
  OpenId: string
  ShareImage: string
  StartTimeStamp: number
}

export interface eggsType {
  initConfig: initConfigType
  allRecord: Array<any>;
  userRecord: Array<any>;
  UnUseCount: number;
  activityId: string;
}

interface appType {
  apiConfig: any
}

export interface EggsModelState {
  eggs: eggsType
  app: appType
  dispatch: any,
  loading: any,
  location: any,
}
export interface CardModelState {
  card: eggsType
  app: appType
  dispatch: any,
  loading: any,
  location: any,
}

export interface shakeModelState {
  shake: eggsType
  app: appType
  dispatch: any,
  loading: any,
  location: any,
}

/**大转盘props*/
export interface TurnplateProps {
  canvasWidth: number
  centerX: number
  centerY: number
  activeId: string
  awards: Array<any>
  outsideRadius: number
  evenColor?: string
  oddColor: string
  loseColor?: string
  textColor?: string
  arrowColorFrom?: string
  arrowColorTo?: string
  buttonFont: string
  buttonFontColor?: string
  buttonColorFrom?: string
  buttonColorTo?: string
  startRadian?: number
  duration: number
  velocity: number
  finish?: (index: number, callback: any) => void
  pointImg?: string
}

/**砸金蛋props*/
export interface EggsProps {
  backgroundImage: string,
  eraserSize?: number,
  eggsItemRadius: number,
  coverColor?: string,
  eggsImg: string,
  baseImg: string,
  emptyEgg: string,
  eggsOpen: string,
  LuckyChanceCount: number,
  canvasWidth: number,
  canvasHeight: number,
  awards: Array<any>,
  activityId: string,
  // lotteryRes: any,
  openHandle: (status: boolean, showImg: string) => void
  dispatch: any
  modalStatus: boolean
}

/**刮刮乐props*/
export interface CardProps {
  bgImage: string,
  activityId: string,
  status: number,
  PrizeName: string,
  isShowCover: boolean,
  isEmpty: boolean,
  eraserSize?: number,
  sampleStep: number,
  finishPercent: number,
  canvasWidth: number,
  coverColor?: string,
  coverImage?: string,
  onComplete: (status: boolean, showImg: string) => void,
  dispatch: any,
  location: any,
  endDate: number,
  startDate: number,
}



