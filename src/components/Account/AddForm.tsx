import * as React from 'react';
import {Modal, Form, Input, Select} from 'antd';
const FormItem = Form.Item;
const {Option} = Select;
class AddForm extends React.Component {
    resetFields() {
        this.form.resetFields()
    }
    // resetForm() {
    //     this.form.resetForm();
    // }
    render () {
        const {
            form: {getFieldDecorator},
            accountAddVisible,
            handleAccountOk,
            handleAccountCancel,
            formItemLayout,
            groups,
            mu_name,
            mu_pwd,
            mu_email,
            groupName
        } = this.props;
        return (
            <Modal
                title='新增账户'
                cancelText='取消'
                okText='确认'
                visible={accountAddVisible}
                onOk={handleAccountOk}
                onCancel={handleAccountCancel}
                >
                <Form>
                    <FormItem {...formItemLayout} label="账号">
                        {getFieldDecorator('mu_name', {
                            rules: [{
                                required: true,
                                message: '账号不得为空',
                                whitespace: true
                            }],
                            initialValue: mu_name
                        })(
                            <Input placeholder="请输入账号" name='mu_name'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码">
                        {getFieldDecorator('mu_pwd', {
                            rules: [{
                                required: true,
                                message: '密码不能为空',
                                whitespace: true
                            }],
                            initialValue: mu_pwd
                        })(
                            <Input placeholder="请输入密码" type='password' name='mu_pwd'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="邮件地址">
                        {getFieldDecorator('mu_email', {
                            rules: [{
                                required: true,
                                message: '邮件不得为空',
                                whitespace: true
                            }],
                            initialValue: mu_email
                        })(
                            <Input placeholder="请输入邮件" type='email' name='mu_email'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所属群组"
                        hasFeedback>
                        {getFieldDecorator('groupName', {
                            rules: [{ required: true, message: '请选择群组' }],
                            initialValue: groupName
                        })(
                            <Select placeholder="所属群组">
                                {groups.map(group => (<Option value={group.name} key={group.name}>{group.name}</Option>))}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddForm)