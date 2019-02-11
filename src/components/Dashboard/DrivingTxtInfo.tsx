import * as React from 'react';
import sign from '@src/assets/sign.png';
import hulan from '@src/assets/hulan.png';
import sharpness from '@src/assets/sharpness.png';
import car from '@src/assets/car.png';

interface DrivingTxtInfoProps {
    drivingDataIndex: number;
    drivingTxtData: any[];
}

export default class DrivingTxtInfo extends React.PureComponent<DrivingTxtInfoProps, {}> {
    constructor(props: DrivingTxtInfoProps) {
        super(props);
    }
    render () {
        const typeToIcon: any = {
            car: {
                values: ['truck', 'car', 'sedan'],
                icon: car
            },
            sign: {
                values: ['sign'],
                icon: sign
            },
            cone: {
                values: ['cone'],
                icon: sharpness
            },
            guardrail: {
                values: ['guardrail'],
                icon: hulan
            }
        };
        let {
            drivingDataIndex,
            drivingTxtData
        } = this.props;
        let zCrowding = null;
        let zVisibility = null;
        let zLand = null;
        let zTimestamp = null;
        let zObjects = [];
        if (Object.keys(drivingTxtData).length) {
            if (drivingTxtData) {
                let temp = drivingTxtData[drivingDataIndex];
                zCrowding = temp.crowding || '';
                zVisibility = temp.visibility || '';
                zLand = temp.land || '';
                zTimestamp = temp.timestamp || '';
                zObjects = (temp.objects || []).map((item: any) => item.type || '').map((key: string) => {
                    for (let type in typeToIcon) {
                        if (typeToIcon[type].values.includes(key)) {
                            return typeToIcon[type].icon;
                        }
                        return '';
                    }
                }).filter((icon: string) => !!icon);
            }
        }
        return (
            <div className='driving-txt-info'>
                <div>timestamp: {zTimestamp}</div>
                <div>crowding: {zCrowding}</div>
                <div>Visibility: {zVisibility}</div>
                <div>Land: {zLand}</div>
                {
                    zObjects.length 
                        ? (<div className="info-icon">
                            types: <div className='info-icon-wrapper'>{zObjects.map((imgurl: string, idx: number) => <img key={idx} src={imgurl} />)}</div>
                        </div>)
                        : null
                }
            </div>
        )
    }
}