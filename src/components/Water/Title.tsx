import * as React from 'react';
interface TitleProps {
    esim_id: string;
    oid: string;
}

export default class Title extends React.Component<TitleProps, {}> {
    constructor(props: TitleProps) {
        super(props);
    }
    render() {
        let {oid, esim_id} = this.props;
        return (
            <div className='water-title'>
                <div>图片流</div>
                <div className="water-info water-row">
                    <div>esim_id: &nbsp;<span>{esim_id}</span></div>
                    <div>主行程编号：&nbsp;<span>{oid}</span></div>
                </div>
            </div>
        )
    }
}