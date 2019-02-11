# 开发准备

```
git clone xxxxx
cd xxxx
npm install

npm start // http://localhost:8888#login 登录页 http://localhost:8888#index/record 后台主页
npm run build // 打包
```

# 目录结构

```text
+ build[webpack配置文件]
    - nginx.js[模拟容器]
    - webpack.base.js[webpack base配置]
    - webpack.dev.js[webpack开发环境配置]
    - webpack.prod.js[webpack生产环境配置]
+ dist[打包后的文件]
+ src
    - assets[存放静态资源]
    - components[react组件]
        + Account[账户管理]
        + Application[应用管理]
        + Back[返回上一页组件]
        + Content[动态配置菜单路由]
        + Dashboard[行车数据，地图，gsensor]
        + Group[群组管理]
        + Index[后台入口]
        + Loading[全局loading]
        + Login[登录入口]
        + LoginForm[登录框]
        + ObuOrderList[清单记录列表]
        + Ota[Ota上传]
        + Record[行程记录]
        + Search[搜索视频下载]
        + SideBar[后台菜单]
    - interface[typescript类型]
    - route[动态配置菜单路由]
    - store[redux相关，暂时没用]
    - utils[工具函数]
        + mock[mock数据]
        - carAnimation.ts[小车移动]
        - download.ts[没用]
        - gsensor.ts[图表绘制]
        - request.ts[xhr封装]
        - utils.ts[工具函数]
        - verify.js[验证码]
        - wgs84togcj02.ts[坐标转换]
    - App.scss[应用框架css]
    - App.tsx[应用框架]
    - index.html[html入口]
    - index.scss[应用入口css（全局）]
    - index.tsx[应用入口]
- postcss.config.js[css后处理配置]
- .gitignore[忽略上传文件]
- tsconfig.json[typescript配置]
```

# 备注

一个用户分配一个角色（群组），一个角色分配多个权限

由于开发紧张，没有把类型写全，后续补上