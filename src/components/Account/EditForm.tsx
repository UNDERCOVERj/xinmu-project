import * as React from 'react';
import {Modal, Form, Input, Select, Radio, Spin} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;

class EditForm extends React.Component {
    resetFields() {
        this.form.resetFields()
    }
    render() {
        let {
            form: {getFieldDecorator},
            groups,
            app_id,
            mu_name,
            mu_valid,
            groupName,
            formItemLayout,
            editAccountAddVisible,
            editHandleAccountOk,
            editHandleAccountCancel,
            onValidChange,
            apps,
            editAccountAddSpinning
        } = this.props;
        return (
                <Modal
                    title='编辑账户'
                    cancelText='取消'
                    okText='确认'
                    visible={editAccountAddVisible}
                    onOk={editHandleAccountOk}
                    onCancel={editHandleAccountCancel}
                    >
                    <Spin spinning={editAccountAddSpinning}>
                    <Form>
                        <FormItem {...formItemLayout} label='账号'>
                            {getFieldDecorator('mu_name', {
                                rules: [{
                                    required: true,
                                    message: '账号不得为空',
                                    whitespace: true
                                }],
                                initialValue: mu_name
                            })(
                                <Input placeholder='请输入账号' name='mu_name' />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='状态'>
                            {/*这儿的默认值可能由问题*/}
                            {getFieldDecorator('mu_valid', {
                                initialValue: mu_valid
                            })(
                                <RadioGroup onChange={(e) => onValidChange(e)}>
                                    <Radio value={'Y'}>激活</Radio>
                                    <Radio value={'N'}>封锁</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="所属应用"
                            hasFeedback>
                            {getFieldDecorator('app_id', {
                                rules: [{ required: true, message: '请选择应用' }],
                                initialValue: app_id
                            })(
                                <Select placeholder="所属应用">
                                    {apps.map(app => (<Option value={app.id} key={app.id}>{app.app_name}</Option>))}
                                </Select>
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
            </Spin>
                </Modal>
        )
    }
}

export default Form.create()(EditForm);