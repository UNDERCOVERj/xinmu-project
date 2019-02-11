import * as React from 'react';
import {Table, Button, Icon, Tooltip, message} from 'antd';
import request from '@src/utils/request';
import { withRouter } from "react-router";
import ModalAdd from './ModalAdd';
import UpdateObu from './UpdateObu';
import ExcelExport from './ExcelExport';
import Search from './Search';
import './index.scss';
import {History, Location, Match} from '@src/interface';
import {changeRecord} from '@src/store/actions';
import { connect } from "react-redux";

const formItemLayout = { // 表单定位
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
interface RecordProps {
    history: History;
    location: Location;
    match: Match;
    dispatch(item: any): void;
    pagination: any;
    loading: boolean;
    searchEsimId: string;
    list: any[];
}
interface ModalAddParams {
    esim_id: string;
    info?: string;
    uuid?: string;
    key_word: string;
}
interface FetchParams {
    page: number;
    mu_sn: string;
    esim_id?: string;
}

class Record extends React.Component<RecordProps, {}> {
    private modalAdd: any;
    updateObu: any;
    private cache: any = {};
    state = {
        // search条件
        // startDateStr: '',
        // endDateStr: '',
        // search_esim_id: ''
        modalAddVisible: false, // 添加modal的flag
        searchBtnLoading: false, // 按钮loading
        updateObuVisible: false, // 更改状态modal
        ExcelExportVisible: false, // 行车数据下载modal
        updateObuInfo: {
            uuid: '',
            info: '',
            key_words: '',
            id: '',
            esim_id: '',
            push_status: 0
        }
    }
    constructor(props: RecordProps) {
        super(props);
    }
    componentWillMount() {
        this.fetch();
    }
    // 跳转到行程清单
    goToSchedule(text: string, row: any, index: number) {
        let {
            uuid,
            esim_id
        } = row;
        this.props.history.push(`/index/obuOrderList?uuid=${uuid}&esim_id=${esim_id}`)
    }
    // 请求数据
    async fetch(cb?: () => void): Promise<any> {
        // 获取行车记录列表
        // this.setState({loading: true}); // 请求前loading
        this.props.dispatch(changeRecord({loading: true}));
        let {pagination, searchEsimId} = this.props;
        // let {pagination, startDateStr, endDateStr, search_esim_id} = this.state;
        let params: FetchParams = {
            page: pagination.current, 
            mu_sn: localStorage.getItem('mu_sn')
        };
        if (searchEsimId) {
            params.esim_id = searchEsimId;
        }
        // if (startDateStr && endDateStr && search_esim_id) {
        //     pagination.current = 1;
        //     params = Object.assign({}, params, {
        //         start_add_time: startDateStr,
        //         end_add_time: endDateStr,
        //         esim_id: search_esim_id,
        //         page: 1
        //     })
        //     // page置为1
        //     this.setState({
        //         pagination
        //     })
        // }
        try {
            // 非搜索时缓存
            // let obuListResult = this.cache[pagination.current];
            // if (!obuListResult || searchEsimId) {
            //     obuListResult = await request.send('/obu/getobulist', 'GET', params);
            //     if (obuListResult && !searchEsimId) {
            //         this.cache[pagination.current] = obuListResult;
            //     }
            // }
            let obuListResult = await request.send('/obu/getobulist', 'GET', params);
            if (obuListResult) {
                let {data} = obuListResult;
                if (!data.list) {
                    data = {
                        list: [data] // 兼容搜索
                    }
                }
                let {
                    list = [],
                    page = 1, // 当前页数，搜索时没有
                    page_count = 0 // 总页数
                } = data;
                this.props.dispatch(changeRecord({
                    list,
                    pagination: {
                        current: +page,
                        pageSize: list.length,
                        total: page_count*list.length
                    },
                    loading: false
                }));
                cb && cb();
            } else {
                this.setState({searchBtnLoading: false})
                this.props.dispatch(changeRecord({
                    loading: false
                }))
            }
        } catch(e) {
            this.setState({searchBtnLoading: false});
            this.props.dispatch(changeRecord({
                loading: false
            }))
        }
    }
    // 点击某一页
    handleChange = (paginationToChange, filters, sorter) => {
        let {current} = paginationToChange;
        let {pagination} = this.props;
        if (pagination.current !== current) {
            pagination.current = current;
            this.props.dispatch(changeRecord({
                pagination
            }));
            this.fetch();
        }
    }
    // 选择时间和esim_id
    // setAddition = (additions) => {
    //     this.setState({...additions}, this.fetch); // 搜索
    // }
    // 重置
    reset = () => {
        let {pagination} = this.props;
        pagination.current = 1;
        this.props.dispatch(changeRecord({
            pagination
        }))
        this.setState({
            start_add_time: '',
            end_add_time: '',
            esim_id: '',
            page: 1
        }, this.fetch)
    }
    // 显示添加框
    showModalAdd = () => {
        this.setState({
            modalAddVisible: true
        })
    }
    // 确认添加
    handleModalAddOk = () => {
        this.modalAdd.validateFields(async (err: any, values: any): Promise<any> => {
            if (!err) {
                let {
                    esimIdToAdd = '',
                    infoToAdd = '',
                    uuidToAdd = '',
                    key_word = '' // 状态
                } = values;
                let params: ModalAddParams = {esim_id: esimIdToAdd.trim(), key_word};
                if (infoToAdd) {
                    params.info = infoToAdd.trim();
                }
                if (uuidToAdd) {
                    params.uuid = uuidToAdd.trim();
                }
                try {
                    let result = await request.send('/reg/bing', 'POST', params);
                    if (result) {
                        message.success('添加成功');
                        this.fetch();
                        this.handleModalAddCancel();
                    }
                } catch(e) {}

            }
        })
    }
    // 取消添加
    handleModalAddCancel = () => {

        this.setState({
            modalAddVisible: false
        })
    }
    // 搜索
    handleSearchSubmit = ({searchEsimId = ''}) => {
        this.props.dispatch(changeRecord({
            searchEsimId
        }))
        this.setState({
            searchBtnLoading: true, // button loading
        }, () => this.fetch(() => {
            this.setState({
                searchBtnLoading: false
            })
        }))
    }
    updateObuOk = async (params: any) => {
        try {
            let result = await request.send('/reg/update', 'POST', params);
            if (result) {
                message.success('修改成功');
                this.fetch();
                this.setState({
                    updateObuVisible: false
                })
            }
        } catch(e) {}
    }
    updateObuCancel = () => {
        this.setState({
            updateObuVisible: false
        })
    }
    showUpdateInfoModal = (text: string, row: any, index: number) => {
        let {push_status} = this.state.updateObuInfo;
        let {
            uuid,
            info,
            key_words,
            id,
            esim_id
        } = row;
        this.updateObu.setValue(uuid, info, key_words, push_status);
        this.setState({
            updateObuInfo: {
                uuid,
                info,
                key_words,
                id,
                esim_id,
                push_status
            }
        }, () => this.setState({updateObuVisible: true}))
    }
    showExcelExport = () => {
        this.setState({
            ExcelExportVisible: true
        })
    }
    closeExcelExport = () => {
        this.setState({
            ExcelExportVisible: false
        })
    }
    render() {
        const columns = [{
            title: '用户编号（uuid）',
            key: 'uuid',
            dataIndex: 'uuid',
            className: 'table-row'
        },{
            title: 'esim_id',
            key: 'esim_id',
            dataIndex: 'esim_id',
            className: 'table-row'
        },{
            title: 'info',
            key: 'info',
            dataIndex: 'info',
            className: 'table-row',
            defaultSortOrder: 'descend',
            sorter: (a: any, b: any) => (a.info || '').localeCompare(b.info || '') ? true : false // 排序
        },{
            title: '状态',
            key: 'online_status',
            dataIndex: 'online_status',
            className: 'table-row',
            render: (text: number) => {
                return text === 0 
                            ? (<Tooltip placement="top" title='离线'>
                                <div className='red-dot'></div>
                            </Tooltip>) 
                            : (<Tooltip placement="top" title='在线'>
                                <div className='green-dot'></div>
                            </Tooltip>)
            }
        },{
            title: '操作',
            key: 'schedule',
            dataIndex: 'schedule',
            className: 'table-row',
            render: (text: string, row: any, index: number) => (
                <React.Fragment>
                    <Tooltip placement="top" title='行程清单'>
                        <Button style={{marginRight: '.1rem'}} size='small' type='primary' onClick={() => this.goToSchedule(text, row, index)}>
                            <Icon type="bars" />
                        </Button>
                    </Tooltip>
                    <Tooltip placement="top" title='修改状态'>
                        <Button size='small' type='primary' onClick={() => this.showUpdateInfoModal(text, row, index)}>
                            <Icon type="edit" />
                        </Button>
                    </Tooltip>
                </React.Fragment>
            )
        }]
        let dataSource = this.props.list.map((item) => ({
            key: item.uuid,
            uuid: item.uuid,
            online_status: +item.online_status,
            esim_id: item.esim_id,
            info: item.info,
            id: item.id,
            key_words: item.key_words
        }))
        let {modalAddVisible, searchBtnLoading, updateObuVisible, updateObuInfo, ExcelExportVisible} = this.state;
        let {pagination, loading, searchEsimId} = this.props;
        return (
            <div className="record">
                <div className='record-title record-row'>
                    <span onClick={() => this.reset()} className='record-title-span'>行程记录列表</span>
                    <Tooltip placement="top" title='导出行车数据'>
                        <Button type='primary' size='small' onClick={() => this.showExcelExport()} className='record-title-btn' icon='export'>行车数据</Button>
                    </Tooltip>
                    <Button type='primary' size='small' onClick={() => this.showModalAdd()} className='record-title-btn' icon='folder-add'>添加</Button>
                    <Search
                        searchEsimId={searchEsimId}
                        handleSearchSubmit={this.handleSearchSubmit}
                        searchBtnLoading={searchBtnLoading}/>
                    {/* <Search
                        setAddition={this.setAddition}/> */}
                </div>
                
                <Table
                    className='record-row'
                    columns={columns} 
                    dataSource={dataSource}
                    loading={loading}
                    onChange={this.handleChange}
                    pagination={pagination}/>
                <ModalAdd
                    formItemLayout={formItemLayout}
                    ref={(modalAdd: any) => this.modalAdd = modalAdd}
                    handleModalAddOk={this.handleModalAddOk}
                    handleModalAddCancel={this.handleModalAddCancel}
                    modalAddVisible={modalAddVisible}/>
                <UpdateObu
                    wrappedComponentRef={(updateObu: any) => this.updateObu = updateObu}
                    formItemLayout={formItemLayout}
                    updateObuInfo={updateObuInfo}
                    updateObuVisible={updateObuVisible}
                    updateObuOk={this.updateObuOk}
                    updateObuCancel={this.updateObuCancel}/>
                <ExcelExport 
                     ExcelExportVisible={ExcelExportVisible}
                     closeExcelExport={this.closeExcelExport}
                     formItemLayout={formItemLayout}/>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    ...state.recordState
})

export default withRouter(connect(mapStateToProps)(Record))