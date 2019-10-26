import modelExtend from 'dva-model-extend';
import { Reducer } from 'redux';
import { Effect } from "dva";
import { eggsType } from "@/utils/types";
import {
  getAllRecord,
  getConfig,
  getUserRecord,
  lotteryHandle,
  shareFriend,
  shareCommunity,
  getAvailableCount
} from "@/services/api";

export interface GlobalModelType {
  state: eggsType;
  effects: {
    getInit: Effect;
    getAvailableCount: Effect;
    lotteryHandle: Effect;
    getAllRecord: Effect;
    getUserRecord: Effect;
    shareFriend: Effect;
    shareCommunity: Effect;
  };
  reducers: {
    setActivityId: Reducer<any>;
    updateConfig: Reducer<any>;
    updateCount: Reducer<any>;
    updateAvailableCount: Reducer<any>;
    updateAllRecord: Reducer<any>;
    updateUserRecord: Reducer<any>;
  };
}

export const GlobalModel: GlobalModelType = {
  state: {
    initConfig: {
      StartTimeStamp: 0,
      EndTimeStamp: 0,
      LuckyChanceCount: 0,
      Name: '',
      CustomerId: "",
      OpenId: "",
      ShareImage: "",
    },
    allRecord: [],
    userRecord: [],
    UnUseCount: 0,
    activityId: '',
  },
  effects: {
    *getInit({ payload }, { all, call, put }) {
      yield put({ type: 'setActivityId', payload })
      const [result1, result2, result3, result4]  = yield all([
        call(getConfig, payload),
        call(getAllRecord, payload),
        call(getUserRecord, payload),
        call(getAvailableCount, payload)
      ])

      if(result1.Status === 1){
        yield put({
          type: 'updateConfig',
          payload: { initConfig: result1.Data }
        })
      }
      if(result2.Status === 1){
        yield put({
          type: 'updateAllRecord',
          payload: { allRecord: result2.Data }
        })
      }
      if(result3.Status === 1){
        yield put({
          type: 'updateUserRecord',
          payload: { userRecord: result3.Data }
        })
      }
      if(result4.Status === 1){
        yield put({
          type: 'updateAvailableCount',
          payload: { UnUseCount: result4.Data.UnUseCount }
        })
      }
    },
    *lotteryHandle({ payload }, { all, call, put }) {
      const response = yield call(lotteryHandle, payload)
      const { Data, Status } = response;
      if(Status === 1) return Data
    },
    *shareFriend({ payload }, { all, call, put }) {
      const response = yield call(shareFriend, payload)
      console.log("分享好友：", response)
      // const { Data, Status } = response;
      // if(Status === 1) return Data
    },
    *shareCommunity({ payload }, { all, call, put }) {
      const response = yield call(shareCommunity, payload)
      console.log("分享朋友圈：", response)
      const { Status } = response;
      if(Status === 1) {
        return {
          flag: true
        }
      }
    },
    *getAvailableCount({ payload }, { all, call, put }) {
      const response = yield call(getAvailableCount, payload)
      const { Data, Status } = response;
      if(Status === 1) {
        yield put({
          type: 'updateAvailableCount',
          payload: { UnUseCount: Data.UnUseCount }
        })
      }
    },
    *getAllRecord({ payload }, { all, call, put }) {
      const response = yield call(getAllRecord, payload)
      const { Data, Status } = response
      if(Status === 1) {
        yield put({
          type: 'updateAllRecord',
          payload: { allRecord: Data }
        })
      }
    },
    *getUserRecord({ payload }, { all, call, put }) {
      const response = yield call(getUserRecord, payload)
      const { Data, Status } = response
      if(Status === 1) {
        yield put({
          type: 'updateUserRecord',
          payload: { userRecord: Data }
        })
      }
    }
  },

  reducers: {
    setActivityId(state, { payload: { activityId } }) {
      return {
        ...state, activityId,
      };
    },
    updateConfig(state, { payload: { initConfig } })  {
      return {
        ...state, initConfig,
      };
    },
    updateCount(state, { payload: { UnUseCount } })  {
      return {
        ...state, UnUseCount,
      };
    },
    updateAllRecord(state, { payload: { allRecord } }) {
      return {
        ...state, allRecord,
      };
    },
    updateAvailableCount(state, { payload: { UnUseCount } }) {
      return {
        ...state, UnUseCount,
      };
    },
    updateUserRecord(state, { payload: { userRecord } }) {
      return {
        ...state, userRecord,
      };
    },
  },
};


export const pageModel = modelExtend(GlobalModel)
