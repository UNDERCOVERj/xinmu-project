import * as React from 'react';
import './index.scss';
import {message} from 'antd';
import PathSearch from './PathSearch';
import request from '@src/utils/request';
import wgs84togcj02 from '@src/utils/wgs84togcj02';

export default class Path extends React.Component<{}, {}> {
    state = {
        startDate: null,
        endDate: null
    }
    componentDidMount() {
        this.initMap();
        this.bindEvent();
    }
    initMap = () => {
        let container = this.container = document.querySelector('.path-container');
        this.map = new qq.maps.Map(container, {
            // 地图的中心地理坐标
            center: new qq.maps.LatLng(39.916527, 116.397128),
            zoom: 4
        });
        // qq.maps.event.addListener(this.map, 'click', (e) => {
        //     console.log(e);
        // });
        this.markArr = [];
        this.leafPathArr = [];
    }
    getTrackList = async ({startDate = ''}, cb) => {
        let params = {
            add_time: Math.round(+new Date(startDate)/1000)
        };
        try {
            let result = await request.send('/track/gettracklist', 'GET', params);
            let {
                data: {
                    flatitude,
                    flongitude,
                    stream_id
                }
            } = result;
            this.setState({
                add_time: params.add_time
            }, () => this.getPathAndRenderHeatMap(stream_id));
        } catch(e) {

        } finally {
            cb && cb();
        }

    }
    bindEvent = () => {
        let map = this.map;
        qq.maps.event.addListenerOnce(map, "idle", () => {
            if (QQMapPlugin.isSupportCanvas) {
                this.heatmap = new QQMapPlugin.HeatmapOverlay(map, {
                    //点半径，设置为1即可
                    "radius": 1,
                    //热力图最大透明度
                    "maxOpacity": 0.8,
                    //是否在每一屏都开启重新计算，如果为true则每一屏都会有一个红点
                    "useLocalExtrema": true,
                    //设置大小字段
                    "valueField": 'count'
                });
                this.heatMapData = {data: []}; // 初始化热力图数据
            } else {
                message.warn("您的浏览器不支持canvas，无法绘制热力图！！")
            }
        });
        // let timer = null; // 防抖
        // qq.maps.event.addListener(map, 'bounds_changed', () => {
        //     clearTimeout(timer);
        //     timer = setTimeout(() => {
        //         let zoom = map.getZoom();
        //         if (zoom >= 14) {
        //             this.markArr.forEach((item, idx) => {
        //                 if(!item.hasPaint && map.getBounds().contains(item.point)) {
        //                     item.mark.setMap(null);
        //                     item.hasPaint = true;
        //                     this.getPathAndRenderHeatMap(item.stream_id);
        //                     // this.getLeafPath(item.stream_id)
        //                 }
        //             })
        //         }
        //     }, 200)
        // });
        // this.infoWin = new qq.maps.InfoWindow({
        //     map: map
        // });
    }
    /*

    // 第一次获取点
    getPath = async ({startDate = '', endDate = '', esim_id = ''}, cb) => {
        // let params = {
        //     start_add_time: Math.round(+new Date(startDate)/1000),
        //     end_add_time: Math.round(+new Date(endDate)/1000),
        // };
        let params= {
            add_time: Math.round(+new Date(startDate)/1000)
        };
        // if (esim_id) {
        //     params.stream_id = esim_id; // @yangxin
        // }
        this.setState({
            add_time: params.add_time // 所有接口都需要
        });
        this.reset();
        this.getPathCommonFunc(params, cb);
    }
    // 第二次获取点
    getMorePath = (stream_id) => {
        let params = {
            add_time: this.state.add_time,
            stream_id
        };
        this.getPathCommonFunc(params, null);
    }

    // 获取点的公共方法
    getPathCommonFunc = async (params, cb) => {
        try {
            let result = await request.send('/track/gettracklist', 'GET', params);
            cb && cb(); // 清楚搜索loading
            if (result) {
                let {
                    data = []
                } = result;
                let markArr = [];
                let anchor = new qq.maps.Point(6, 6),
                    size = new qq.maps.Size(24, 24),
                    origin = new qq.maps.Point(0, 0);
                data.forEach(item => {
                    let latitude = item.flatitude;
                    let longitude = item.flongitude;
                    let transformedData = wgs84togcj02(longitude, latitude);
                    longitude = transformedData[0];
                    latitude = transformedData[1];
                    let point = new qq.maps.LatLng(latitude, longitude);
                    markArr.push({
                        ...item,
                        point,
                        hasPaint: false,
                        mark: new qq.maps.Marker({
                            icon: new qq.maps.MarkerImage('https://lbs.qq.com/javascript_v2/img/center.gif', size, origin, anchor),
                            position: point,
                            map: this.map
                        })
                    });
                })
                this.markArr = [...this.markArr, ...markArr];
            }
        } catch(e) {}
    }
    getLeafPath = async (stream_id) => {
        let params = {
            add_time: this.state.add_time,
            stream_id
        };
        try {
            let result = await request.send('/track/gettracklist', 'GET', params);
            let {
                data = []
            } = result;
            if (data && data.length) {
                data.forEach(item => {
                    let latitude = item.flatitude;
                    let longitude = item.flongitude;
                    let transformedData = wgs84togcj02(longitude, latitude);
                    longitude = transformedData[0];
                    latitude = transformedData[1];
                    let point = new qq.maps.LatLng(latitude, longitude);
                    let marker = new qq.maps.Marker({
                        // icon: markerIcon,
                        position: point,
                        map: this.map
                    });
                    qq.maps.event.addListener(marker, 'click', () => {
                        let infoWin = this.infoWin;
                        infoWin.open();
                        infoWin.setContent(`<a href="#">${item.stream_id}</a>`);
                        infoWin.setPosition(point);
                    });
                    this.leafPathArr.push({
                        ...item,
                        point,
                        mark: marker
                    });
                })
            }
        } catch(e) {}
    }

    */
    // 获取坐标并绘制热力图
    getPathAndRenderHeatMap = async (stream_id) => {
        this.reset();
        let params = {
            add_time: this.state.add_time,
            stream_id
        };
        try {
            let result = await request.send('/track/gettracklist', 'GET', params);
            let {
                data = []
            } = result;
            if (data && data.length){
                this.appendCoordinates(data);
                this.paint();
            }
        } catch(e) {}
    }
    // 添加坐标
    appendCoordinates = (data = []) => {
        data.forEach(item => {
            let latitude = item.flatitude && item.flatitude.trim();
            let longitude = item.flongitude && item.flongitude.trim();
            let transformedData = wgs84togcj02(longitude, latitude);
            longitude = transformedData[0];
            latitude = transformedData[1];
            this.heatMapData.data.push({ "lat": latitude, "lng": longitude});
        })
    }
    // 增量式绘制
    paint = () => {
        this.heatmap.setData(this.heatMapData);
    }
    // // 搜索完后先清空
    // beforeRepaint = () => {
    //     this.heatmap.setData({data: []});
    // }
    // 重置
    reset = () => {
        let heatMapData = this.heatMapData = {data: []};
        // this.markArr.forEach((item) => item.mark.setMap(null));
        // this.leafPathArr.forEach((item) => item.mark.setMap(null));
        this.heatmap.setData(heatMapData);
    }
    render() {
        let {startDate, endDate} = this.state;
        return (
            <div className="path">
                <div className="path-container"></div>
                <PathSearch
                    getTrackList={this.getTrackList}
                    startDate={startDate}
                    endDate={endDate}/>
            </div>
        )
    }
}