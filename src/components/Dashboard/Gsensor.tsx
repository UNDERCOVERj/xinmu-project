// gsensor图表
import * as React from 'react';
import GsensorFunc from '@src/utils/gsensor';

interface InterfaceGsensorProps {
    data: any[];
    // style: {
    //     visibility: string;
    //     [key: string]: string;
    // }
}

export default class Gsensor extends React.PureComponent<InterfaceGsensorProps, {}> {
    constructor(props: InterfaceGsensorProps) {
        super(props);
    }
    // 由于异步加载，所以可在will的时候植入echarts
    componentWillMount() {
        const {data} = this.props;
        import(/* webpackChunkName: "asyncGsensor" */ 'echarts')
            .then(echartsModule => new GsensorFunc(data, echartsModule.default, '.gsensor'))
    }
    // shouldComponentUpdate() {
    //     let {
    //         style: {
    //             visibility
    //         },
    //         isGsensorShow
    //     } = this.props;
    //     if (visibility === 'visible' && isGsensorShow) {
    //         return true;
    //     }
    //     return false;
    // }
    render() {
        return (
            <div className='gsensor-wrapper'>
                <div className="gsensor" style={{width: '4.5rem', height: '3rem'}}></div>
            </div>
        )
    }
}