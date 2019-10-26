import { Subscription } from 'dva'
import { pathMatchRegexp } from '@/utils'
import modelExtend from 'dva-model-extend'
import { pageModel } from '@/utils/model'

export interface EggsModelType {
  namespace: string;
  subscriptions: {
    setup: Subscription,
  };
}

const EggsModel: EggsModelType = {
  namespace: 'eggs',
  subscriptions: {
    setup({ dispatch, history }): void {
      history.listen((location: any) => {
        const match = pathMatchRegexp('/eggs/:id', location.pathname)
        // console.log(match)
        if (match) {
          const payload = {activityId: match[1]};
          if(location.query && location.query.fromCustId && location.query.fromOpenid && location.query.shareType && location.query.shareType === '2'){
            const { fromCustId, fromOpenid, shareType } = location.query
            dispatch({ type: 'shareFriend',
              payload: {
                activityId: match[1],
                fromCustId,
                fromOpenid,
                shareType
              }
            })
          }

          dispatch({ type: 'getInit', payload})
          //点击分享连接，记录请求

          //shareFriend
          // console.log("分享好友参数", location.query)
        }
      });
    },
  },
};

export default modelExtend(pageModel, EggsModel);
