import * as React from 'react';
import LoginForm from '../LoginForm'
import BGParticle from '@src/utils/background.js';
import './index.scss';
import backgroundImage from '@src/assets/background.jpg';
const styles = {
    backgroundBox:{
        position:'fixed',
        top:'0',
        left:'0',
        width:'100vw',
        height:'100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize:'100% 100%'
    }
}
// props接口
interface LoginProps {
    [key: string]: any
}
export default class Login extends React.Component<LoginProps, LoginState> {
    particle: any;
    constructor(props: LoginProps) {
        super(props);
    }
    // 绘制背景
    componentDidMount () {
        this.particle = new BGParticle('backgroundBox')
        this.particle.init()
    }
    componentWillUnmount(){
        this.particle.destory()
    }
    render() {
        return (
            <div className='login'>
                <div style={styles.backgroundBox} id='backgroundBox'/>
                <LoginForm />
            </div>
        )
    }
}