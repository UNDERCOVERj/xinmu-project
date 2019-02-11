import * as React from 'react';
// import Search from './Search';
import {Form, Button, Input} from 'antd';
const FormItem = Form.Item;

interface SearchProps {
    searchBtnLoading: boolean;
    searchEsimId: string;
    form: any;
    handleSearchSubmit(values: any): void;
}

class Search extends React.Component<SearchProps, {}> {
    state = {
        loading: false
    }
    constructor(props: SearchProps) {
        super(props);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.props.handleSearchSubmit(values);
            }
        })
    }
    render () {
        const formItemLayout = {
            wrapperCol: {
                sm: {
                    span: 24
                }
            },
            style: {
                width: '50%'
            }
        };
        let {
            form: {getFieldDecorator},
            searchBtnLoading,
            searchEsimId
        } = this.props;
        return (
            <div className="search">
                <Form onSubmit={this.handleSubmit} layout='inline'>
                    <FormItem {...formItemLayout}>
                            {getFieldDecorator('searchEsimId', {
                                rules: [{whitespace: true}],
                                initialValue: searchEsimId
                            })(
                                <Input placeholder='请输入esim_id'/>
                            )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" size='small' htmlType="submit" icon="search" loading={searchBtnLoading}>
                            搜索
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create<{}>()(Search);