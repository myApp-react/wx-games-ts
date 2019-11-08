import shortid from 'shortid';
export const CANCEL_REQUEST_MESSAGE: string = 'cancle request';
export const WX_PREFIX = process.env.NODE_ENV === 'development' ? '/wx' : '';

export const codeMessage = {
  1: '没有活动',
  2: '活动没有发布',
  3: '取消发布',
  4: '活动没有开始',
  5: '活动已结束',
  6: '您的机会已用完',
  7: '所有奖项结束',
  8: '时段奖项结束',
  9: '未找到奖品',
  10: '奖品库存不足',
  11: '未设置产品角度信息',
  12: '未设置奖品发放规则',
};

export const eggInitData = [
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
];

export const eggData = [
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
  {
    id: shortid.generate(),
    status: 0
  },
];

export const hammerPoX = {
  0: '73vw',
  1: '39vw',
  2: '5.33333vw',
  3: '73vw',
  4: '39vw',
  5: '5.33333vw',
  6: '73vw',
  7: '39vw',
  8: '5.33333vw'
}

export const hammerPoY = {
  0: '-2.66667vw',
  1: '-2.66667vw',
  2: '-2.66667vw',
  3: '28vw',
  4: '28vw',
  5: '28vw',
  6: '60vw',
  7: '60vw',
  8: '60vw'
}
