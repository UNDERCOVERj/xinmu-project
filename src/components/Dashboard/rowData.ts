export const rowData = [{
    title: 'GsensorX',
    key: 'gsensor_x'
},{
    title: 'GsensorY',
    key: 'gsensor_y'
},{
    title: 'GsensorZ',
    key: 'gsensor_z',
},{
    title: '电瓶电压（V）',
    key: 'voltage' // voltage/10
},{
    title: '节气门开度（%）',
    key: 'fairp' // fairp/100
},{
    title: '发动机负荷（%）',
    key: 'fgenp'
},{
    title: '冷却液温度（°C）',
    key: 'cool' 
},{
    title: '瞬时油耗（L）',
    key: 'fgaspick' // fgaspick/100
},{
    title: '平均油耗（L/km）',
    key: 'fgasavg' // fgasavg/100
},{
    title: '本次行驶里程（km）',
    key: 'frange' // frange/100
},{
    title: '总里程（km）',
    key: 'total_range' // total_range
},{
    title: '本次耗油量（L）',
    key: 'fgastimes' // fgastimes/100
},{
    title: '累计耗油量（L）',
    key: 'fgaskeep' // fgaskeep/100
},{
    title: '当前故障码数量',
    key: 'errcode' // errcode
},{
    title: '本次急加速次数',
    key: 'emgad' // emgad
},{
    title: '本次急减速次数',
    key: 'emgbre' // emgbre
},{
    title: '纬度',
    key: 'flatitude' // flatitude
}, {
    title: '经度',
    key: 'flongitude' // flongitude
}]

export let defaultDrivingData = {
    'gsensor_x': 0,
    'gsensor_y': 0,
    'gsensor_z': 0,
    'voltage': 0,
    'fairp': 0,
    'fgenp': 0,
    'cool': 0,
    'fgaspick': 0,
    'fgasavg': 0,
    'frange': 0,
    'total_range': 0,
    'fgastimes': 0,
    'fgaskeep': 0,
    'errcode': 0,
    'emgad': 0,
    'emgbre': 0,
    'flatitude': 0,
    'flongitude': 0
}