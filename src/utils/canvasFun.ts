


/**
 * 判断是否为 PC 端，若是则返回 true，否则返回 flase
 */
export function IsPC() {
  let userAgentInfo = navigator.userAgent,
    flag = true,
    Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];

  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag
};

/**
 * 缓动函数，由快到慢
 * @param {Num} t 当前时间
 * @param {Num} b 初始值
 * @param {Num} c 变化值
 * @param {Num} d 持续时间
 */
export function easeOut(t: number, b: number, c: number, d: number) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

/**
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * */

export function easeInOut(t: number, b: number, c: number, d: number) {
  if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
  return c / 2*((t -= 2) * t * t + 2) + b;
};

export function easeInOutQuint(x: number, t: number, b: number, c: number, d: number) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};


export function windowToCanvas(canvas: any, e: any) {
  const event = e || window.event
  const bbox = canvas.getBoundingClientRect(),
    x = IsPC() ? e.clientX || event.clientX : e.changedTouches && e.changedTouches[0].clientX,
    y = IsPC() ? e.clientY || event.clientY : e.changedTouches && e.changedTouches[0].clientY;

  return {
    x: x - bbox.left,
    y: y - bbox.top
  }
};

/**
 * 绘制自动换行的文本
 * @param {Obj} context
 * @param {Str} t          文本内容
 * @param {Num} x          坐标
 * @param {Num} y          坐标
 * @param {Num} w          文本限制宽度
 * @param {Num} lineHeight 行高
 */
export function drawGameText(text: string){

};

/**
 * 绘制自动换行的文本
 * @param {Obj} context
 * @param {Str} t          文本内容
 * @param {Num} x          坐标
 * @param {Num} y          坐标
 * @param {Num} w          文本限制宽度
 * @param {Num} lineHeight 行高
 */
export function drawText(context: any, t: string, x: number, y: number, w: number, lineHeight: number = 20){
  let chr = t.split(''),
    temp = '',
    row = [];

  for (let a = 0; a < chr.length; a++){
    if ( context.measureText(temp).width < w ) {
      ;
    }
    else{
      row.push(temp);
      temp = '';
    }
    temp += chr[a];
  };

  row.push(temp);

  for(let b = 0; b < row.length; b++){
    context.fillText(row[b], x, y + (b + 1) * lineHeight);
  };
};

/**
 * 定义圆角矩形的方法
 * @param {Obj} context
 * @param {Num} cornerX
 * @param {Num} cornerY
 * @param {Num} width
 * @param {Num} height
 * @param {Num} cornerRadius
 */
export function roundedRect(context: any, cornerX: number, cornerY: number, width: number, height: number, cornerRadius: number) {
  if (width > 0) context.moveTo(cornerX + cornerRadius, cornerY);
  else           context.moveTo(cornerX - cornerRadius, cornerY);

  context.arcTo(cornerX + width, cornerY,
    cornerX + width, cornerY + height,
    cornerRadius);

  context.arcTo(cornerX + width, cornerY + height,
    cornerX, cornerY + height,
    cornerRadius);

  context.arcTo(cornerX, cornerY + height,
    cornerX, cornerY,
    cornerRadius);

  if (width > 0) {
    context.arcTo(cornerX, cornerY,
      cornerX + cornerRadius, cornerY,
      cornerRadius);
  }
  else {
    context.arcTo(cornerX, cornerY,
      cornerX - cornerRadius, cornerY,
      cornerRadius);
  }
}
