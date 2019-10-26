import pathToRegexp from 'path-to-regexp'
import moment from 'moment'
import wx from "weixin-js-sdk"


export function _shareFriendAndCommunity(apiRouter: string, routing: string, dispatch: any, ShareImage: string, activityId: string, OpenId: string, CustomerId: string, shareType1: string, shareType2: string) {

  wx.onMenuShareAppMessage({
    title: '分享好友', // 分享标题
    desc: '抽奖活动分享', // 分享描述
    link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=${routing}&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=${shareType1}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: ShareImage, // 分享图标
    success: function () {},
  })

  wx.onMenuShareTimeline({
    title: '分享朋友圈', // 分享标题
    link: `http://ydhtest.fetower.com/WestLuckyDraw/ExternalShareGuide?address=dist&routing=${routing}&activityId=${activityId}&fromOpenid=${OpenId}&fromCustId=${CustomerId}&shareType=${shareType2}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: ShareImage, // 分享图标
    success: function () {
      dispatch({
        type: `${apiRouter}/shareCommunity`,
        payload: { activityId }
      }).then((e: any) => {
        if(e.flag){//朋友圈分享成功，更新可用次数
          dispatch({
            type: `${apiRouter}/getAvailableCount`,
            payload: { activityId }
          })
        }
      })
    }
  })
}

export function DateRangeRender(startDate: number, endDate: number) {
  if(moment().valueOf() < startDate){
    return `活动未开始`
  }
  if(moment().valueOf() > endDate){
    return `活动已结束`
  }
  return `${moment(startDate).format('YYYY.MM.DD')} - ${moment(endDate).format('YYYY.MM.DD')}`
}

/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(regexp: any, pathname: string) {
  // console.log(regexp);
  return pathToRegexp(regexp).exec(pathname)
}

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array: Array<any>, key: string, value: string) {
  if (!Array.isArray(array)) {
    return
  }
  return array.find(_ => _[key] === value)
}

/**
 * In an array object, traverse all parent IDs based on the value of an object.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the value of the object that needs to be queried. 指定需要查询的对象的值
 * @param   {string}    parentId  The alias of the parent ID of the object in the array. 数组中对象的父ID的别名
 * @param   {string}    id        The alias of the unique ID of the object in the array. 数组中对象的唯一ID的别名
 * @return  {array}    Return a key array.
 */
export function queryPathKeys(array: Array<any>, current: string, parentId: string, id: string = 'id') {

  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))
  const getPath = (current: string) => {
    const currentParentId = hashMap.get(current)[parentId]
    if (currentParentId) {
      result.push(currentParentId)
      getPath(currentParentId)
    }
  }

  getPath(current)
  return result
}


/**
 * In an array of objects, specify an object that traverses the objects whose parent ID matches.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryAncestors(array: Array<any>, current: string, parentId: string, id: string = 'id') {
  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))

  const getPath = (current: string) => {
    const currentParentId = hashMap.get(current[id])[parentId]
    if (currentParentId) {
      result.push(hashMap.get(currentParentId))
      getPath(hashMap.get(currentParentId))
    }
  }

  getPath(current)
  return result
}
