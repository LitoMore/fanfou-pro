import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import U from 'uprogress';
import {ff, consumerKey, consumerSecret} from '../api';
import badge1 from '../assets/login-badge-1.svg';
import badge2 from '../assets/login-badge-2.svg';
import badge3 from '../assets/login-badge-3.svg';

export default @connect(
	state => ({
		accounts: state.login.accounts
	}),
	dispatch => ({
		notify: dispatch.message.notify,
		login: dispatch.login.login
	})
)

class extends React.Component {
	static propTypes = {
		notify: PropTypes.func,
		login: PropTypes.func
	}

	static defaultProps = {
		notify: () => {},
		login: () => {}
	}

	state = {
		username: '',
		password: ''
	}

	handleUsername = event => {
		this.setState({username: event.target.value});
	}

	handlePassword = event => {
		this.setState({password: event.target.value});
	}

	handleLogin = async event => {
		event.preventDefault();
		const {username, password} = this.state;
		const {login} = this.props;
		ff.username = username;
		ff.password = password;
		const u = new U();
		try {
			u.start();
			const {oauthToken, oauthTokenSecret} = await ff.xauth();
			const user = await ff.get('/users/show');
			localStorage.setItem('fanfouProKey', consumerKey);
			localStorage.setItem('fanfouProSecret', consumerSecret);
			localStorage.setItem('fanfouProToken', oauthToken);
			localStorage.setItem('fanfouProTokenSecret', oauthTokenSecret);
			login(user);
			u.done();
			window.location.href = '/home';
		} catch {
			u.done();
			this.props.notify('用户名或密码错误');
			this.setState({
				password: ''
			});
		}
	}

	render() {
		const {username, password} = this.state;

		return (
			<Container>
				<Main>
					<Headline>饭否，随时随地记录与分享！</Headline>
					<Slogan>
						<Badge>
							<img src={badge1}/>
							<div>
								<P>迷你博客</P>
								<P>记录生活的点点滴滴</P>
							</div>
						</Badge>
						<Badge>
							<img src={badge2}/>
							<div>
								<P>交流与分享</P>
								<P>拉近你和朋友</P>
							</div>
						</Badge>
						<Badge>
							<img src={badge3}/>
							<div>
								<P>随时随地</P>
								<P>支持 MSN/QQ 与手机</P>
							</div>
						</Badge>
					</Slogan>
				</Main>
				<Side>
					<LoginTitle>登录</LoginTitle>
					<form onSubmit={this.handleLogin}>
						<Section>
							<Label>Email 或手机号：</Label>
							<Input type="input" value={username} onChange={this.handleUsername}/>
						</Section>
						<Section>
							<Label>饭否密码</Label>
							<Input type="password" value={password} onChange={this.handlePassword}/>
						</Section>
						<Button type="submit">登 录</Button>
					</form>
				</Side>
			</Container>
		);
	}
}

const Container = styled.div`
	border-radius: 10px;
	overflow: hidden;
`;

const Base = styled.div`
	padding: 20px;
`;

const Main = styled(Base)`
	background-color: white;
	box-sizing: border-box;
	display: inline-block;
	height: 275px;
	vertical-align: top;
	width: 540px;
`;

const Side = styled(Base)`
	background-color: rgba(255, 255, 255, 0.9);
	box-sizing: border-box;
	display: inline-block;
	height: 275px;
	vertical-align: top;
	width: 235px;
`;

const P = styled.p`
	margin: 0;
`;

const Headline = styled.div`
	font-size: 20px;
	font-weight: 700;
	padding: 10px 20px;
`;

const Slogan = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 0 0 10px 15px;
`;

const Badge = styled.div`
	text-align: center;
	width: 148px;
`;

const LoginTitle = styled.div`
	font-weight: 700;
	margin-bottom: 5px;
`;

const Section = styled.div`
	margin: 10px 0;
`;

const Label = styled.div`
	font-size: 12px;
	height: 23px;
	line-height: 23px;
`;

const Input = styled.input`
	background-color: rgba(255, 255, 255, 0.75);
	border: 1px solid #bdbdbd;
	border-radius: 4px;
	box-sizing: content-box;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
	font-size: 12px;
	height: 24px;
	outline: 0;
	padding: 0 4px;
	width: 185px;

	&:focus {
		border-color: #0cf;
	}
`;

const Button = styled.button`
	background-color: #f0f0f0;
	border: 0;
	border-radius: 3px;
	color: #222;
	cursor: pointer;
	font-size: 12px;
	height: 25px;
	margin-left: 0;
	outline: 0;
	padding: 0 1.5em;
`;
