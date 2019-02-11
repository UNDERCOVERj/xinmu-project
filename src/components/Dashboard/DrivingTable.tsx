// 具体行车数据

import * as React from 'react';
import {Row, Col} from 'antd';
import {rowData, defaultDrivingData} from './rowData';
interface DrivingTableProps {
    data: any[];
    drivingDataIndex: number;
}
export default class DrivingTable extends React.Component<DrivingTableProps, {}> {
    constructor(props: DrivingTableProps) {
        super(props);
    }
    public render() {
        const {data, drivingDataIndex} = this.props;
        let drivingData = data && data.length && data[drivingDataIndex] || defaultDrivingData;
        const rowLen = 6;
        const colLen = 24/6;
        return (
            <div className="driving-table">
                <div className="driving-table-title">
                    行车数据
                </div>
                <Row className='dashboard-table-row' type='flex' align='middle' justify='center' key='0'>
                    {rowData.slice(0, rowLen).map(item => (<Col key={item.title} span={colLen}><span>{item.title}</span></Col>))}
                </Row>
                <Row className='dashboard-table-row' type='flex' align='middle' justify='center' key='1'>
                    <Col key='gsensor_x' span={colLen}>{drivingData.gsensor_x}</Col>
                    <Col key='gsensor_y' span={colLen}>{drivingData.gsensor_y}</Col>
                    <Col key='gsensor_z' span={colLen}>{drivingData.gsensor_z}</Col>
                    <Col key='voltage' span={colLen}>{(drivingData.voltage)/10}</Col>
                    <Col key='fairp' span={colLen}>{(drivingData.fairp)/100}</Col>
                    <Col key='fgenp' span={colLen}>{(drivingData.fgenp)/100}</Col>
                </Row>
                <Row className='dashboard-table-row' type='flex' align='middle' justify='center' key='2'>
                    {rowData.slice(rowLen, 2*rowLen).map(item => (<Col key={item.title} span={colLen}><span>{item.title}</span></Col>))}
                </Row>
                <Row className='dashboard-table-row' type='flex' align='middle' justify='center' key='3'>
                    <Col key='cool' span={colLen}>{drivingData.cool}</Col>
                    <Col key='fgaspick' span={colLen}>{(drivingData.fgaspick)/100}</Col>
                    <Col key='fgasavg' span={colLen}>{(drivingData.fgasavg)/100}</Col>
                    <Col key='frange' span={colLen}>{(drivingData.frange)/100}</Col>
                    <Col key='total_range' span={colLen}>{drivingData.total_range}</Col>
                    <Col key='fgastimes' span={colLen}>{(drivingData.fgastimes)/100}</Col>
                </Row>
                <Row className='dashboard-table-row' type='flex' align='middle' justify='space-between' key='4'>
                    {rowData.slice(2*rowLen, 3*rowLen).map(item => (<Col key={item.title} span={colLen}><span>{item.title}</span></Col>))}
                </Row>
                <Row className='dashboard-table-row' type='flex' align='middle' justify='space-between' key='5'>
                    <Col key='fgaskeep' span={colLen}>{(drivingData.fgaskeep)/100}</Col>
                    <Col key='errcode' span={colLen}>{(drivingData.errcode)/100}</Col>
                    <Col key='emgad' span={colLen}>{drivingData.emgad}</Col>
                    <Col key='emgbre' span={colLen}>{drivingData.emgbre}</Col>
                    <Col key='flatitude' span={colLen}>{drivingData.flatitude}</Col>
                    <Col key='flongitude' span={colLen}>{drivingData.flongitude}</Col>
                </Row>
            </div>
        )
    }
}   