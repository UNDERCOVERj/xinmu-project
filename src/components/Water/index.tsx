import * as React from 'react';
import {Spin} from 'antd';
import {getLocationParams} from '@src/utils/utils';
import { withRouter } from 'react-router';
import {History, Location} from '@src/interface';
import Back from '@src/components/Back';
import request from '@src/utils/request';
import Title from './Title';
import ImgList from './ImgList';
import LoadMore from './LoadMore';
import Nomore from './Nomore';
import './index.scss';
interface WaterProps {
    history: History,
    location: Location
}
interface ImgItem {
    img_file: string;
    add_time: number;
}
interface WaterState {
    imgList?: ImgItem[];
    oid?: string;
    esim_id?: string;
    size: number;
    curPage: number;
    itemWidth: number;
    marginLeftRight: number;
    loading: boolean;
}
class Water extends React.Component<WaterProps, WaterState> {
    state: WaterState;
    constructor(props: WaterProps) {
        super(props);
        this.state = Object.assign({}, this.getLocation(),{
            imgList: [],
            size: 10,
            curPage: 1,
            itemWidth: 240,
            marginLeftRight: 10,
            loading: true
        });
    }
    getLocation = () => {
        let params = getLocationParams(this.props.location.search);
        let {oid, esim_id} = params;
        return {oid, esim_id};
    }
    async componentWillMount() {
        let {oid, esim_id} = this.state;
        try {
            let result = await request.send('/obu/gettrailimg', 'GET', {oid, esim_id});
            let {
                data: imgList = []
            } = result;
            if (Array.isArray(imgList) && imgList.length) {
                this.setState({
                    imgList
                })
            }
            this.setState({
                loading: false
            })
        } catch(e) {}
    }
    componentDidMount() {
        let {marginLeftRight, itemWidth} = this.state;
        let el: any = document.querySelector('.water');
        let width = el.offsetWidth;
        let column = Math.floor(width / (2*marginLeftRight + itemWidth));
        console.log(column);
        this.setState({
            size: column * 1
        });
    }
    loadMore = () => {
        this.setState((prev) => ({
            curPage: prev.curPage + 1
        }))
    }
    render() {
        let {esim_id, oid, imgList, curPage, size, itemWidth, marginLeftRight, loading} = this.state;
        let len = curPage*size;
        console.log(curPage, size, len);
        return (
            <div className="water"> 
                <Back goBack={this.props.history.goBack}/>
                <Title esim_id={esim_id} oid={oid}/>
                {
                    imgList.length 
                            ?   <React.Fragment>
                                    <ImgList imgList={imgList.slice(0, len)} 
                                    itemWidth={itemWidth}
                                    marginLeftRight={marginLeftRight}/>
                                    {curPage*size < imgList.length 
                                                ? <LoadMore loadMore={this.loadMore}/>
                                                : null}
                                </React.Fragment>
                            :   <Nomore loading={loading}/>
                }
                
            </div>
        )
    }
}

export default withRouter(Water);