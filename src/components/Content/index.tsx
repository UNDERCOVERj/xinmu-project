import * as React from 'react';
import {Layout} from 'antd';
import { Route, Switch } from "react-router-dom";
const {Content, Footer} = Layout;
interface InterfaceMenu {
    name: string;
    path: string;
    component?: any;
}
interface ContentComponentProps {
    contentList: InterfaceMenu[];
    menus: InterfaceMenu[];
}
export default class ContentComponent extends React.Component<ContentComponentProps, {}> {
    state = {
        contentStyle: {
            padding: '.2rem',
            position: 'relative'
        }
    }
    constructor(props: ContentComponentProps) {
        super(props);
    }
    render() {
        // 所有路由
        const {menus, contentList} = this.props;
        return (
            <Layout style={{ marginLeft: 200 }}>
                <Content className='index-content' style={this.state.contentStyle}>
                        {/* 动态配置内容，和sidebar联动 */}
                        
                        <Switch>
                            {
                                [...menus, ...contentList].map((menu: InterfaceMenu) => 
                                (<Route 
                                    key={menu.path} 
                                    path={menu.path}
                                    component={menu.component
                                                    ? menu.component
                                                    : null}></Route>))
                            }
                        </Switch>
                        
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Copyright © 2018 Xinmu. All rights reserved.
                </Footer>
            </Layout>
        )
    }
}