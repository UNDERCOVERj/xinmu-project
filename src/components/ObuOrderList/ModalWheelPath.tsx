import * as React from 'react';
import wgs84togcj02 from '@src/utils/wgs84togcj02';
import {Spin, message} from 'antd';
import request from '@src/utils/request';
interface ModalWheelPathProps {
    onCloseWrapper(): void;
    modalWheelPathVisible: boolean;
    modalWheelPathAddTime: number | string;
}
export default class ModalWheelPath extends React.Component<ModalWheelPathProps, {}> {
    public state = {
        modalWheelPathLoading: true
    }
    constructor(props: ModalWheelPathProps) {
        super(props);
    }
    public componentDidMount() {
        let map = this.map = new qq.maps.Map(document.querySelector('.wheelPathCon'), {
            center: new qq.maps.LatLng(39.916527,116.397128),
            zoom:15                                                 
        });
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
            } else {
                message.warn("您的浏览器不支持canvas，无法绘制热力图！！")
            }
        });
    }
    public getDataAndUpdate = async (id) => {
        this.setState({modalWheelPathLoading: true})
        let result = await request.send('/obu/gettrail', 'GET', {esim_id: id}); // 键值不变用esim_id@yangxin。
        if (result) {
            let {
                data: mapData
            } = result;
            if (mapData.length) {
                this.updateMap(mapData);
            } else {
                message.warn('无行车轨迹');
            }
            this.setState({modalWheelPathLoading: false})
        }
    }
    public updateMap = (data) => {
        let path = [];
        let heatMapData = {};
        heatMapData.max = 1000;
        heatMapData.data = [];
        data.forEach(item => {
            var latitude = item.flatitude;
            var longitude = item.flongitude;
            var transformedData = wgs84togcj02(longitude, latitude);
            longitude = transformedData[0];
            latitude = transformedData[1];
            var point = new qq.maps.LatLng(latitude, longitude);

            path.push(point);
            heatMapData.data.push({ "lat": latitude, "lng": longitude});
        })
        this.polygon = new qq.maps.Polyline({
            map: this.map,
            path: path
        });
        this.map.panTo(path[0]);

        this.heatmap.setData(heatMapData);
    }
    public closeWrapper = (e) => {
        if(e.target.classList.contains('wheelPathCon-wrapper')) {
            this.props.onCloseWrapper();
            this.heatmap.setData({data: []});
            this.polygon && this.polygon.setPath([]);
        }
    }
    public render() {
        let {modalWheelPathVisible} = this.props;
        let {modalWheelPathLoading} = this.state;
        return (
            <div className="wheelPathCon-wrapper" onClick={e => this.closeWrapper(e)} style={{display: modalWheelPathVisible ? 'flex' : 'none'}}>
                <Spin spinning={modalWheelPathLoading}>
                    <div className="wheelPathCon" style={{width: '80vw', height: '80vh'}}></div>
                </Spin>
            </div>
        )
    }
}
