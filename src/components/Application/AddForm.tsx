import * as React from 'react';
import {Modal, Form, Input, Select} from 'antd';
const FormItem = Form.Item;
const {Option} = Select;
class AddForm extends React.Component {
    resetFields() {
        this.form.resetFields()
    }
    render () {
        const {
            form: {getFieldDecorator},
            app_name,
            app_description,
            formItemLayout,
            applicationAddVisible,
            handleApplicationOk,
            handleApplicationCancel
        } = this.props;
        return (
            <Modal
                title='新增账户'
                cancelText='取消'
                okText='确认'
                visible={applicationAddVisible}
                onOk={handleApplicationOk}
                onCancel={handleApplicationCancel}
                >
                <Form>
                    <FormItem {...formItemLayout} label="名称">
                        {getFieldDecorator('app_name', {
                            rules: [{
                                required: true,
                                message: '名称不得为空',
                                whitespace: true
                            }],
                            initialValue: app_name
                        })(
                            <Input placeholder="请输入名称" name='app_name'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {getFieldDecorator('app_description', {
                            rules: [{
                                required: true,
                                message: '描述不得为空',
                                whitespace: true
                            }],
                            initialValue: app_description
                        })(
                            <Input placeholder="请输入描述" name='app_description'/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddForm)