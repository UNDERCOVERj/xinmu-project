import * as React from 'react';
import { Layout } from 'antd';
import AsyncComponent from '@src/components/AsyncComponent'
import {menus, contentList} from '@src/route/index'

interface InterfaceMenu {
    name: string;
    path: string;
    component: any;
}
interface IndexState {
    menus: InterfaceMenu[];
    loading: boolean;
}

const AsyncContent = AsyncComponent(() => import(/* webpackChunkName: 'asyncContent'*/ '../Content'));
const AsyncSideBar = AsyncComponent(() => import(/* webpackChunkName: 'asyncSideBar'*/ '../SideBar'));

export default class Index extends React.Component<{}, IndexState> {
    state = {
        menus: [],
        loading: true
    }
    componentWillMount() {
        const userMenus = JSON.parse(localStorage.getItem('userMenus')) || []; 
        this.setState({
            menus: menus.filter((item) => userMenus.indexOf(item.name) !== -1),
            loading: false
        })
    }
    render() {
        const {menus, loading} = this.state;
        return (
            <Layout style={{minHeight: '100vh'}}>
                <AsyncSideBar menus={menus} loading={loading}/>
                <AsyncContent menus={menus} contentList={contentList}/>
            </Layout>
        )
    }
}