import { Effect, Subscription} from 'dva';
// import { Reducer } from 'redux';
import {Config} from "@/services/api";
import { pathMatchRegexp } from '@/utils'


export interface GlobalModelState {
  couponInfo: any;
}

export interface GlobalModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    // setApiConfig: Reducer<GlobalModelState>;
  };
  subscriptions: {
    setup: Subscription,
    setupRequestCancel: Subscription,
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'couponDetail',
  state: {
    couponInfo: ''
  },
  effects: {
    *query({ payload }, { all, call, put }) {
      const response = yield call(Config, payload)
      // console.warn("response", response)
      if(response.AppId){
        yield put({
          type: 'setApiConfig',
          payload: { apiConfig: response }
        })
      }
    },
  },

  reducers: {
    // setApiConfig(state, { payload: { apiConfig } })  {
    //   return { ...state, apiConfig };
    // },
  },

  subscriptions: {
    setupRequestCancel({ history }): void {
      history.listen((location) => {
        const { cancelRequest = new Map() }: any = window;
        cancelRequest.forEach((value: any, key: any) => {
          if (value.pathname !== location.pathname) {
            // value.cancel(CANCEL_REQUEST_MESSAGE)
            // cancelRequest.delete(key)
          }
        })
      })
    },
    setup({ dispatch, history }): void {
      history.listen(({ pathname }): void => {
        const match = pathMatchRegexp('/coupon/:id', pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      });
    },
  },
};

export default GlobalModel;
