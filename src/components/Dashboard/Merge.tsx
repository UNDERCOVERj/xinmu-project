import * as React from 'react';
import request from '@src/utils/request';
interface MergeProps {
    style: any;
    isShowVideo: boolean;
    s3_megra_url: string;
}
export default class Merge extends React.Component<MergeProps> {
    constructor(props: MergeProps) {
        super(props);
    }
    public render () {
        const {style, isShowVideo, s3_megra_url} = this.props;
        return (
            <div className="merge" style={style}>
                {
                    isShowVideo 
                        ? (<video className='mergePlayer' style={style} controls muted> 
                            <source src='' type='video/mp4' style={style}/>
                        </video>)
                        : null
                }
            </div>
        )
    }
}