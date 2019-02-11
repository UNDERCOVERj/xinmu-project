import * as React from 'react';
import {Spin} from 'antd';
export default function() {
    return (
        <Spin size='large' tip='加载中'>
            <div style={{height: '100vh', width: '100vw'}}></div>
        </Spin>
    )
}