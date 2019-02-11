import * as React from 'react';
import {Modal, Radio, Form} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
interface UpdateObuProps {
    updateObuVisible: boolean;
    updateObuOk(params: any): void;
    updateObuCancel(): void;
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
    ]
    constructor(props: UpdateObuProps) {
        super(props);
    }
    updateObuOk = () => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                let {key_word} = values;
                let params = this.obuState.find(item => item.key_word === key_word);
                this.props.updateObuOk(params);
            }
        })
    }
    render() {
        let {
            form: {getFieldDecorator},
            updateObuVisible,
            updateObuOk,
            updateObuCancel
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
                        label="状态"
                    >
                        {getFieldDecorator('key_word', {
                            rules: [{
                                required: true,
                                message: '状态'
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

export default Form.create<{}>()(UpdateObu)