import * as React from 'react';
import { withRouter } from "react-router";
import { Form, Input, Col, Row, Icon, Button, Spin } from 'antd';
import request from '@src/utils/request';
import Verify from '@src/utils/verify.js';
import {menus} from '@src/route/index';
import {History, Match} from '@src/interface';
import './index.scss';
const FormItem = Form.Item;

interface LoginFormProps {
    form: any;
    history: History;
    match: Match;
}
interface LoginFormState {
    code: string;
    loading: boolean;
    loadingText: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
    verifyCode: any;
    state = {
        code: '', //验证码
        loading: false,
        loadingText: 'Login'
    }
    constructor(props: LoginFormProps) {
        super(props);
    }
    componentDidMount () {
        this.verifyCode = new Verify('v_container')
    }
    componentWillUnmount () {
        this.verifyCode = null
    }
    submit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields(async (err: any, values: any) => {
            if (!err) {
                this.showSpin();
                let {
                    userName,
                    password
                } = values;
                let params = {
                    mu_name: userName, 
                    mu_pwd: password
                };
                // 获取用户app_id和app_secret
                let userapp = await request.send('/user/getuserapp', 'GET', {mu_name: userName});
                if (userapp) {
                    let {data: {app_id, app_secret}} = userapp;
                    let app_token = await request.send('/Token/app_token', 'POST', {app_id, app_secret});
                    if (app_token) {
                        let {data: {token}} = app_token;
                        localStorage.setItem('token', token);
                        try {
                            let user = await request.send('/user/login', 'POST', params);
                            if (user) {
                                let {
                                    data: {
                                        menu,
                                        mu_sn,
                                        mu_name
                                    }
                                } = user;
                                // mm_name!
                                let userMenus = menu.map(item => item.mm_name);
                                let filteredUserMenus = userMenus.filter(item => (menus.some(menu => item === menu.name)));
                                localStorage.setItem('app_id', app_id);
                                localStorage.setItem('app_secret', app_secret);
                                localStorage.setItem('mu_sn', mu_sn);
                                localStorage.setItem('mu_name', mu_name);
                                localStorage.setItem('userMenus': JSON.stringify(filteredUserMenus));
                                let pathItem = menus.find(item => item.name === filteredUserMenus[0]);
                                this.props.history.push(pathItem.path);
                            } else {
                                this.setState({
                                    loading: false,
                                    loadingText: 'Login'
                                })
                            }
                        } catch(e) {}
                    }
                }
            }
        });
    }
    // 给LoginForm的span标识，点击login时展示
    showSpin = () => {
        this.setState({
            loading: true,
            loadingText: 'Logining...'
        })
    }
    render () {
        const {getFieldDecorator} = this.props.form;
        const {loading, loadingText} = this.state;
        // 呈现error
        return (
            <Spin spinning={loading}>
                <div className="container">
                    <div className="login-form">
                        <h3 className='title'>Administrator login</h3>
                        <Form onSubmit={this.submit}>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: 'Please input your username', whitespace: true }],
                                })(
                                    <Input
                                        placeholder='Username'
                                        addonBefore={<Icon type="user" />}
                                        size='small'/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: 'Please input your password!', whitespace: true}]
                                })(
                                    <Input
                                        placeholder='Password'
                                        addonBefore={<Icon type="lock" />}
                                        type='password'
                                        size='small'/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('verification', {
                                    validateFirst: true,
                                    rules: [
                                        {required: true, message: 'Please input the code', whitespace: true},
                                        {
                                            validator: (rule: any, value: any, callback: (str?: string) => void) => {
                                                if (!this.verifyCode.validate(value)) {
                                                    callback('verification code error')
                                                }
                                                callback()
                                            }
                                        }
                                    ]
                                })(
                                    <Row gutter={8} align='middle' type='flex'>
                                        <Col span={16}>
                                        <Input
                                            placeholder='Verification code'
                                            addonBefore={<Icon type="safety" />}
                                            size='small'/>
                                        </Col>
                                        <Col span={8}>
                                            <div id='v_container' style={{height: 40}}/>
                                        </Col>
                                    </Row>
                                )}
                            </FormItem>
                            <div className="bottom">
                                <Button type='primary' block ghost='true' htmlType="submit">{loadingText}</Button>
                            </div>
                            <div className="endnote">
                                <span>Copyright © 2018 Xinmu</span>
                            </div>
                        </Form>
                    </div>
                </div>
            </Spin>
        )
    }
}

export default withRouter(Form.create()(LoginForm))