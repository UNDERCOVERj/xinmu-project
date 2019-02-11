import * as React from 'react';
import {Card} from 'antd';
const Meta = Card.Meta;

interface ImgItem {
    img_file: string;
    add_time: number;
}
interface ImgListProps {
    imgList: ImgItem[]
    itemWidth: number;
    marginLeftRight: number;
}

export default class ImgList extends React.Component <ImgListProps, {}> {
    constructor(props: ImgListProps) {
        super(props);
    }
    render() {
        let {marginLeftRight} = this.props;
        return (
            <div className="img-list">
                {this.props.imgList.map((item) => (
                    <Card
                        className='img-item'
                        style={{
                            width: this.props.itemWidth || 0,
                            margin: `.2rem ${marginLeftRight}px 0`
                        }}
                        key={item.add_time}
                        hoverable
                        cover={<img src={item.img_file} />}
                    >
                        <Meta
                            title='添加时间：'
                            description={new Date(+item.add_time*1000).toLocaleString()}
                            />
                    </Card>
                ))}
            </div>
        )
    }
} 