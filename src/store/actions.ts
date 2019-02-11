import {GET_LIST, ADD_LIST} from './constants';

export const addList = (item) => {
    return {
        type: ADD_LIST,
        item
    }
}

export const changeObu = (item: any) => {
    return {
        type: 'changeObu',
        item
    }
}

export const changeRecord = (item: any) => {
    return {
        type: 'changeRecord',
        item
    }
}