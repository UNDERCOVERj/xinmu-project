
/**
 * 从serach中获取key, value
 * @param {string} search location.search --> ?a=1&b=2
 * @returns {object}
 */

interface InterfaceParams {
    [key: string]: string;
}
export function getLocationParams(search: string): InterfaceParams {
    let params: InterfaceParams = {};
    let idx = search.indexOf('?');
    if (idx > -1) {
        search.slice(idx + 1).split('&').map(item => {
            let words = item.split('=');
            params[decodeURIComponent(words[0])] = decodeURIComponent(words[1]);
        });
    }
    return params
}

export function getJumpurl(params: any, url: string): string {
    let prefixUrl = Object.keys(params).reduce((prev, cur) => `${prev}&${cur}=${encodeURIComponent(params[cur])}`, '');
    return `${url}?${prefixUrl.slice(1)}`;
}

/**
 * 转换txt中的数据，过滤timestamp，返回0、1、2、3。。。这样
 * @param {Array} drivingTxtData
 * @result {Object}
 */

export function filteredDrivingTxtData(drivingTxtData = []) {
    let result = {};
    drivingTxtData.forEach((item) => {
        if (item.timestamp && item.timestamp.length) {
            let temp = item.timestamp.split('.')[0];
            let last = +temp.split(':')[2];
            // item.timestamp = last;
            if (!result[last] && last < 30) {
                result[last] = {
                    timestamp: item.timestamp,
                    visibility: item.visibility,
                    crowding: item.crowding,
                    land: item.land,
                    objects: (item.objects || []).filter(item => !!item);
                };
            }
        }
    })
    return result;
}