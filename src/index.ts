const path = require('path');
const kuler = require('kuler');
import { IPluginContext } from '@tarojs/service';
const tem = require('./navigateTemplateType');

export default (ctx: IPluginContext, pluginOpts) => {
  console.log('pluginOpts: ', pluginOpts);
  ctx.registerCommand({
    // 命令名
    name: 'router-methods',
    // 执行 taro router-methods --help 时输出的 options 信息
    optionsMap: {
      '--ver': 'Taro 版本',
    },
    // 执行 taro upload --help 时输出的使用例子的信息
    synopsisList: ['taro router-methods --version 3'],
    async fn() {
      const { ver } = ctx.runOpts.options;
      console.log(`${kuler('开始生成', '#ff5722')}`);
      const appConfigPath = ctx.helper.resolveMainFilePath(
        //ctx.paths.sourcePath 当前项目源码路径  .../taro3-demo/src
        path.resolve(
          ctx.paths.sourcePath,
          Number(ver) === 2 ? './app' : './app.config',
        ),
      );
      const appConfig = ctx.helper.readConfig(appConfigPath);
      let pagePath = [...appConfig.pages.map((page) => `/${page}`)];
      //分包
      if (appConfig.subPackages) {
        appConfig.subPackages.forEach((subPackage) => {
          subPackage.pages.forEach((packagePage) => {
            pagePath.push(`/${subPackage.root}/${packagePage}`);
          });
        });
      }
      console.info('pagePath: ', pagePath);
      ctx.helper.fs.writeFile(
        ctx.paths.sourcePath + '/utils/toRouterPageFn.ts',
        tem + generateToRouterMethods(pagePath),
        (err) => {
          if (err) {
            console.log(`${kuler('生成失败', '#ff5722')}`);
          } else {
            console.log(`${kuler('生成成功', '#ff5722')} 🎉🥳`);
          }
        },
      );
    },
  });
};

function generateToRouterMethods(pagePath) {
  const staticStr = `//模板内容`;
  const toRouterMethodsStr = pagePath
    .map((item) => {
      const routerSplit = item

        .split('/')
        .map(
          (routerSplitItem) =>
            routerSplitItem.charAt(0).toUpperCase() + routerSplitItem.slice(1),
        );
      let methodName = '';
      if (routerSplit.length > 4) {
        methodName = routerSplit[1] + routerSplit[3];
      } else {
        methodName = routerSplit[2];
      }
      return `
export const to${
        methodName.charAt(0).toUpperCase() + methodName.slice(1)
      }Page = <P>(option?: ToRouterType<P>) => {
  navigateType("${item}", option);
};
`;
    })
    .join('\n');

  return staticStr + toRouterMethodsStr;
}
