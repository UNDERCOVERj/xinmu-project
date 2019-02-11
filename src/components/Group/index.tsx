import * as React from 'react';
import {Table, Icon, Tag, Button, Modal, Checkbox, Row, Input, message} from 'antd'
// import {menus} from '@src/route'; // 所有的权限
import request from '@src/utils/request';
import './index.scss';
const {Group: CheckboxGroup} = Checkbox;
export default class Account extends React.Component {
    state = {
        groupAddTitle: '新增群组',
        groupAddVisible: false, // 添加群组
        mu_type: 'G', // 账户类型 G:群组,U:后台账户
        groupName: '',
        permissionEditTitle: '编辑权限',
        permissionOptions: [], // 总权限bar
        permissionCheckedList: [], // 选中的权限
        permissionVisible: false, // 编辑权限
        permissionName: '', // 编辑的名称
        mum_user_sn: '', // 编辑时的user
        groups: [],
        pagination: {
            showQuickJumper: true,
            current: 1,
            pageSize: 0, // 每次请求回来得到条数pagesize去乘以总总页数得到总条数（假的总条数）
            total: 0 // 总条数
        }, // 分页参数
        loading: true // 请求数据时loading
    }
    componentWillMount() {
        this.fetch();
        this.getMenus();
    }
    // 获取菜单列表
    getMenus = async () => {
        let result = await request.send('/group/getmenulist', 'GET');
        if (result) {
            let {
                data
            } = result;
            let temp = {};
            Object.keys(data).map((key) => temp[data[key]] = key))
            this.setState({
                menus: temp,
                permissionOptions: Object.keys(temp)
            })
        }
    }
    // 添加群组，只有超级管理员可添加
    addGroup = () => {
        this.setState({
            groupAddVisible: true
        })
    }
    // 新增群组模态框确定
    handleGroupAddOk = async () => {
        const {
            groupName,
            mu_type
        } = this.state;
        if (!groupName || !groupName.trim()) {
            message.error('群组名不能为空');
        } else {
            let result = await request.send('/user/createuser', 'POST', {mu_name: groupName, mu_type});
            if (result) {
                message.success('创建成功');
                this.fetch();
                this.setState({
                    groupAddVisible: false,
                    groupName: '' // 重置
                })
            }
        }
    }
    // 新增群组模态框关闭
    handleGroupAddCancel = () => {
        this.setState({
            groupAddVisible: false
        })
    }
    // 输入群组名为空时，可清除
    emitEmpty = () => {
        this.groupNameInput.focus();
        this.setState({
            groupName: ''
        })
    }
    // 编辑权限模态框确定
    handlePermissionOk = async () => {
        let {permissionCheckedList, menus} = this.state;
        let mum_menu_sn = permissionCheckedList.map(name => menus[name]).join(',');
        let mum_user_sn = this.state.mum_user_sn;
        let result = await request.send('/group/editgroup', 'POST', {mum_menu_sn, mum_user_sn, '_method': 'PUT'})
        if (result) {
            message.success('编辑成功');
            this.fetch(); // 重新刷新列表
            this.handlePermissionCancel();
        }
    }
    // 编辑权限模态框取消
    handlePermissionCancel = () => {
        this.setState({
            permissionVisible: false
        })
    }
    // 编辑
    edit = (text, row, index) => {
        this.setState({
            mum_user_sn: this.state.groups[index].mu_sn,
            permissionCheckedList: row.permissions,
            permissionName: text,
            permissionVisible: true
        }, this.isCheckedAll)
    }
    // 选中checkbox
    onPermissionChange = (checkedList) => {
        const {permissionOptions} = this.state;
        this.setState({
            permissionCheckedList: checkedList
        }, this.isCheckedAll);
    }
    onPermissionCheckAll = (e) => {
        const {permissionOptions} = this.state;
        this.setState({
            permissionCheckedList: e.target.checked ? permissionOptions : [],
            checkAll: e.target.checked,
        });
    }
    isCheckedAll = () => {
        const {permissionOptions, permissionCheckedList} = this.state;
        this.setState({
            checkAll: permissionCheckedList.length === permissionOptions.length;
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
        let groupsResult = await request.send('/group/getgrouplist', 'GET', {page: this.state.pagination.current})
        if (groupsResult) {
            const {
                data: {
                    list = [],
                    page = 1, // 当前页数
                    page_count = 0 // 总页数
                }
            } = groupsResult;
            const groups = list.map((item) => {
                let menu_names = item.menu_name.split(',');
                return {
                    name: item.mu_name,
                    mu_sn: item.mu_sn,
                    // menus为前端定义的路由
                    // permissions: menus.filter((menu) => menu_names.indexOf(menu.name) !== -1)
                    permissions: menu_names.map(key => ({name: key}))
                }
            });
            this.setState({
                groups,
                pagination: {
                    current: +page,
                    pageSize: list.length,
                    total: page_count*list.length
                },
                loading: false
            })
        }
    }
    render() {
        const columns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },{
            title: '权限内容',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (tags: any[]) => (
                <span>
                  {tags.map(tag => <div key={tag}><Tag color="blue">{tag}</Tag></div>)}
                </span>
            )
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, row, index) => (<Button type="primary" icon="edit" size='small' onClick={() => this.edit(text, row, index)}>编辑</Button>))
        }]
        const dataSource = this.state.groups.map((group) => ({
            key: group.name,
            operation: group.name,
            name: group.name,
            permissions: group.permissions.map(item => item.name)
        }))
        const {
            permissionName, 
            permissionOptions,
            permissionCheckedList,
            permissionVisible,
            groupAddVisible,
            groupAddTitle,
            permissionEditTitle,
            groupName,
            loading,
            pagination
        } = this.state;
        const suffix = groupName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return (
            <div className="group-container">
                <div className="group">
                    <div className="add-btn">
                        <Button type="primary" onClick={this.addGroup}>新增群组</Button>
                    </div>
                    <Table 
                        columns={columns} 
                        dataSource={dataSource} 
                        loading={loading} 
                        pagination={pagination}
                        onChange={this.handleChange}/>
                </div>
                <Modal
                    title={groupAddTitle}
                    cancelText='取消'
                    okText='确认新建'
                    visible={groupAddVisible}
                    onOk={this.handleGroupAddOk}
                    onCancel={this.handleGroupAddCancel}
                    >
                    <Input
                        placeholder="输入群组名"
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={suffix}
                        value={groupName}
                        onChange={(e) => this.setState({groupName: e.target.value && e.target.value.trim()})}
                        ref={node => this.groupNameInput = node}
                    />
                </Modal>
                <Modal
                    title={permissionEditTitle}
                    cancelText='取消'
                    okText='确认修改'
                    visible={permissionVisible}
                    onOk={this.handlePermissionOk}
                    onCancel={this.handlePermissionCancel}
                    >
                    <h4>{permissionName}</h4>
                    <Row className='modal-row' style={{margin: '.2rem 0'}}>
                        <Checkbox
                            onChange={this.onPermissionCheckAll}
                            checked={this.state.checkAll}
                        >
                            全选
                        </Checkbox>
                    </Row>
                    <h4>菜单列表:</h4>
                    <div>
                        <CheckboxGroup options={permissionOptions} value={permissionCheckedList} onChange={this.onPermissionChange}/>
                    </div>
                </Modal>
            </div>
        )
    }
}