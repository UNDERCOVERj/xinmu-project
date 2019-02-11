import * as React from 'react';
import {Button, Table, Modal, Radio, message, Icon, Tooltip} from 'antd';
import request from '@src/utils/request';
import downloadjs from 'downloadjs';
import {History} from '@src/interface'
import axios from 'axios';
const RadioGroup = Radio.Group;

interface ModalDetailProps {
    history: History;
    modalDetailTitle: string;
    modalDetailVisible: boolean;
    hideModalDetail: () => void;
    modalDetailDataSource: any[];
    fetch(): Promise<any>;
}

export default class ModalDetail extends React.Component<ModalDetailProps, {}> {
    state = {
        identifyVisible: false,
        esim_id: '',
        file_name: '',
        identifyType: 0 // 1=车辆识别,2=红绿灯识别,3=混合识别
    }
    constructor(props: ModalDetailProps) {
        super(props);
    }
    goToDashboard = (index: number) => {
        let {
            stream_id,
            esim_id,
            rec_file,
            rec_status,
            merge_file,
            file
        } = this.props.modalDetailDataSource[index];
        let dashboardUrl = `/index/dashboard?stream_id=${encodeURIComponent(stream_id)}&esim_id=${encodeURIComponent(esim_id)}&file=${encodeURIComponent(file)}`;
        if (merge_file) {
            dashboardUrl += `&merge_file=${encodeURIComponent(merge_file)}`;
        } 
        if (rec_file && rec_status == 2) {
            dashboardUrl += `&hasTxtInfo=1&rec_file=${encodeURIComponent(rec_file)}`;
        }
        this.props.history.push(dashboardUrl);
    }
    // 下载文档
    downloadText = async (index: number) => {
        let {
            stream_id
        } = this.props.modalDetailDataSource[index];
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
    downloadCsv = async (index: number) => {
        let {
            oid
        } = this.props.modalDetailDataSource[index];
        try {
            let result = await request.send(`/obu/trailvideo`, 'get', {oid});
            if (typeof result === 'string') {
                await request.send(`/obu/trailvideo`, 'open', {oid});
            }
        } catch(e) {}
    }
    // 下载视频
    downloadVideo = (index: number) => {
        let {
            file
        } = this.props.modalDetailDataSource[index];
        // 新开下载
        window.open(file);
    }
    // 识别
    identify = (index: number) => {
        let {
            file,
            esim_id,
            rec_status
        } = this.props.modalDetailDataSource[index];
        let fileStrArr = file && file.split('/');
        let translatedFile = fileStrArr[fileStrArr.length - 1];
        this.setState({
            file_name: translatedFile,
            identifyVisible: true,
            esim_id,
            identifyType: rec_status & +rec_status
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
            // this.props.hideModalDetail(); // 关闭整个弹窗
            // this.props.fetch();
        }
    }
    onIdentifyChange = (e) => {
        this.setState({
            identifyType: e.target.value,
        });
    }
    render() {
        const {
            modalDetailTitle,
            modalDetailVisible, 
            hideModalDetail, 
            modalDetailDataSource = [] 
        } = this.props;
        const columns = [{
            key: 'add_time',
            dataIndex: 'add_time',
            title: '视频建立时间',
            defaultSortOrder: 'descend', // 默认
            sorter: (a: any, b: any) => a.add_time_date_string - b.add_time_date_string
        },{
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text: string, row: any, index: number) => (
                <div>
                    <Tooltip placement="top" title='查看视频'>
                        <Button type='primary' size='small' className='operate-btn' onClick={() => this.goToDashboard(index)}><Icon type="video-camera" /></Button>
                    </Tooltip>
                    <Tooltip placement="top" title={modalDetailDataSource[index].rec_status ? '已识别' : '识别'}>
                        <Button type='primary' size='small' className='operate-btn' onClick={() => this.identify(index)}><Icon type="notification" /></Button>
                    </Tooltip>
                    <Tooltip placement="top" title='下载视频'>
                        <Button type='primary' size='small' className='operate-btn' onClick={() => this.downloadVideo(index)}><Icon type="download" /></Button>
                    </Tooltip>
                    <Tooltip placement="top" title='下载文档'>
                        <Button type='primary' size='small' className='operate-btn' onClick={() => this.downloadText(index)}><Icon type="download" /></Button>
                    </Tooltip>
                    <Tooltip placement="top" title='批量下载视频'>
                        <Button type='primary' size='small' onClick={() => this.downloadCsv(index)}><Icon type="download" /></Button>
                    </Tooltip>
                </div>
            ) 
        }]
        const dataSource = modalDetailDataSource.map(item => ({
            key: item.add_time,
            add_time: new Date(+item.add_time*1000).toLocaleString(),
            add_time_date_string: +new Date(+item.add_time*1000)
        }));
        let { identifyVisible } = this.state;
        return (
            <Modal
                title={`行程编号：${modalDetailTitle}`}
                visible={modalDetailVisible}
                footer={null} 
                onCancel={hideModalDetail}>
                <Table dataSource={dataSource} columns={columns} pagination={false}></Table>
                <Modal 
                    title='识别'
                    visible={identifyVisible}
                    onCancel = {this.onIdentifyCancel}
                    onOk={this.onIdentifyOk}
                    okText='确认'
                    cancelText='取消'
                    >
                    <RadioGroup onChange={this.onIdentifyChange} value={this.state.identifyType}>
                        <Radio value={1}>车辆识别</Radio>
                        <Radio value={2}>红绿灯识别</Radio>
                        <Radio value={3}>混合识别</Radio>
                    </RadioGroup>
                </Modal>
            </Modal>
        )
    }
}