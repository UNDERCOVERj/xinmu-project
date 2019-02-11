import * as React from 'react';
import {DatePicker, Form, Input, Button} from 'antd';
const {RangePicker} = DatePicker;
const FormItem = Form.Item;

class Search extends React.Component {
    state = {
        loading: false // 搜索loading
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                let {
                    esim_id,
                    rangePicker: [startDate, endDate]
                } = fieldsValue;
                let startDateStr = Math.round(+startDate.toDate()/1000);
                let endDateStr = Math.round(+endDate.toDate()/1000);
                this.props.setAddition({
                    startDateStr,
                    endDateStr,
                    search_esim_id: esim_id
                })
            }
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
            style: {
                marginBottom: 0
            }
        };
        let {loading} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="search">
                <Form onSubmit={this.handleSubmit} layout='inline'>
                    <FormItem
                        {...formItemLayout}
                        label="时间选择"
                    >
                        {getFieldDecorator('rangePicker', {
                            rules: [{ type: 'array', required: true, message: '请选择时间' }],
                        })(
                            <RangePicker />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="esim_id"
                    >
                        {getFieldDecorator('esim_id', {
                            rules: [{required: true, message: '请输入esim_id'}],
                        })(
                            <Input placeholder='请输入esim_id'/>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 12, offset: 5 }}
                    >
                        <Button type="primary" size='small' htmlType="submit" icon="search" loading={loading}>
                            搜索
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
export default Form.create()(Search)