import * as Loadable from 'react-loadable';
import * as React from 'react';
import Loading from '@src/components/Loading';
// 高阶函数
export default  (loadElement) => {
    const LoadableComponent = Loadable({
        loader: loadElement,
        loading: Loading
    });
    return class AsyncComponent extends React.Component<{}, {}> {
        render() {
            return <LoadableComponent {...this.props}/>
        }
    }
}