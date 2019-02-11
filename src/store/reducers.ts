import {GET_LIST, ADD_LIST} from './constants';
// 根state
const initialListState = {
    list: [{
        a: 'lalaal'
    }]
}

const initialObuOrderListState = {
    pagination: {
        showQuickJumper: true,
        current: 1, 
        pageSize: 0, // 每次请求回来得到条数pagesize去乘以总总页数得到总条数（假的总条数）
        total: 0 // 总条数
    },
    list: [],
    loading: false,
    dataSource: [],
    modalDetailDataSource: [],
    modalDetailTitle: '',
    modalDetailVisible: false,
    modalWheelPathVisible: false,
    modalWheelPathAddTime: 0
}

const initialRecordState = {
    list: [], // 行车数据
    pagination: {
        showQuickJumper: true,
        current: 1,
        pageSize: 0, // 每次请求回来得到条数pagesize去乘以总总页数得到总条数（假的总条数）
        total: 0 // 总条数
    }, // 分页参数
    loading: true, // 请求数据时loading
    searchEsimId: ''
}

interface InterfaceAction {
    type: string;
    item?: {
        [key: string]: any;
    }
}

interface InterfaceObuAction {
    type: string;
    item: any;
}

export const listState = (state = initialListState, action:InterfaceAction) => {
    switch(action.type) {
        case ADD_LIST:
            return {
                list: [...state.list, action.item]
            };
        default:
            return state;
    }
}

export const obuOrderListState = (state = initialObuOrderListState, action: InterfaceObuAction) => {
    switch(action.type) {
        case 'changeObu':
            return {...state, ...action.item}
        default:
            return state;
    }
}

export const recordState = (state = initialRecordState, action: InterfaceObuAction) => {
    switch(action.type) {
        case 'changeRecord':
            return {...state, ...action.item}
        default:
            return state;
    }
}