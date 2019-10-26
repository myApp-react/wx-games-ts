import { Effect, Subscription} from 'dva';
import { Reducer } from 'redux';
import {Config} from "@/services/api";

export interface GlobalModelState {
  apiConfig: any;
}

export interface GlobalModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    getConfig: Effect;
  };
  reducers: {
    setApiConfig: Reducer<any>;
  };
  subscriptions: {
    setup: Subscription,
    setupRequestCancel: Subscription,
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'app',
  state: {
    apiConfig: {
      AbsoluteUri: "",
      AppId: "",
      NonceStr: "",
      Package: "",
      Signature: "",
      Ticket: "",
      Timestamp: ""
    },
  },
  effects: {
    *getConfig({ payload }, { all, call, put }) {
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
    setApiConfig(state, { payload: { apiConfig } })  {
      // console.error(apiConfig)
      return { ...state, apiConfig };
    },
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
      history.listen((location): void => {
        const AbsoluteUrl = window.location.href
        dispatch({
          type: 'getConfig',
          payload: { AbsoluteUrl }
        })
      });
    },
  },
};

export default GlobalModel;
