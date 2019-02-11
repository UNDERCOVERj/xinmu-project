import * as React from 'react';
import {Button} from 'antd';
interface LoadMoreProps {
    loadMore(): void;
}
export default class LoadMore extends React.Component<LoadMoreProps, {}> {
    constructor(props: LoadMoreProps) {
        super(props);
    }
    render() {
        return (
            <div className='loadmore'>
                <Button type="primary" ghost onClick={this.props.loadMore}>查看更多</Button>
            </div>
        )
    }
}