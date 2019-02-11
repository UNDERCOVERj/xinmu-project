import * as React from 'react';
import {Icon} from 'antd';
import AsyncComponent from '@src/components/AsyncComponent'; // 动态导入高阶组件
// 菜单
export const menus = [{
    name: '行程记录',
    path: '/index/record',
    icon: <Icon type="car" />,
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncRecord' */ '../components/Record'))
},{
    name: '行车轨迹',
    path: '/index/path',
    icon: <Icon type="heat-map" />,
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncPath' */ '../components/Path'))
},{
    name: '搜索行车视频下载',
    path: '/index/search',
    icon: <Icon type="search" />,
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncSearch' */ '../components/Search'))
},{
    name: '账号群组管理',
    path: '/index/group',
    icon: <Icon type="team" />,
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncGroup' */ '../components/Group'))
},{
    name: '权限列表',
    path: '/index/account',
    icon: <Icon type="user" />,
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncAccount' */ '../components/Account'))
},{
    name: 'OTA',
    path: '/index/ota',
    icon: <Icon type="export" />,
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncOta' */ '../components/Ota'))
},{
    name: '应用管理',
    path: '/index/application',
    icon: <Icon type="appstore" />,
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncApplication' */ '../components/Application'))
}];
// 其余路由
export const contentList = [{
    path: '/index/obuOrderList',
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncObuOrderList' */ '../components/ObuOrderList'))
},{
    path: '/index/dashboard',
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncDashboard' */ '../components/Dashboard'))
},{
    path: '/index/water',
    component: AsyncComponent(() => import(/* webpackChunkName: 'asyncWater' */ '../components/Water'))
}];
