import * as React from 'react';
import {Form, Input, Modal, DatePicker, message} from 'antd';
import request from '@src/utils/request';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
interface ExcelExportProps {
    form: {
        getFieldDecorator: any;
        validateFields(func: (err: any, values: any) => Promise<any>): void;
    };
    ExcelExportVisible: boolean;
    closeExcelExport(): void;
    formItemLayout: any;
}
class ExcelExport extends React.Component<ExcelExportProps, {}> {
    constructor(props: ExcelExportProps) {
        super(props)
    }
    export = () => {
        this.props.form.validateFields(async (err: any, values: any) => {
            if (!err) {
                let {
                    esim_id_x: esim_id,
                    rangePicker: [start_time, end_time]
                } = values;
                let params = {
                    esim_id: +esim_id,
                    // start_time: Math.round(+new Date(start_time)/1000),
                    // end_time: Math.round(+new Date(end_time)/1000),
                    start_time: 1546427907,
                    end_time: 1546428246,
                    mu_sn: +localStorage.getItem('mu_sn')
                }
                try {
                    let result = await request.send('/obu/checktrailexcel', 'GET', params);
                    // if (typeof result === 'string') {
                    //     request.send('/obu/trailexcel', 'open', params);
                    // }
                } catch(e) {
                    message.warn(e);
                }
            }
        })
    }
    render() {
        let {
            form: {getFieldDecorator},
            ExcelExportVisible,
            closeExcelExport,
            formItemLayout
        } = this.props;
        return (
            <Modal
                title='行车数据导出'
                visible={ExcelExportVisible}
                okText='确认'
                cancelText='取消'
                onOk={this.export}
                onCancel={closeExcelExport}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="esim_id"
                    >
                        {getFieldDecorator('esim_id_x', {
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
                        label="时间选择"
                    >
                        {getFieldDecorator('rangePicker', {
                            rules: [{ type: 'array', required: true, message: '请选择时间' }]
                        })(
                            <RangePicker 
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"/>
                        )}
                    </FormItem> 
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(ExcelExport);