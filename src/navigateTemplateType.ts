module.exports = `
import Taro, { EventChannel, General } from "@tarojs/taro";

export enum NavigateType {
  /** 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Router.back 可以返回到原页面。小程序中页面栈最多十层。 */
  navigateTo = "navigateTo",
  /** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。 */
  redirectTo = "redirectTo",
  /** 关闭所有页面，打开到应用内的某个页面 */
  reLaunch = "reLaunch",
  /** 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
  switchTab = "switchTab",
}

interface ToRouterType<P> {
  params?: P;
  type?: NavigateType /** 接口调用结束的回调函数（调用成功、失败都会执行） */;
  complete?: (res: General.CallbackResult) => void;
  /** 页面间通信接口，用于监听被打开页面发送到当前页面的数据。 */
  events?: General.IAnyObject;
  /** 接口调用失败的回调函数 */
  fail?: (res: General.CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (
    res: General.CallbackResult & { eventChannel: EventChannel }
  ) => void;
}

const navigateType = <P>(url: string, options?: ToRouterType<P>) => {
  const { type, params, success, fail, complete, events } = options ?? {
    type: NavigateType.navigateTo,
    params: {},
    success: () => {},
    fail: () => {},
    complete: () => {},
    events: undefined,
  };
  url = url + generateParams(params ?? {});
  switch (type) {
    case NavigateType.navigateTo:
      Taro.navigateTo({ url, success, fail, complete, events });
      break;
    case NavigateType.redirectTo:
      Taro.redirectTo({ url, success, fail, complete });
      break;
    case NavigateType.reLaunch:
      Taro.reLaunch({ url, success, fail, complete });
      break;
    case NavigateType.switchTab:
      Taro.switchTab({ url, success, fail, complete });
      break;
    default:
      Taro.navigateTo({ url, success, fail, complete, events });
  }
};

const generateParams = (params: { [key: string]: any }) => {
  return (
    "?" +
    Object.entries(params).reduce((total, cur, idx) => {
      const val = cur[0] + "=" + cur[1];
      if (idx === Object.entries(params).length - 1) {
        return total + val;
      } else {
        return total + val + "&";
      }
    }, "")
  );
};
//模板内容
export const toHomePage = <P>(options?: ToRouterType<P>) => {
  navigateType("/pages/Home/Home", options);
};


export const toIndexPage = <P>(options?: ToRouterType<P>) => {
  navigateType("/pages/index/index", options);
};


export const toMinePage = <P>(options?: ToRouterType<P>) => {
  navigateType("/pages/mine/mine", options);
};


export const toDetailPage = <P>(options?: ToRouterType<P>) => {
  navigateType("/subPackages/Detail/index", options);
};
`;
