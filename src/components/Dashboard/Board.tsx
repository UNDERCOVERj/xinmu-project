import * as React from 'react';
import boardOptions from './boardData';
const echarts = require('echarts');
interface BoardProps {
    drivingDataIndex: number;
    data: any[];
    style: any;
}
export default class Board extends React.Component<BoardProps, {}> {
    myChart: any;
    constructor(props: BoardProps) {
        super(props);
    }
    componentDidMount() {
        let myChart = echarts.init(document.querySelector('.board-content'));
        this.myChart = myChart;
        this.myChart.setOption(boardOptions, true);
    }
    componentWillReceiveProps() {
        // todo 待优化
        let {
            data,
            drivingDataIndex
        } = this.props;
        if (!data.length) return;
        let tempData = data[drivingDataIndex];
        let h_speed = tempData.h_speed ? +tempData.h_speed/1000 : 0;
        let speed = tempData.speed ? +tempData.speed : 0;
        let fgaspick = tempData.fgaspick ? tempData.fgaspick : 0;
        boardOptions.series[0].data[0].value = h_speed.toFixed(2); //转速
        boardOptions.series[1].data[0].value = speed.toFixed(2); //时速
        boardOptions.series[2].data[0].value = fgaspick.toFixed(2); //油表
        //boardOptions.series[3].data[0].value = (Math.random()*2).toFixed(2) - 0; //水温
        this.myChart.setOption(boardOptions, true);
    }
    render() {
        const {
            style
        } = this.props;
        return (
            <div className='board' style={style}>
                <div className="board-content" style={style}></div>
            </div>
        )
    }
}