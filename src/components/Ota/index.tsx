import * as React from 'react';
// import UpdateObu from './UpdateObu';
import {Table, Button, Tooltip, Icon, Modal, Upload, message, Popconfirm} from 'antd';
import request from '@src/utils/request';
import './index.scss';

export default class Ota extends React.Component {
    state = {
        otaList: [], // 列表内容
        otaListLoading: true, // 列表loading
        uploadingVisible: false,
        fileList: [],
        uploading: false,
        updateObuVisible: false
    }
    componentWillMount() {
        this.fetch();
    }  
    fetch = async () => {
        this.setState({
            otaListLoading: true
        })
        let result = await request.send('/ota', 'GET');
        if (result) {
            let {
                data: list = []
            } = result;
            this.setState({
                otaList: list,
                otaListLoading: false
            });
        }
    }
    // modal取消
    handleUploadModalCancel = () => {
        this.setState({
            uploadingVisible: false
        })
    }
    // 显示上传modal
    showModalUpload = () => {
        this.setState({
            uploadingVisible: true
        })
    } 
    // 上传档案
    handleUpload = async () => {
        const { fileList } = this.state;
        if (!fileList.length) {
            message.warn('请选择文件');
            return;
        } else if (fileList.length > 1) {
            message.warn('不支持同时上传多个文件');
        }
        this.setState({
            uploading: true,
        });
        let result = await request.send('/ota/uploads', 'POST', {obu_upgrade_file: fileList[0]});
        if (result) {
            this.setState({
                fileList: [],
                uploading: false,
                uploadingVisible: false
            });
            this.fetch(); // 上传成功重刷
            message.success('上传成功');
        } else {
            this.setState({
                uploading: false,
            });
            message.error('上传失败');
        }
    }
    confirmDelete = async (index) => {
        let {id} = this.state.otaList[index];
        let result = await request.send(`/ota/del/${id}`, 'GET')
        if (result) {
            message.success('删除成功');
            this.fetch();
        }
    }
    downloadOta = (index) => {
        let {file_name} = this.state.otaList[index];
        location.href = file_name;
    }
    // updateObuOk = async (params: any) => {
    //     try {
    //         let result = request.send('/ota/upKeyword', 'POST', params);
    //         if (result) {
    //             message.success('修改成功')
    //             this.setState({
    //                 updateObuVisible: false
    //             })
    //         }
    //     } catch(e) {}
    // }
    // updateObuCancel = () => {
    //     this.setState({
    //         updateObuVisible: false
    //     })
    // }
    render () {
        const columns = [{
            title: '主版本号',
            className: 'ota-table-column',
            dataIndex: 'mj',
            key: 'mj'
        },{
            title: '子版本号',
            className: 'ota-table-column',
            dataIndex: 'minor',
            key: 'minor'
        },{
            title: '类型',
            className: 'ota-table-column',
            dataIndex: 'tp',
            key: 'tp'
        },{
            title: '档案名称',
            className: 'ota-table-column',
            dataIndex: 'file_name',
            key: 'file_name'
        },{
            title: '创建时间',
            className: 'ota-table-column',
            dataIndex: 'add_time',
            key: 'add_time'
        },{
            title: '操作',
            className: 'ota-table-column',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, row, index) => (
                <div className='operation-btn-wrapper'>
                    <Tooltip placement="top" title='下载'>
                        <Button type="primary" size='small' className='operation-btn' onClick={() => {this.downloadOta(index)}}><Icon type="download" /></Button>
                    </Tooltip>
                    <Popconfirm title='确认删除吗' onConfirm={() => {this.confirmDelete(index)}} okText="Yes" cancelText="No">
                        <Tooltip placement="top" title='删除'>
                            <Button type="primary" size='small'><Icon type="delete" /></Button>
                        </Tooltip>
                    </Popconfirm>
                </div>
            )
        }];
        const dataSource = this.state.otaList.map((item) => {
            let {
                id: key,
                mj,
                minor,
                tp,
                file_name,
                add_time
            } = item;
            return {
                key,
                mj,
                minor,
                tp,
                file_name,
                add_time
            }
        });
        const uploadSettings = {
            action: '//jsonplaceholder.typicode.com/posts/',
            onRemove: (file) => {
              this.setState(({ fileList }) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return {
                    fileList: newFileList,
                };
              });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
      
        let {otaListLoading, uploadingVisible, uploading, updateObuVisible} = this.state;
        return (
            <div className="ota-container">
                <div className="ota">
                    <div className="add-btn">
                        <Button type="primary" onClick={this.showModalUpload} style={{marginRight: '.2rem'}}>上传档案</Button>
                        {/* <Button type="primary" onClick={() => this.setState({updateObuVisible: true})}>改变Obu状态</Button> */}
                    </div>
                    <Table
                        columns={columns} 
                        dataSource={dataSource} 
                        loading={otaListLoading}/>
                </div>
                <Modal 
                    title='上传档案'
                    visible={uploadingVisible}
                    onCancel={this.handleUploadModalCancel}
                    footer={null}>
                    <div className="upload-container">
                        <Upload {...uploadSettings}>
                        <Button>
                            <Icon type="upload" /> 选择文件
                        </Button>
                        </Upload>
                        <Button
                            className="upload-demo-start"
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={this.state.fileList.length === 0}
                            loading={uploading}
                        >
                            {uploading ? '上传中...' : '立即上传' }
                        </Button>
                    </div>
                </Modal>
                {/* <UpdateObu
                    updateObuVisible={updateObuVisible}
                    updateObuOk={this.updateObuOk}
                    updateObuCancel={this.updateObuCancel}/> */}
            </div>
        )
    }
}