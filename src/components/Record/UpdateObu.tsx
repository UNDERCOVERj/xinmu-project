import * as React from 'react';
import {Modal, Radio, Form, Input} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
interface UpdateObuProps {
    updateObuVisible: boolean;
    updateObuOk(params: any): void;
    updateObuCancel(): void;
    updateObuInfo: {
        uuid: string;
        info: string;
        key_words: string;
        id: string;
        esim_id: string;
        push_status: number;
    };
    formItemLayout: any;
    form: any;
}

class UpdateObu extends React.Component<UpdateObuProps, {}> {
    private obuState = [
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
        },{
            key_word: 'ok',
            descrption: '正常'
        }
    ];
    private pushStatus = [
        {
            name: '原本的视频上传',
            value: 0
        },{
            name: '只传行车数据',
            value: 1
        }
    ];
    constructor(props: UpdateObuProps) {
        super(props);
    }
    updateObuOk = () => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                let {
                    updateObuInfo: {
                        uuid,
                        info,
                        id,
                        esim_id
                    }
                } = this.props;
                let {key_words, push_status} = values;
                this.props.updateObuOk({id, esim_id, key_words, info, uuid, push_status});
            }
        })
    }
    public setValue = (uuid: string, info: string, key_words: string, push_status: number) => {
        this.props.form.setFieldsValue({
            uuid,
            info,
            key_words,
            push_status
        })
    }
    render() {
        let {
            form: {getFieldDecorator},
            updateObuVisible,
            updateObuOk,
            updateObuCancel,
            updateObuInfo: {
                uuid,
                info,
                key_words,
                id,
                esim_id,
                push_status
            },
            formItemLayout
        } = this.props;
        return (
            <Modal
                title='改变状态'
                visible={updateObuVisible}
                okText='确认'
                cancelText='取消'
                onOk={this.updateObuOk}
                onCancel={updateObuCancel}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="uuid"
                    >
                        {getFieldDecorator('uuid', {
                            initialValue: uuid
                        })(
                            <Input type="text" disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="info"
                    >
                        {getFieldDecorator('info', {
                            initialValue: info
                        })(
                            <Input type="text" disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态">
                        {getFieldDecorator('key_words', {
                            rules: [{
                                required: true,
                                message: '状态'
                            }],
                            initialValue: key_words
                        })(
                            <RadioGroup>
                                {this.obuState.map((item) => <Radio key={item.key_word} value={item.key_word}>{item.descrption}</Radio>)}
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传类型">
                        {getFieldDecorator('push_status', {
                            rules: [{
                                required: true,
                                message: '上传类型'
                            }],
                            initialValue: push_status
                        })(
                            <RadioGroup>
                                {this.pushStatus.map((item, idx) => <Radio key={idx} value={item.value}>{item.name}</Radio>)}
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create<{}>()(UpdateObu)