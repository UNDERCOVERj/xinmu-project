import wgs84togcj02 from './wgs84togcj02';

function CarAnimation(data, videoEl, mapContainer, drivingTxtData) {
    this.drivingTxtData = drivingTxtData; // 需要在车上显示的数据
    this.mapContainer = mapContainer;
    this.gaugeData = data || []; // 行车数据
    this.index = -1; // 在视频播放，拖动的时候会改变
    this.flag = false; // 指示是否可以播放，playing的时候true，seek过程false；
    this.videoEl = videoEl;
    this.aMap = null; // 高德地图实例；
    this.lineArr = []; // 经纬度行车数据
    this.marker = null; // 汽车覆盖物;
    this.polyline = null; // 行车终始轨迹
    // this.passedPolyline = null; // 行驶过的路径
    if (!data.length) return;
    this.initMap();
    // this.bindEvent();
}
// 移除map
CarAnimation.prototype.clearMap = function() {
    this.amap.clearMap()
};
// 载入map
CarAnimation.prototype.initMap = function() {
    var self = this;
    let maps = qq.maps;
    // 经纬度行车数据
    let lineArr = this.lineArr = this.gaugeData.map(function(item) { 
        var arr = wgs84togcj02(item.flongitude, item.flatitude);
        return new maps.LatLng(arr[1], arr[0]); // 和高德地图经纬度反着
    });
    // 初始化中心
    var centerPosition = lineArr[Math.floor(lineArr.length/2)];
    // 初始化高德地图
    let amap = this.amap = new maps.Map(this.mapContainer, {
        center: centerPosition,
        zoom: 15,
        mapTypeControlOptions: {mapTypeIds: []},
        panControl: false,
        zoomControl  :false,
        scaleControl : false
    });
    // 与汽车一样的信息窗口
    // this.infoWin = new maps.InfoWindow({
    //     map: amap,
    //     visible: true,
    //     zIndex: 9999
    // });
    // 初始化汽车覆盖物
    this.marker = new maps.Marker({
        map: amap,
        position: lineArr[0],
        icon: new maps.MarkerImage("https://webapi.amap.com/images/car.png", null, null, new maps.Point(0, 10)),
    });
    // 总轨迹
    this.polyline = new maps.Polyline({
        map: amap,
        path: lineArr,
        strokeLinecap: 'butt',
        strokeDashStyle: 'solid',
        strokeColor: "#28F",  //线颜色
        strokeWeight: 6      //线宽
    });
    // 走过的轨迹
    /*
    this.passedPolyline = new maps.Polyline({
        map: amap,
        strokeDashStyle: 'solid',
        strokeColor: "#AF5",  //线颜色
        strokeWeight: 6,      //线宽
    });
    */
    // 汽车行动，画走过的轨迹
    // this.marker.on('moving', function (e) {
    maps.event.addListener(this.marker, 'moving', (e) => {
        var restArr = lineArr.slice(0, self.index);
        var direction = maps.geometry.spherical.computeHeading(e.passedLatlngs[0], e.passedLatlngs[1]);
        direction = direction > 0 ? direction : direction + 360;
        direction -= 90;
        self.marker.setRotation(direction);
        // self.passedPolyline.setPath(e.passedLatlngs && restArr.concat(e.passedLatlngs[1]));
    });
};
// 开始小车移动
CarAnimation.prototype.startAnimation = function() {
    if (!this.gaugeData.length) return;
    var gap = 2;
    var self = this;
    function move() {
        // 1s两个点的距离
        if (self.index === self.gaugeData.length - gap) {
            clearTimeout(this.timer);
            return;
        }
        // self.index++; // mark
        var twoPointLineArray = self.lineArr.slice(self.index, self.index + gap);
        // self.infoWin.setContent('Hello world');
        // self.infoWin.setPosition(twoPointLineArray[1]);
        var distance = Math.round(qq.maps.geometry.spherical.computeDistanceBetween(twoPointLineArray[0], twoPointLineArray[1]));
        var speed = distance*3600/1000; // 由m/s换算成km/h
        // 两个点经纬度一样会报错
        speed && self.marker.moveAlong(twoPointLineArray, speed);
    }
    move();
};
// 暂停小车
CarAnimation.prototype.pauseAnimation = function() {
    if (!this.gaugeData.length) return;
    clearTimeout(this.timer);
    this.marker.pauseMove();
};
// 停止小车
CarAnimation.prototype.stopAnimation = function() {
    if (!this.gaugeData.length) return;
    this.index = 0;
    clearTimeout(this.timer);
    this.marker.stopMove();
};

export default CarAnimation;


// 绑定video事件，转移到父组件处理
// CarAnimation.prototype.bindEvent = function() {
//     var self = this;
//     // 视频暂停
//     // 视频加载
//     this.videoEl.onprogress = this.videoEl.onpause = function() {
//         self.stopAnimation(); // 停止动画
//     }
//     // 视频停止
//     this.videoEl.onended = function() {
//         self.index = self.lineArr.length - 1;
//         self.stopAnimation(); // 停止动画
//     }
//     // 视频拖动开始
//     this.videoEl.onseeking = function() {
//         self.flag = false;
//         self.pauseAnimation();
//     }
//     // 视频拖动完成
//     this.videoEl.onseeked = function() {
//         var currentTime = self.videoEl.currentTime;
//         self.index = Math.round(currentTime);
//         self.pauseAnimation();
//     }
//     // 在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。
//     this.videoEl.onplaying = function() {
//         self.flag = true;
//     }
//     this.videoEl.ontimeupdate = function() {
//         var curTime = Math.floor(self.videoEl.currentTime);
//         console.log(curTime, self.index)
//         var len = self.lineArr.length - 2;
//         // 须保证每秒只触发一次
//         if (+curTime < +len && self.flag && curTime != self.index) {
//             self.index = curTime;
//             self.startAnimation.call(self);
//         }
//     }
// };