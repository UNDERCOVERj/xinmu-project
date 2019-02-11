import axios from 'axios';
import {message} from 'antd';

interface ParamsInterface {
    [key: string]: any;
}

interface InterfaceConfig {
    data?: any; // 传输数据
    params?: any; // url参数
    url: string; // url
    method: string; // get/post
    headers?: {
        'Content-Type': string;
        token?: string;
    }
}

interface InterfaceError {
    config: any;
    request: any;
    response: any;
    message: string;
}

class Request {
    request: any;
    url: string;
    params: ParamsInterface;
    constructor() {
        this.request = axios.create({
            baseURL: 'http://xinmu-dev-elb-0951bf7cbc3bf987.elb.cn-northwest-1.amazonaws.com.cn:8800',
            timeout: 6000,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    download(url: string) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = '';
        document.body.appendChild(iframe);
        iframe.contentWindow.location.href = url;
    }
    send(url: string, method: string, params: ParamsInterface = {}) {
        // return this.sendDev(url);
        let data = {};
        method = method.toLowerCase();
        // 端口不一样！！
        if (url.indexOf('/v1') !== -1) {
            url = '/' + url;
        } else {
            url = '/api' + url;
        }
        let config: InterfaceConfig = {
            method,
            // /v1为别的接口
            url
        };
        if (method === 'open') {
            let lastTag = Object.keys(params).reduce((prev, cur) => {
                return prev + '&' + cur + '=' + params[cur];
            }, '')
            url += '?' + lastTag.slice(1);
            // window.open(url);
            this.download(url);
            return;
        } else if (method === 'post' || method === 'put') {
            data = new FormData();
            Object.keys(params).forEach(key => data.append(key, params[key]));
            config.data = data;
            config.headers = {"Content-Type": "multipart/form-data"};
        } else if (method === 'get') {
            config.params = params;
            config.headers = {"Content-Type": "application/x-www-form-urlencoded"};
        }
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }
        return axios(config)
                .then((res: any) => {
                    return new Promise((resolve, reject) => {
                        if (res.status >= 200 || res.status < 300) {
                            // ota包的一个接口
                            if (res.data.status_code === 0) {

                            } else if ((res.data.status_code < 200 || res.data.status_code >= 300)) {
                                message.warn(res.data.message);
                                reject();
                                return;
                            }
                            resolve(res.data);
                        }
                    })
                })
                .catch((err: InterfaceError) => {
                    return new Promise((resolve, reject) => {
                        if (err && err.response && err.response.status === 401) {
                            message.error('登录认证失败'); // "Unauthorized"
                            location.replace('#/login'); // 跳到登录页
                        }
                        if (err && err.response && err.response.status !== 200) {
                            // message.error(url + ' fail');
                            if (err.response.data && err.response.data.message) {
                                message.error(err.response.data.message);
                            } else {
                                message.error(err.message);
                            }
                        }
                        resolve(null);
                    })
                })
    }
    // sendDev(url) {
    //     url = url.replace(/\//g, '_') + '.json';
    //     // console.log(url)
    //     return new Promise((resolve, reject) => {
    //         let res = require(`./mock/${url}`);
    //         setTimeout(() => {resolve(res)}, 500)
    //     })
    //     .catch((err) => {
    //         alert('error')
    //     })
    // }
}

export default new Request();