import * as React from 'react';
import {Avatar, Popover, Icon} from 'antd';
import './index.scss';
function Content (props) {
    let app_id = localStorage.getItem('app_id');
    let app_secret = localStorage.getItem('app_secret');
    const iconStyle = {color: '#1890ff'};
    const lineStyle = {marginBottom: '.2rem'};
    return (
        <div>
            {app_id ? <div className="app_id" style={lineStyle}><Icon style={iconStyle} type="user" />：{app_id}</div> : null}
            {app_secret ? <div className="app_secret" style={lineStyle}><Icon style={iconStyle} type="lock" />：{app_secret}</div> : null}
            <div onClick={props.logout} className='contentLine'>
                <Icon type="poweroff" style={{marginRight: '1em', ...iconStyle}}/>
                <span>退出</span>
            </div> 
        </div>
    )
}

export default class AvatarComponent extends React.Component {
    logout = () => {
        // localStorage.removeItem('mu_sn');
        // localStorage.removeItem('mu_name');
        // localStorage.removeItem('token');
        // localStorage.removeItem('userMenus');
        localStorage.clear();
        location.href = '#/login';
    }
    render () {
        return (
            <div className="avator" style={{height: '.7rem'}}>
                <Popover content={<Content logout={this.logout}/>} placement='bottomLeft' title={localStorage.getItem('mu_name')} arrowPointAtCenter>
                    <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon="user" size='large'/>
                </Popover>          
            </div>
        )
    }
}