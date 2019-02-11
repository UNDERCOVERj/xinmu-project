import * as Loadable from 'react-loadable';
import * as React from 'react';
import Loading from '@src/components/Loading';

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "asyncAccount" */ './index'),
    loading: () => <Loading/>
});

export default class extends React.Component<{}, {}> {
    render() {
        return (
            <LoadableComponent />
        )
    }
}