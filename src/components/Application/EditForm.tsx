import * as React from 'react';
import {Modal, Form, Input, Spin, Table, Button} from 'antd';
const FormItem = Form.Item;

class EditForm extends React.Component {
    state = {
        selectedEsimIds: [],
        inputEsimId: '' // 需要搜索的esim_id
    }
    constructor(props) {
        super(props);
    }
    // 勾选改变
    onSelectChange = (selectedRowKeys) => {
        this.props.changeSelectedEsimIds(selectedRowKeys)
    }
    // 搜索
    search = () => {
        this.props.changeEsimIds(this.state.inputEsimId)
    }
    // 重新获取全部
    getAllEsimIds = () => {
        this.props.getAllEsimIds();
    }
    render () {
        const {
            form: {getFieldDecorator},
            app_name,
            app_description,
            formItemLayout,
            applicationEditVisible,
            editHandleApplicationOk,
            editHandleApplicationCancel,
            editAccountAddSpinning,
            esimIds,
            selectedEsimIds,
            changeInput,
            checkAll,
            checkNotAll,
            inputEsimId
        } = this.props;
        const rowSelection = {
            selectedRowKeys: selectedEsimIds,
            onChange: this.onSelectChange
        };
        const columns = [{
            title: 'esim_id',
            dataIndex: 'singleEsimId'
        }];
        let dataSource = esimIds.map(id => ({
            key: id,
            singleEsimId: id
        }));
        return (
            <Modal
                title='编辑应用'
                cancelText='取消'
                okText='确认'
                visible={applicationEditVisible}
                onOk={editHandleApplicationOk}
                onCancel={editHandleApplicationCancel}
                >
                 <Spin spinning={editAccountAddSpinning}>
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
                    <FormItem {...formItemLayout} label="esim_id">
                        {getFieldDecorator('selectedEsimIds', {
                        })(
                            // <Select
                            //     mode="multiple"
                            //     style={{ width: '100%' }}
                            //     placeholder="Please select"
                            //     onChange={this.handleSelectChange}
                            // >
                            //     {esimIds.map((key) => <Option key={key}>{key}</Option>)}
                            // </Select>
                            <div className="search-table">
                                <div className='search-table-title'>
                                    <Input placeholder="搜索esim_id" onChange={changeInput} value={inputEsimId}/>
                                    <Button className='search-btn' type='primary' size='small' onClick={this.search}>搜索</Button>
                                    <Button className='search-btn' type='primary' size='small' onClick={this.getAllEsimIds}>列表</Button>
                                    <Button className='search-btn' type='primary' size='small' onClick={checkAll}>全选</Button>
                                    <Button className='search-btn' type='primary' size='small' onClick={checkNotAll}>全不选</Button>
                                </div>
                                <Table size='small' rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
                            </div>
                        )}
                    </FormItem>
                    
                </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(EditForm)