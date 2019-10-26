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

const scratchcardModel: EggsModelType = {
  namespace: 'shake',
  subscriptions: {
    setup({ dispatch, history }): void {
      history.listen((location: any): void => {
        const match = pathMatchRegexp('/shake/:id', location.pathname)
        if (match) {
          const payload = { activityId: match[1] };
          //点击分享连接，记录请求
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
        }
      });
    },
  },
};

export default modelExtend(pageModel, scratchcardModel);
