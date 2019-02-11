import * as React from 'react';
import {Button, Table, Modal, Radio, message, Icon, Tooltip} from 'antd';
import SearchInput from './SearchInput';
import './index.scss';
import request from '@src/utils/request';
import downloadjs from 'downloadjs';
import axios from 'axios';
import { withRouter } from "react-router";
const RadioGroup = Radio.Group;

class Search extends React.Component<{}, {}> {
    state = {
        list: [], // table数据
        pagination: {
            showQuickJumper: true,
            current: 1,
            pageSize: 0, // 每次请求回来得到条数pagesize去乘以总总页数得到总条数（假的总条数）
            total: 0 // 总条数
        }, // 分页参数
        loading: false, // 请求数据时loading
        identifyVisible: false,
        esim_id: '',
        file_name: '',
        identifyType: 0, // 1=车辆识别,2=红绿灯识别,3=混合识别
        startDate: null, // 时间勾选, moment
        endDate: null
    }
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        // this.fetch();
        let searchStartDate = localStorage.getItem('searchStartDate');
        let searchEndDate = localStorage.getItem('searchEndDate');
        let searchEsimId = localStorage.getItem('searchEsimId');
        let searchPagination = localStorage.getItem('searchPagination');
        if (searchStartDate && searchEndDate && searchEsimId && searchPagination) {
            this.setState({
                startDate: searchStartDate,
                endDate: searchEndDate,
                esim_id: searchEsimId,
                pagination: JSON.parse(searchPagination) // 解出来 
            }, this.fetch)
        }
    }
    fetch = async () => {
        // 获取行车记录列表
        this.setState({loading: true}); // 请求前loading

        let {pagination, startDate, endDate, esim_id} = this.state;
        let params = {page: pagination.current, mu_sn: localStorage.getItem('mu_sn')};
        if (startDate && endDate && esim_id) {
            params = Object.assign({}, params, {
                start_add_time: Math.round(+new Date(startDate)/1000),
                end_add_time: Math.round(+new Date(endDate)/1000),
                esim_id
            })
        }
        let result = await request.send('/obu/searchdownload', 'GET', params);
        if (result) {
            const {
                data: {
                    list = [],
                    page = 1, // 当前页数
                    page_count = 0 // 总页数
                }
            } = result;
            let pagination = {
                current: +page,
                pageSize: list.length,
                total: page_count*list.length
            };
            localStorage.setItem('searchPagination', JSON.stringify(pagination));
            this.setState({
                list,
                pagination,
                loading: false
            })
        }
    }
    // 选择时间和esim_id
    setAddition = (additions) => {
        let {
            startDate,
            endDate,
            search_esim_id
        } = additions;
        this.setState({startDate, endDate, esim_id: search_esim_id}, this.fetch); // 搜索
        localStorage.setItem('searchStartDate', startDate);
        localStorage.setItem('searchEndDate', endDate);
        localStorage.setItem('searchEsimId', search_esim_id);
    }
    // 点击某一页
    handleChange = (paginationToChange, filters, sorter) => {
        let {current} = paginationToChange;
        let {pagination} = this.state;
        if (current !== pagination.current) { // 避免排序影响
            pagination.current = current;
            this.setState({
                pagination
            }, this.fetch)
        }
    }
    goToDashboard = (index) => {
        let {
            stream_id,
            esim_id,
            rec_file,
            merge_file,
            file
        } = this.state.list[index];
        let dashboardUrl = `/index/dashboard?stream_id=${encodeURIComponent(stream_id)}&esim_id=${encodeURIComponent(esim_id)}&file=${encodeURIComponent(file)}`;
        if (rec_file && merge_file) {
            dashboardUrl += `&rec_file=${encodeURIComponent(rec_file)}&merge_file=${merge_file}`;
        }
        this.props.history.push(dashboardUrl);
    }
    // 下载文档
    downloadText = async (index) => {
        let {
            stream_id
        } = this.state.list[index];
        try {
            let result = await request.send(`/stream/trail/${stream_id}`, 'GET', {stream_id});
            if (result) {
                let {
                    data: {
                        fileUrl
                    }
                } = result;
                try {
                    let txtFileData = await axios.get(fileUrl);
                    if (txtFileData && txtFileData.data) {
                        downloadjs(txtFileData.data, 'file', 'text/plain');
                    } else {
                        message.error('文件为空');
                    }
                } catch(e) {}
            }
        } catch(e) {}
    }
    // 下载视频
    downloadVideo = (index) => {
        let {
            file
        } = this.state.list[index];
        // 新开下载
        window.open(file);
    }
    // 识别
    identify = (index) => {
        let {
            file,
            esim_id
        } = this.state.list[index];
        this.setState({
            file_name: file,
            identifyVisible: true,
            esim_id
        })
    }
    onIdentifyCancel = () => {
        this.setState({
            identifyVisible: false
        })
    }
    onIdentifyOk = async () => {
        let {
            file_name,
            esim_id,
            identifyType
        } = this.state;
        let params = {
            file_name,
            esim_id,
            type: identifyType
        }
        let result = await request.send('/v1/recognition/videos', 'POST', params);
        if (result) {
            message.success('识别成功')
            this.setState({
                identifyVisible: false,
                identifyType: 0 // 重置
            })
        }
    }
    onIdentifyChange = (e) => {
        this.setState({
            identifyType: e.target.value,
        });
    }
    render() {
        const columns = [{
            key: 'esim_id',
            dataIndex: 'esim_id',
            title: 'esim_id',
            className: 'table-row'
        },{
            key: 'add_time',
            dataIndex: 'add_time',
            title: '视频建立时间',
            className: 'table-row',
            defaultSortOrder: 'descend', // 默认
            sorter: (a, b) => a.add_time_date_string - b.add_time_date_string
        },{
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            className: 'table-row',
            render: (text, row, index) => (
                <div>
                    <Tooltip placement="top" title='查看视频'>
                        <Button type='primary' size='small' className='operate-btn' onClick={() => this.goToDashboard(index)}><Icon type="video-camera" /></Button>
                    </Tooltip>
                    <Tooltip placement="top" title='识别'>
                        <Button type='primary' size='small' className='operate-btn' onClick={() => this.identify(index)}><Icon type="notification" /></Button>
                    </Tooltip>
                    <Tooltip placement="top" title='下载视频'>
                        <Button type='primary' size='small' className='operate-btn' onClick={() => this.downloadVideo(index)}><Icon type="download" /></Button>
                    </Tooltip>
                    <Tooltip placement="top" title='下载文档'>
                        <Button type='primary' size='small' onClick={() => this.downloadText(index)}><Icon type="download" /></Button>
                    </Tooltip>
                </div>
            ) 
        }]
        let { identifyVisible, list, pagination, identifyType, startDate, endDate, esim_id } = this.state;
        const dataSource = list.map((item, idx) => ({
            key: item.add_time,
            esim_id: item.esim_id,
            add_time: new Date(+item.add_time*1000).toLocaleString(),
            add_time_date_string: +new Date(+item.add_time*1000)
        }));
        return (
            <div className="search">
                <SearchInput
                    startDate={startDate}
                    endDate={endDate}
                    esim_id={esim_id}
                    setAddition={this.setAddition}/>
                <Table
                    className='record-row'
                    columns={columns} 
                    dataSource={dataSource}
                    loading={this.state.loading}
                    onChange={this.handleChange}
                    pagination={pagination} />
                <Modal 
                    title='识别'
                    visible={identifyVisible}
                    onCancel = {this.onIdentifyCancel}
                    onOk={this.onIdentifyOk}
                    okText='确认'
                    cancelText='取消'
                    >
                    <RadioGroup onChange={this.onIdentifyChange} value={identifyType}>
                        <Radio value={1}>车辆识别</Radio>
                        <Radio value={2}>红绿灯识别</Radio>
                        <Radio value={3}>混合识别</Radio>
                    </RadioGroup>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Search);