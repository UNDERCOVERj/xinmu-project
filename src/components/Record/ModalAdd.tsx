import * as React from 'react';
import {Form, Input, Modal, Radio} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class ModalAdd extends React.Component {
    private obuState = [
        {
            key_word: 'ok',
            descrption: '正常'
        },
        {
            key_word: 'reboot',
            descrption: '重启'
        },{
            key_word: 'ota',
            descrption: '执行OTA检查'
        },{
            key_word: 'alarm',
            descrption: '发出警报'
        },{
            key_word: 'format',
            descrption: '格式化'
        }
    ];
    render() {
        let {
            form: {getFieldDecorator}
            modalAddVisible,
            handleModalAddOk,
            handleModalAddCancel,
            formItemLayout
        } = this.props;
        return (
            <Modal
                title='添加uuid'
                visible={modalAddVisible}
                okText='确认'
                cancelText='取消'
                onOk={handleModalAddOk}
                onCancel={handleModalAddCancel}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="esim_id"
                    >
                        {getFieldDecorator('esimIdToAdd', {
                            rules: [{
                                required: true,
                                message: '请输入esim_id',
                                whitespace: true
                            }]
                        })(
                            <Input placeholder='请输入esim_id'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="uuid"
                    >
                        {getFieldDecorator('uuidToAdd', {})(
                            <Input placeholder='请输入uuid'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('infoToAdd', {})(
                            <Input placeholder='请输入备注'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('key_word', {
                            rules: [{
                                required: true,
                                message: '请输入状态'
                            }],
                            initialValue: 'ok'
                        })(
                            <RadioGroup>
                                {this.obuState.map((item) => <Radio key={item.key_word} value={item.key_word}>{item.descrption}</Radio>)}
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(ModalAdd);