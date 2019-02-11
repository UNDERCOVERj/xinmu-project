import * as React from 'react';
import {Button, Table, message} from 'antd';
import AddForm from './AddForm';
import EditForm from './EditForm';
import request from '@src/utils/request';
import './index.scss';

class Account extends React.Component {
    state = {
        accountAddVisible: false,
        mu_name: '', // 账号
        mu_pwd: '', // 密码
        mu_email: '', // 邮件
        mu_type: 'U', // 账户类型 G:群组,U:后台账户
        groupName: '', // 所属群组
        groups: [],
        groupsMap: {}, // 群组name & id映射表
        accounts: [],
        xm_user_sn: '', // 编辑的是哪个用户
        mu_valid: 'N', // 默认封锁 账户状态 Y:激活,N:封锁
        editAccountAddVisible: false, // 编辑modal
        editAccountAddSpinning: false, // 编辑modal的spinning
        pagination: {
            showQuickJumper: true,
            current: 1,
            pageSize: 0, // 每次请求回来得到条数pagesize去乘以总总页数得到总条数（假的总条数）
            total: 0 // 总条数
        }, // 分页参数
        loading: true, // 请求数据时loading
        app_id: '', // 当前编辑的用户app_id
        apps: [] // 应用列表
    }
    async componentWillMount() {
        this.fetch();
        this.getGroupList();
        this.getApps(); // 获取应用列表
    }
    getGroupList = async () => {
        let grouplist = await request.send('/group/getgrouplist', 'GET', {
            page: 1
        })
        if (grouplist) {
            let {
                data: {
                    list: groups
                }
            } = grouplist
            let temp = {};
            groups.forEach(item => temp[item.mu_name] = item.mu_sn);
            groups = groups.map(item => ({name: item.mu_name}))
            this.setState({
                groups,
                groupsMap: temp
            });
        }
    }
    getApps = async () => {
        let result = await request.send('/application/getapplist', 'GET', {
            page: 1
        });
        if (result) {
            let {
                data: {
                    list: apps
                }
            } = result;
            this.setState({
                apps
            })
        }
    }
    addGroup = () => {
        this.setState({
            accountAddVisible: true
        })
    }
    // 确认新增
    handleAccountOk = (e) => {
        e.preventDefault();
        this.addForm.validateFields(async (err, values) => {
            if (!err) {
                let {
                    mu_name,
                    mu_pwd,
                    mu_email,
                    groupName
                } = values;
                let {
                    groupsMap,
                    mu_type
                } = this.state;
                let group_id = groupsMap[groupName];
                let result = await request.send('/user/createuser', 'POST', {
                    mu_name,
                    mu_pwd,
                    mu_email,
                    mu_type,
                    group_id
                })
                if (result) {
                    message.success('创建成功');
                    this.handleAccountCancel();
                    this.fetch();
                }
            }
        });
    }
    // 取消新增
    handleAccountCancel = () => {
        
        this.addForm.resetFields();
        this.setState({
            accountAddVisible: false,
        })
        this.resetForm();
    }
    // 确认修改
    editHandleAccountOk = () => {
        let {
            groupsMap,
            mu_sn
        } = this.state;
        this.editForm.validateFields(async (err, values) => {
            if (!err) {
                let {
                    mu_valid,
                    app_id,
                    groupName
                } = values;
                let mug_group_sn = groupsMap[groupName];
                let params = {
                    // todo
                    xm_user_sn: mu_sn,
                    xm_app_id: app_id,
                    mu_valid,
                    mug_group_sn,
                    _method: 'PUT'
                }
                let result = await request.send('/user/edituser', 'POST', params);
                if (result) {
                    message.success('修改成功');
                    this.editHandleAccountCancel();
                    this.fetch();
                }
            }
        })
    }
    // 取消修改
    editHandleAccountCancel = () => {
        this.editForm.resetFields();
        this.setState({
            editAccountAddVisible: false,
        })
        this.resetForm();
    }
    // 状态改变
    onValidChange = (e) => {
        this.setState({
            mu_valid: e.target.value,
        });
    }
    // 编辑账户
    edit = async (text, row, index) => {
        let {
            accounts,
            groupsMap
        } = this.state;
        let {
            mu_name,
            mu_sn,
        } = accounts[index];
        this.setState({
            editAccountAddVisible: true,
            editAccountAddSpinning: true
        })
        try {
            let result = await request.send('/user/getuserdesc', 'GET', {mu_sn});
            if (result) {
                let {
                    data: {
                        app_id = '',
                        group_id: mug_group_sn,
                        mu_valid = 'N' // 默认未激活
                    }
                } = result;
                let groupName = Object.keys(groupsMap).find(name => groupsMap[name] === mug_group_sn);
                // app_id当前用户的app_id
                this.setState({
                    app_id, // 暂时没有保持状态，因为接口没有返回
                    mu_sn,
                    mu_name,
                    mug_group_sn: 1, // 这而后面修改，目前没有group_id
                    groupName,
                    mu_valid,
                    editAccountAddSpinning: false
                })
            }
        } catch(e) {}
    }
    resetForm = () => {
        this.setState({
            mu_name: '',
            groupName: '',
            mu_pwd: '',
            mu_email: ''
        })
    }
    // 点击某一页的时候
    handleChange = (paginationToChange, filters, sorter) => {
        let {current} = paginationToChange;
        let {pagination} = this.state;
        pagination.current = paginationToChange.current;
        this.setState({
            pagination
        });
        this.fetch();
    }
    // 请求数据
    async fetch() {
        // 获取行车记录列表
        this.setState({loading: true}); // 请求前loading
        // let obuListResult = await request.send('/group/getgrouplist', 'GET', {page: this.state.pagination.current});
        let accountResult = await request.send('/user/getuserlist', 'GET', {page: this.state.pagination.current})
        if (accountResult) {
            const {
                data: {
                    list: accounts = [],
                    page = 1, // 当前页数
                    page_count = 0 // 总页数
                }
            } = accountResult;
            this.setState({
                accounts,
                pagination: {
                    current: +page,
                    pageSize: accounts.length,
                    total: page_count*accounts.length
                },
                loading: false
            })
        }
    }
    render() {
        const columns = [{
            title: '账号',
            dataIndex: 'mu_name',
            key: 'mu_name',
            className: 'table-row'
        },{
            title: '用户ip',
            dataIndex: 'mu_login_ip',
            key: 'mu_login_ip',
            className: 'table-row'
        },{
            title: '最后登录时间',
            dataIndex: 'mu_lastlogin',
            key: 'mu_lastlogin',
            className: 'table-row'
        },{
            title: '创建时间',
            dataIndex: 'mu_created_time',
            key: 'mu_created_time',
            className: 'table-row'
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            className: 'table-row',
            render: (text, row, index) => (<Button type="primary" icon="edit" size='small' onClick={() => this.edit(text, row, index)}>编辑</Button>))
        }]
        const dataSource = this.state.accounts.map((item) => ({
            mu_name: item.mu_name,
            mu_login_ip: item.mu_login_ip,
            mu_lastlogin: item.mu_lastlogin,
            mu_created_time: item.mu_created_time,
            operation: item.mu_name,
            key: item.mu_name
        }))
        const {
            accountAddVisible,
            groupName,
            mu_name,
            groups,
            mu_pwd,
            mu_email,
            loading,
            pagination,
            editAccountAddVisible,
            mu_valid,
            app_id,
            apps,
            editAccountAddSpinning
        } = this.state;
        const formItemLayout = { // 表单定位
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <div className='account-container'>
                <div className="account">
                    <div className="top-info">
                        <div className="add-btn">
                            <Button type="primary" onClick={this.addGroup}>新增账户</Button>
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
                    accountAddVisible={accountAddVisible}
                    handleAccountOk={this.handleAccountOk}
                    handleAccountCancel={this.handleAccountCancel}
                    formItemLayout={formItemLayout}
                    groups={groups}
                    mu_name={mu_name}
                    mu_pwd={mu_pwd}
                    mu_email={mu_email}
                    groupName={groupName}/>
                <EditForm
                    ref={(editForm) => this.editForm = editForm}
                    editAccountAddSpinning={editAccountAddSpinning}
                    groups={groups}
                    mu_name={mu_name}
                    app_id={app_id}
                    mu_valid={mu_valid}
                    groupName={groupName}
                    formItemLayout={formItemLayout}
                    onValidChange={this.onValidChange}
                    editAccountAddVisible={editAccountAddVisible}
                    editHandleAccountOk={this.editHandleAccountOk}
                    editHandleAccountCancel={this.editHandleAccountCancel}
                    apps={apps}/>
            </div>
        )
    }
}
export default Account