import * as React from 'react';
import {Icon} from 'antd';
import './index.scss';

export default class Back extends React.Component {
    render () {
        return (
            <div className="history-back">
                <p onClick={this.props.goBack}>
                    <Icon type="arrow-left" className='history-back-icon'/>返回
                </p>
            </div>
        )
    }
}