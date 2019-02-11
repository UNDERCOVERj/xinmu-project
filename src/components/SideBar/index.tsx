// 侧边栏， 动态请求bar数据
import {Layout, Menu, Spin} from 'antd';
import * as React from 'react';
import { withRouter } from "react-router";
import {History, Match, Location} from '@src/interface';
import AvatarComponent from './Avatar'
import './index.scss';
// import {addList} from '@src/store/actions';
// import { connect } from "react-redux";

const {Sider} = Layout;

interface InterfaceMenu {
    name: string;
    path: string;
    icon: string;
    component: ReactElement;
}
interface SideBarProps {
    menus: Array<InterfaceMenu>;
    loading: boolean;
    location: Location;
    history: History;
    match: Match;
}

class SideBar extends React.Component<SideBarProps, {}> {
    constructor(props: SideBarProps) {
        super(props);
    }
    // componentWillMount() {
    //     setTimeout(() => {
    //         this.props.dispatch(addList({b: 333}));
    //     }, 1000)
    // }
    select = ({ key }: {key: string}) => {
        this.props.history.push(key)
    }
    render() {
        return (
            <Sider theme='dark' className='index-sidebar' style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                <Spin spinning={this.props.loading}>
                    <div style={{height: '100vh'}}>
                        <AvatarComponent/>
                        <Menu theme="dark" mode="inline" onSelect={this.select} selectedKeys={[this.props.history.location.pathname]}>
                            {
                                this.props.menus.map((menu) => 
                                (<Menu.Item key={menu.path}>
                                        {menu.icon}
                                        <span>{menu.name}</span>
                                    </Menu.Item>))
                            }
                        </Menu>
                    </div>
                </Spin>
            </Sider>
        )
    }
}
// const mapStateToProps = (state) => ({
//     list: state.listState.list
// })

// export default withRouter<SideBarProps>(connect(mapStateToProps)(SideBar));

export default withRouter<SideBarProps>(SideBar);