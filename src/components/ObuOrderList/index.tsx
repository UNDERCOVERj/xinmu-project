import * as React from 'react';
import { withRouter } from "react-router";
import {Table, Button, Icon, Tooltip} from 'antd';
import Back from '@src/components/Back';
import ModalDetail from './ModalDetail';
import ModalWheelPath from './ModalWheelPath';
import request from '@src/utils/request';
import {getLocationParams, getJumpurl} from '@src/utils/utils';
import {History, Location} from '@src/interface';
import './index.scss';
import {changeObu} from '@src/store/actions';
import { connect } from "react-redux";
interface ObjOrderListProps {
    history: History;
    location: Location;
    dispatch(item: any): void;
    list: any[];
    dataSource: any[];
    pagination: any;
    loading: boolean;
    modalDetailVisible: boolean;
    modalDetailTitle: string;
    modalDetailDataSource: any[];
    modalWheelPathVisible: boolean; // 热力图
    modalWheelPathAddTime: number;
}
class ObuOrderList extends React.Component<ObjOrderListProps, {}> {
    state = {
        uuid: '', // uid
        esim_id: '',
        spinningLoading: false, // 点击清单列表按钮
    }
    constructor(props: ObjOrderListProps) {
        super(props);
    }
    componentWillMount() {
        let search = this.props.location.search;
        let params = getLocationParams(search);
        if (this.props.history.action.toLowerCase() === 'push') {
            this.props.dispatch(changeObu({
                pagination: {
                    showQuickJumper: true,
                    current: 1, 
                    pageSize: 0, // 每次请求回来得到条数pagesize去乘以总总页数得到总条数（假的总条数）
                    total: 0 // 总条数
                }
            }))
            this.setState({...params}, () => this.fetch(1));
        } else {
            this.setState({...params}, () => this.fetch());
        }
    }
    // 请求数据
    async fetch(forcedCur?: any) {
        // 获取行车记录列表
        this.props.dispatch(changeObu({loading: true})); // 请求前loading
        let {
            uuid
        } = this.state;
        let {
            pagination: {
                current
            }
        } = this.props;
        if (forcedCur) {
            current = forcedCur;
        }
        let obuListResult = await request.send('/obu/getorderlist', 'GET', {page: current, uuid});
        if (obuListResult) {
            const {
                data: {
                    list = [],
                    page = 1, // 当前页数
                    page_count = 0 // 总页数
                }
            } = obuListResult;
            this.props.dispatch(changeObu({
                list,
                pagination: {
                    current: +page,
                    pageSize: list.length,
                    total: page_count*list.length
                },
                loading: false
            }));
            this.updateDataSource();
        }
    }
    // 点击某一页
    handleChange = (paginationToChange, filters, sorter) => {
        let {current} = paginationToChange;
        let {pagination} = this.props;
        if (paginationToChange.current !== pagination.current) { // 避免排序影响
            pagination.current = paginationToChange.current;
            this.props.dispatch(changeObu({
                pagination
            }));
            this.fetch();
        }
    }
    updateDataSource() {
        let dataSource = this.props.list.map((item) => ({
            key: item.id,
            oid: item.oid, // 用于获取行车路径
            obu_var: item.obu_var,
            add_time: new Date(+item.add_time*1000).toLocaleString(),
            add_time_Date_string: +new Date(+item.add_time*1000), // 供排序用
            loading: false
        }))
        this.props.dispatch(changeObu({dataSource}))
    }
    // show 视频列表
    showModalDetail = (text, row, index) => {
        // request.send()
        // this.setState({
        //     spinningLoading: true
        // })
        // this.setState({
        //     // spinningLoading: false // 关闭spin
        // })
        this.props.dispatch(changeObu({
            modalDetailDataSource: this.props.list[index].desc || [],
            modalDetailTitle: row.oid,
            modalDetailVisible: true,
        }))
    }
    // hide 视频列表
    hideModalDetail =() => {
        this.props.dispatch(changeObu({
            modalDetailTitle: '',
            modalDetailVisible: false
        }))
    }
    // 显示行车轨迹
    showModalWheelPath = (text: string, row: any, index: number) => {
        // let modalWheelPathAddTime = this.state.dataSource[index].add_time;
        this.props.dispatch(changeObu({
            modalWheelPathVisible: true
        }))
        this.refs.modalWheelPath.getDataAndUpdate(row.oid);
    }
    onCloseWrapper = () => {
        this.props.dispatch(changeObu({
            modalWheelPathVisible: false
        }))
    }
    gotoWater = (text: string, row: any, index: number) => {
        let {oid} = this.props.list[index];
        const {esim_id} = this.state;
        this.props.history.push(getJumpurl({esim_id, oid}, '/index/water'));
    }
    render() {
        const columns = [{
            title: '主行程编号',
            key: 'oid',
            dataIndex: 'oid',
            className: 'table-row'
        },{
            title: '版本号',
            key: 'obu_var',
            dataIndex: 'obu_var',
            className: 'table-row'
        },{
            title: '行程建立时间',
            key: 'add_time',
            dataIndex: 'add_time',
            defaultSortOrder: 'descend',
            className: 'table-row',
            sorter: (a, b) => +a.add_time_Date_string - +b.add_time_Date_string // 排序
        },{
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            className: 'table-row',
            render: (text, row, index) => (<div>
                 <Tooltip placement="top" title='行程列表'>
                    <Button type='primary' className='operate-btn' size='small' onClick={() => {this.showModalDetail(text, row, index)}}>
                        <Icon type="bars" />
                    </Button>
                 </Tooltip>
                 <Tooltip placement="top" title='行车轨迹'>
                    <Button type='primary' className='operate-btn' size='small' onClick={() => {this.showModalWheelPath(text, row, index)}}>
                        <Icon type="heat-map" />
                    </Button>
                 </Tooltip>
                 <Tooltip placement="top" title='查看图片'>
                    <Button type='primary' size='small' onClick={() => {this.gotoWater(text, row, index)}}>
                        <Icon type="video-camera" />
                    </Button>
                 </Tooltip>
            </div>)
        }]
        const {
            uuid,
            esim_id
            // spinningLoading
        } = this.state;
        let {
            dataSource, 
            pagination, 
            loading,
            modalDetailVisible, 
            modalDetailTitle, 
            modalDetailDataSource,
            modalWheelPathVisible,
            modalWheelPathAddTime
        } = this.props;
        return (
            <div className="objOrderList">
                <Back goBack={this.props.history.goBack}/>
                <div className='objOrderList-title'>
                    <div>清单记录列表</div>
                    <div className="objOrderList-info objOrderList-row">
                        <div>用户编号：&nbsp;<span>{uuid}</span></div>
                        <div>esim_id: &nbsp;<span>{esim_id}</span></div>
                    </div>
                </div>
                
                {/* <Spin spinning={spinningLoading}> */}
                    <Table
                        className='objOrderList-row'
                        columns={columns} 
                        dataSource={dataSource}
                        loading={loading}
                        onChange={this.handleChange}
                        pagination={pagination}/>
                {/* </Spin> */}
                <ModalDetail
                    fetch={this.fetch}
                    history={this.props.history}
                    modalDetailVisible={modalDetailVisible} 
                    modalDetailTitle={modalDetailTitle} 
                    hideModalDetail={this.hideModalDetail}
                    modalDetailDataSource={modalDetailDataSource}/>
                <ModalWheelPath 
                    ref='modalWheelPath'
                    onCloseWrapper={this.onCloseWrapper}
                    modalWheelPathVisible={modalWheelPathVisible} 
                    modalWheelPathAddTime={modalWheelPathAddTime}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    ...state.obuOrderListState
})

export default withRouter(connect(mapStateToProps)(ObuOrderList))