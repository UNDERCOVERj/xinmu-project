import * as React from 'react';
import {Form, DatePicker, Button, Input} from 'antd'
const {Item: FormItem} = Form;
// const { RangePicker } = DatePicker;
class PathSearch extends React.Component {
    state = {
        loading: false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // if (!err) {
            //     this.setState({
            //         loading: true
            //     })
            //     let {
            //         rangePicker: [startDate, endDate]
            //     } = values;
            //     this.props.getPath({startDate, endDate}, () => {this.setState({loading: false})})
            // }
            if (!err) {
                this.setState({
                    loading: true
                })
                let {
                    datePicker: startDate,
                    // esim_id = ''
                } = values;
                // this.props.getPath({startDate, esim_id}, () => {this.setState({loading: false})})
                this.props.getTrackList({startDate}, () => {this.setState({loading: false})})
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
        let {
            form: {getFieldDecorator}
        } = this.props;
        let {
            loading
        } = this.state;
        return (
            <div className="path-search">
                <Form onSubmit={this.handleSubmit} layout='inline'>
                    {/* <FormItem
                        {...formItemLayout}
                        label="时间选择"
                    >
                        {getFieldDecorator('rangePicker', {
                            rules: [{ type: 'array', required: true, message: '请选择时间' }]
                        })(
                            <RangePicker />
                        )}
                    </FormItem> */}
                    <FormItem
                        {...formItemLayout}
                        label="时间选择"
                    >
                        {getFieldDecorator('datePicker', {
                            rules: [{ required: true, message: '请选择时间' }]
                        })(
                            <DatePicker />
                        )}
                    </FormItem>
                    {/* <FormItem
                        {...formItemLayout}
                        label="esim_id"
                    >
                        {getFieldDecorator('esim_id', {
                        })(
                            <Input placeholder='请输入esim_id'/>
                        )}
                    </FormItem> */}
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

export default Form.create()(PathSearch);