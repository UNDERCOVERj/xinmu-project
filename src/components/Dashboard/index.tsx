// 行车视频，gsensor，行车数据

import * as React from 'react';
import { withRouter } from "react-router";
import {Row, Col, Icon, message, Tabs, Spin} from 'antd';
import {getLocationParams, filteredDrivingTxtData} from '@src/utils/utils';
import './index.scss';
import Back from '@src/components/Back';
import DrivingTable from './DrivingTable';
import Gsensor from './Gsensor';
import Board from './Board';
import Merge from './Merge';
import CarAnimation from '@src/utils/carAnimation';
import {History, Location} from '@src/interface';
import DrivingTxtInfo from './DrivingTxtInfo';
import axios from 'axios';
// import wgs84togcj02 from '@src/utils/wgs84togcj02';
import request from '@src/utils/request';
const TabPane = Tabs.TabPane;
// const data = require('@src/utils/mock/mapInfo.json');
interface IndexProps {
    history: History,
    location: Location
}
interface IndexState {
    videoUrl: string;
    dashboardData: any[];
    drivingDataIndex: number;
    videoEl: HTMLElement;
    isGsensorShow: boolean;
    spinnigLoading: boolean;
    rec_file: string;
    merge_file: string;
    hasMerged: boolean;
    hasTxtInfo: number;
    drivingTxtData: any;
    file: string;
    isShowVideo: boolean;
    s3_megra_url: string;
    esim_id: string;
}
class Dashboard extends React.Component<IndexProps, IndexState> {
    mergeComponent: any; //ref
    videoEl: any;
    carAnimation: any;
    state: IndexState = {
        // videoUrl: 'http://xinmu-video-dev.s3.amazonaws.com/video/89886891040037014580/133226AB.MP4'
        videoUrl: 'https://ugcydzd.qq.com/uwMRJfz-r5jAYaQXGdGnC2_ppdhgmrDlPaRvaV7F2Ic/d0374fefmk0.p712.1.mp4?sdtfrom=v1010&guid=067b70a2c2cc206c415b14020c521f4f&vkey=A17F00BC3AEAE25DEA883EC26DF6C8769DA40454FAE93787D97D78D12DDA0604669C0439EFDE9B5BAE3DE3213AC11856754881A2D9847EF40643900A4968266EF85C70FFF4555F0CA712EE73E5D257132AEAE035DDD8DF2B918ABABF4B86777FDAC4D5668BF202447BA382B2EDF79FF79A716832D6E0C8F5',
        dashboardData: [],
        drivingDataIndex: 0, // 默认行车数据索引
        // drivingDataWrapperKey: 'map',
        videoEl: null, // video元素
        isGsensorShow: false,
        spinnigLoading: true,
        rec_file: '',
        merge_file: '', // 合并视频
        hasMerged: false, // 是否已合并
        hasTxtInfo: 0, // 有信息
        drivingTxtData: {},
        file: '',
        isShowVideo: false,
        s3_megra_url: '',
        esim_id: ''
    }
    constructor(props: IndexProps) {
        super(props);
    }
    public async componentWillMount() {
        let params = getLocationParams(this.props.location.search);
        let {stream_id, file, rec_file, merge_file, hasTxtInfo, esim_id} = params; // rec_file&merge_file 用作合并视频
        this.setState({
            esim_id,
            file,
            rec_file,
            merge_file,
            hasTxtInfo: +hasTxtInfo // 有信息
        })
        if (+hasTxtInfo) {
            // drivingTxtData = await request.sendDev('/driving/txt/data', 'GET');
            let {data: drivingTxtData} = await axios.get(rec_file);
            drivingTxtData = filteredDrivingTxtData((drivingTxtData || []));
            this.setState({drivingTxtData});
        }
        // 请求行车数据
        let {data: dashboardData} = await request.send('/obu/gettripdesc', 'GET', {stream_id});
        // let dashboardData = null;
        // setTimeout(() => {
            dashboardData = dashboardData.map((item: any) => {
                Object.keys(item).forEach(key => item[key] = +item[key]);
                return item;
            })
            document.querySelector('.drivingPlayer').src = file; // 为video设置url
            // document.querySelector('.drivingPlayer').src = this.state.videoUrl; // 为video设置url
            this.setState({
                dashboardData: dashboardData,
                spinnigLoading: true,
                isGsensorShow: true
            }, () => {
                this.setState({spinnigLoading: false})
                // 数据请求完成
                this.videoEl = document.querySelector('.drivingPlayer');
                // 行车和视频联动
                this.carAnimation = new CarAnimation(dashboardData, document.querySelector('.drivingPlayer'), document.querySelector('.map-container'))
                this.bindEvent(); // 视频播放事件监控
                this.videoEl.play();
            })
        // }, 1000)
        
    }
    // 监听视频播放
    private bindEvent() {
        let carAnimation = this.carAnimation;
        let videoEl = this.videoEl;
        videoEl.onprogress = videoEl.onpause = () => {
            carAnimation.stopAnimation(); // 停止动画
        }
        // 视频停止
        videoEl.onended = () => {
            var drivingDataIndex = carAnimation.index = carAnimation.lineArr.length - 1; // 代表当前数组索引
            this.setState({
                drivingDataIndex 
            })
            carAnimation.stopAnimation(); // 停止动画
        }
        // 视频拖动开始
        videoEl.onseeking = () => {
            carAnimation.flag = false;
            carAnimation.pauseAnimation();
        }
        // 视频拖动完成
        videoEl.onseeked = () => {
            var currentTime = videoEl.currentTime;
            var drivingDataIndex = carAnimation.index = Math.round(currentTime);
            if (drivingDataIndex > this.state.dashboardData.length) {
                carAnimation.stopAnimation();
                videoEl.pause();
                message.warn('数据长度不匹配');
                return;
            }
            this.setState({
                drivingDataIndex 
            })
            carAnimation.pauseAnimation();
        }
        // 在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。
        videoEl.onplaying = () => {
            carAnimation.flag = true;
        }
        videoEl.ontimeupdate = () => {
            var curTime = Math.floor(videoEl.currentTime);
            var len = carAnimation.lineArr.length - 2;
            // 须保证每秒只触发一次
            if (+curTime < +len && carAnimation.flag && curTime != carAnimation.index) {
                var drivingDataIndex = carAnimation.index = curTime;
                this.setState({
                    drivingDataIndex 
                })
                carAnimation.startAnimation.call(carAnimation);
            }
        }
    }
    // tab切换
    public handleTabChange = (activeKey: string) => {
        if (activeKey === 'merge') {
            if (!this.state.hasMerged) {
                let {
                    rec_file,
                    merge_file,
                    file,
                    esim_id
                } = this.state;
                this.mergeVideo(rec_file, file, esim_id, merge_file); 
            }
        }
    }
    // 合并则改变
    public changeMergedFlag = () => {
        this.setState({hasMerged: true})
    }
    setVideoSrc = (url) => {

        this.setState({
            isShowVideo: true
        }, () => {
            document.querySelector('.mergePlayer').src = url;
            this.changeMergedFlag();
        })
    }

    public async mergeVideo(rec_file: string, file: string, esim_id: string, merge_file: string) {
        if (merge_file) {
            this.setVideoSrc(merge_file);
            return;
        }
        let rec_file_arr = rec_file.split('/');
        // let video_name = rec_file_arr.length && rec_file_arr[rec_file_arr.length - 1];
        let video_name = rec_file;
        let file_arr = file.split('/');
        // let output_name = file_arr.length && file_arr[file_arr.length - 1];
        let output_name = file;
        try {
            let result = await request.send('/v1/recognition/video_merge', 'POST', {video_name, output_name, esim_id});
            if (result) {
                let {
                    data: {
                        s3_megra_url
                    }
                } = result;
                this.setVideoSrc(s3_megra_url);
            }
        } catch(e) {}
    }
    public render() {
        let containerStyle = {width: '100%', height: '3rem'};
        let {drivingDataIndex, dashboardData, isGsensorShow, spinnigLoading, rec_file, merge_file, hasTxtInfo, drivingTxtData,
            isShowVideo, s3_megra_url} = this.state;
        return (
            <div className="dashboard">
                <Back goBack={this.props.history.goBack}/>
                <div className='dashboard-title dashboard-row'>Dashboard</div>
                <Spin spinning={spinnigLoading}>
                    <div className="dashboard-container">
                        <Row className="dashboard-wrapper dashboard-row" type='flex' justify='center' align='center' gutter={20}>
                            <Col span={12} className="driving-player-wrapper">
                                <video className='drivingPlayer' style={containerStyle} controls muted> 
                                    <source src='' type='video/mp4' style={containerStyle}/>
                                </video>
                            </Col>
                            <Col span={12} className="driving-data-wrapper">

                                <Tabs defaultActiveKey="map" onChange={this.handleTabChange}>
                                    <TabPane tab={<span><Icon type="build" />行车地图</span>} key="map" style={{position: 'relative'}}>
                                        {dashboardData.length 
                                            ? <div className='map-container' style={{...containerStyle}}></div>
                                            : <div style={{...containerStyle}}><span>无行车数据</span></div>}
                                        {hasTxtInfo
                                            ? <DrivingTxtInfo drivingDataIndex={drivingDataIndex} drivingTxtData={drivingTxtData}/>
                                            : null}
                                    </TabPane>
                                    <TabPane tab={<span><Icon type="database" />Gsensor图表</span>} key="gsensor">
                                        {isGsensorShow 
                                            ? <Gsensor data={dashboardData}></Gsensor>
                                            : null}
                                    </TabPane>
                                    <TabPane tab={<span><Icon type="build" />仪表盘</span>} key="board">
                                        <Board drivingDataIndex={drivingDataIndex} data={dashboardData} style={{...containerStyle}}></Board>
                                    </TabPane>
                                    {
                                        rec_file ?
                                            (
                                                <TabPane tab={<span><Icon type="build" />合并视频</span>} key="merge">
                                                    <Merge 
                                                        s3_megra_url={s3_megra_url}
                                                        isShowVideo={isShowVideo}
                                                        style={{...containerStyle}}/>
                                                </TabPane>
                                            )
                                            : null
                                    }
                                    
                                </Tabs>
                            </Col>
                        </Row>
                        <div className="dashboard-table dashboard-row">
                            <DrivingTable data={dashboardData} drivingDataIndex={drivingDataIndex}/>
                        </div>
                    </div>
                </Spin>
                
            </div>
        )
    }
}

export default withRouter(Dashboard)