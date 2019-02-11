function Gsensor(parseData, echarts, container) {
    this.container = document.querySelector(container);
    this.echarts = echarts;
    this.parseData = parseData || [];
    this.gsensor_x = [];
    this.gsensor_y = [];
    this.gsensor_z = [];
    this.len = this.parseData.length;
    // 最多多少组数据
    this.max = this.len < 60 ? this.len : 60;
    this.xAxisData = [],
    // 实例
    this.myChart = null;
    this.option = null;
    this.generateData();
    this.init();
    this.action();
}
Gsensor.prototype.generateData = function() {
    // push数据
    for (var i = 0; i < this.len; i++) {
        var item = this.parseData[i];
        this.gsensor_x.push(item.gsensor_x || 0);
        this.gsensor_y.push(item.gsensor_y || 0);
        this.gsensor_z.push(item.gsensor_z || 0);
    }
    for (var i = 0; i < this.max; i++) {
        this.xAxisData.push(((i + 1) + 's'));
    }
    // 指定图表的配置项和数据
    this.option = {
        type: 'line',
        trigger: 'axis',
        tooltip: {},
        legend: {
            data:['gsensor_x', 'gsensor_y', 'gsensor_z']
        },
        xAxis: {
            data: this.xAxisData
        },
        yAxis: {},
        series: [{
            name: 'gsensor_x',
            type: 'line',
            data: this.gsensor_x
        },{
            name: 'gsensor_y',
            type: 'line',
            data: this.gsensor_y
        },{
            name: 'gsensor_z',
            type: 'line',
            data: this.gsensor_z
        }]
    };
};
Gsensor.prototype.init = function() {
    this.myChart = this.echarts.init(this.container);
};
Gsensor.prototype.action = function() {
    // 使用刚指定的配置项和数据显示图表。
    this.myChart.setOption(this.option);
};

export default Gsensor;