import * as React from 'react';
import {Button, Table, message} from 'antd'
import request from '@src/utils/request';
import AddForm from './AddForm';
import EditForm from './EditForm';
import './index.scss';
export default class Application extends React.Component {
    state = {
        applications: [],
        esimIds: [],
        copiedEsimIds: [], // 副本
        inputEsimId: '', // 用于搜索
        selectedEsimIds: [],
        pagination: {
            showQuickJumper: true,
            current: 1,
            pageSize: 0, // 每次请求回来得到条数pagesize去乘以总总页数得到总条数（假的总条数）
            total: 0 // 总条数
        }, // 分页参数
        loading: true, // 请求数据时loading
        applicationAddVisible: false, // 添加应用的modal
        applicationEditVisible: false, // 编辑
        editAccountAddSpinning: true,
        app_name: '', // 名称
        app_description: '', // 描述
    }
    componentWillMount () {
        this.fetch();
        this.getEsimIds();
    }
    // 参数重置
    resetForm() {
        this.setState({
            app_name: '',
            app_description: '',
            selectedEsimIds: []
        })
    }
    getEsimIds = async () => {
        try {
            let result = await request.send('/application/getesimidlist', 'GET');
            if (result) {
                let {
                    data: esimIds = []
                } = result;
                this.setState({
                    esimIds,
                    copiedEsimIds: esimIds
                })
            }
        } catch(e) {}
    }
    fetch = async () => {
        // 获取行车记录列表
        this.setState({loading: true}); // 请求前loading
        let result = await request.send('/application/getapplist', 'GET', {page: this.state.pagination.current})
        if (result) {
            const {
                data: {
                    list: applications = [],
                    page = 1, // 当前页数
                    page_count = 0 // 总页数
                }
            } = result;
            this.setState({
                applications,
                pagination: {
                    current: +page,
                    pageSize: applications.length,
                    total: page_count*applications.length
                },
                loading: false
            })
        }

    }
    // 新增应用的modal
    addApplication = () => {
        this.setState({
            applicationAddVisible: true
        })
    }
    // 分页
    handleChange = (paginationToChange, filters, sorter) => {
        let {current} = paginationToChange;
        let {pagination} = this.state;
        pagination.current = paginationToChange.current;
        this.setState({
            pagination
        });
        this.fetch();
    }
    // 确认新增
    handleApplicationOk = (e) => {
        e.preventDefault();
        this.addForm.validateFields(async (err, values) => {
            if (!err) {
                let {
                    app_name,
                    app_description
                } = values;
                let result = await request.send('/application/createapp', 'POST', {
                    app_name,
                    app_description
                })
                if (result) {
                    message.success('创建成功');
                    this.handleApplicationCancel();
                    this.fetch();
                }
            }
        });
    }
    // 取消新增
    handleApplicationCancel = () => {
        this.addForm.resetFields();
        this.setState({
            applicationAddVisible: false,
        })
        this.resetForm();
    }
    // 确认修改
    editHandleApplicationOk = () => {
        this.editForm.validateFields(async (err, values) => {
            if (!err) {
                let {id} = this.state;
                let {
                    app_name,
                    app_description
                } = values;
                let {selectedEsimIds} = this.state;
                selectedEsimIds = selectedEsimIds.join(',');
                let result = await request.send('/application/editapp', 'POST', {
                    id,
                    app_name,
                    app_description,
                    esim_id: selectedEsimIds,
                    _method: 'PUT' // put请求
                });
                if (result) {
                    message.success('修改成功');
                    this.editHandleApplicationCancel();
                    this.fetch();
                }
            }
        })
    }
    // 取消修改
    editHandleApplicationCancel = () => {
        this.editForm.resetFields();
        this.setState({
            applicationEditVisible: false,
            inputEsimId: ''
        })
        this.resetForm();
    }
    // 编辑账户
    edit = async (text, row, index) => {
        let {
            applications
        } = this.state;
        let {
            id
        } = applications[index];
        this.setState({
            id,
            applicationEditVisible: true,
            editApplicationAddSpinning: true
        })
        try {
            let result = await request.send('/application/getappdesc', 'GET', {id});
            if (result) {
                let {
                    data: {
                        app_name = '',
                        app_description = '',
                        esim_id: selectedEsimIds = []
                    }
                } = result;
                this.setState({
                    app_name,
                    app_description,
                    selectedEsimIds,
                    editAccountAddSpinning: false,
                    inputEsimId: ''
                })
            }
        } catch(e) {}
    }
    // 改变选中的esim_id
    changeSelectedEsimIds = (selectedRowKeys) => {
        this.setState({selectedEsimIds: selectedRowKeys});
    }
    // 搜索esim_id
    changeEsimIds = () => {
        let id = this.state.inputEsimId;
        this.setState({esimIds: this.state.copiedEsimIds.filter(esim_id => esim_id.indexOf(id) !== -1 )});
    }
    // 重新获取列表
    getAllEsimIds = () => {
        this.setState({esimIds: this.state.copiedEsimIds});
    }
    // 全选
    checkAll = () => {
        this.setState({selectedEsimIds: this.state.copiedEsimIds});
    }
    // 全不选
    checkNotAll = () => {
        this.setState({selectedEsimIds: []});
    }
    // 选择
    changeInput = (e) => {
        let val = e.target.value && e.target.value.trim();
        this.setState({
            inputEsimId: val
        })
    }
    render() {
        const columns = [{
            title: '客户名称',
            dataIndex: 'app_name',
            key: 'app_name',
            className: 'table-row'
        },{
            title: '描述',
            dataIndex: 'app_description',
            key: 'app_description',
            className: 'table-row'
        },{
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            className: 'table-row'
        },{
            title: '更新时间',
            dataIndex: 'update_time',
            key: 'update_time',
            className: 'table-row'
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            className: 'table-row',
            render: (text, row, index) => (<Button type="primary" icon="edit" size='small' onClick={() => this.edit(text, row, index)}>编辑</Button>))
        }];
        const formItemLayout = { // 表单定位
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        let {
            loading,
            pagination,
            applications,
            applicationAddVisible,
            app_name,
            app_description,
            applicationEditVisible,
            editAccountAddSpinning,
            esimIds,
            inputEsimId,
            selectedEsimIds
        } = this.state;
        const dataSource = applications.map(item => ({
            key: item.app_name,
            app_name: item.app_name,
            app_description: item.app_description,
            create_time: item.create_time,
            update_time: item.update_time
        }))
        return (
            <div className="application-container">
                <div className="application">
                    <div className="top-info">
                        <div className="add-btn">
                            <Button type="primary" onClick={this.addApplication}>新增客户</Button>
                        </div>
                        <Table 
                            columns={columns} 
                            dataSource={dataSource} 
                            loading={loading} 
                            pagination={pagination}
                            onChange={this.handleChange}/>
                    </div>
                </div>
                <AddForm
                    ref={(addForm) => {this.addForm = addForm}}
                    applicationAddVisible={applicationAddVisible}
                    handleApplicationOk={this.handleApplicationOk}
                    handleApplicationCancel={this.handleApplicationCancel}
                    formItemLayout={formItemLayout}
                    app_name={app_name}
                    app_description={app_description}/>
                <EditForm
                    ref={(editForm) => this.editForm = editForm}
                    applicationEditVisible={applicationEditVisible}
                    editHandleApplicationCancel={this.editHandleApplicationCancel}
                    editHandleApplicationOk={this.editHandleApplicationOk}
                    editAccountAddSpinning={editAccountAddSpinning}
                    formItemLayout={formItemLayout}
                    app_name={app_name}
                    esimIds={esimIds}
                    selectedEsimIds={selectedEsimIds}
                    changeEsimIds={this.changeEsimIds}
                    inputEsimId={inputEsimId}
                    checkAll={this.checkAll}
                    checkNotAll={this.checkNotAll}
                    getAllEsimIds={this.getAllEsimIds}
                    changeInput={this.changeInput}
                    changeSelectedEsimIds={this.changeSelectedEsimIds}
                    app_description={app_description}/>
            </div>
        )
    }
} 