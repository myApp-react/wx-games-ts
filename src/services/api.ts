import request from '@/utils/request'
import { stringify } from 'qs'
const wxPrefix = process.env.NODE_ENV === 'development' ? '/wx' : '';

export interface configType {
  AbsoluteUrl: string
}

export interface paramsType {
  activityId: string
}

export interface shareType {
  activityId: string
  fromOpenid: string
  fromCustId: string
  shareType: string
}

//初始化信息
export async function Config(params: configType) {
  return request(`${wxPrefix}/Wx/SdkConfig`, {
    method: 'POST',
    data: params,
  });
}

export async function getConfig(params: paramsType) {
  return request(`${wxPrefix}/WestLuckyDraw/ExternalrLuckyDrawInit?${stringify(params)}`);
}
//抽奖机会
export async function getAvailableCount(params: paramsType) {
  return request(`${wxPrefix}/WestLuckyDraw/QueryLuckyChance?${stringify(params)}`);
}

//获取活动中奖记录（20）
export async function getAllRecord(params: paramsType) {
  return request(`${wxPrefix}/WestLuckyDraw/GetShowAllLuckyDrawPrizes?${stringify(params)}`);
}

//获取用户活动中奖记录
export async function getUserRecord(params: paramsType) {
  return request(`${wxPrefix}/WestLuckyDraw/GetShowUserLuckyDrawPrizes?${stringify(params)}`);
}

//抽奖算法
export async function lotteryHandle(params: paramsType) {
  return request(`${wxPrefix}/WestLuckyDraw/ExternalLotteryDrawHandle`, {
    method: 'POST',
    data: params,
  });
}

export async function shareFriend(params: shareType) {
  return request(`${wxPrefix}/WestLuckyDraw/RecordShareToAppointFriendReader`, {
    method: 'POST',
    data: params,
  });
}

export async function shareCommunity(params: paramsType) {
  return request(`${wxPrefix}/WestLuckyDraw/RecordShareToCircleOfFriends`, {
    method: 'POST',
    data: params,
  });
}



