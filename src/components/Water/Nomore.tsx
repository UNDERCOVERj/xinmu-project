import * as React from 'react';
import {Spin} from 'antd';

interface NomoreProps {
    loading: boolean;
}

export default class Nomore extends React.Component<NomoreProps, {}> {
    constructor(props: NomoreProps) {
        super(props);
    }
    render() {
        let {loading} = this.props;
        return (
            <Spin spinning={loading}>
                <div className='nomore'>
                    {loading ? null : <div className='nomore-text'>无更多数据</div>}
                </div>
            </Spin>
        )
    }
}