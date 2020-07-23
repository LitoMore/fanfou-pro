import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import styled from 'styled-components';
import {oauthToken, oauthTokenSecret} from '../api';
import logo from '../assets/logo.svg';

export default @withRouter @connect(
	state => ({
		current: state.login.current
	}),
	dispatch => ({
		logout: dispatch.login.logout,
		fetchHome: dispatch.home.fetch
	})
)

class extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		current: PropTypes.object,
		logout: PropTypes.func,
		fetchHome: PropTypes.func
	}

	static defaultProps = {
		current: null,
		logout: () => {},
		fetchHome: () => {}
	}

	goToHome = async () => {
		if (oauthToken && oauthTokenSecret) {
			const {history, fetchHome} = this.props;
			await fetchHome({format: 'html'});
			history.push('/home');
		} else {
			window.location.href = '/login';
		}
	}

	handleLogout = () => {
		localStorage.removeItem('fanfouProKey');
		localStorage.removeItem('fanfouProSecret');
		localStorage.removeItem('fanfouProToken');
		localStorage.removeItem('fanfouProTokenSecret');
		this.props.logout();
		window.location.href = '/login';
	}

	render() {
		const {current} = this.props;

		return (
			<StyledHeader>
				<Logo src={logo} onClick={this.goToHome}/>
				<Nav>
					<A onClick={this.goToHome}>首页</A>
					{current ? (
						<>
							<A as={Link} to="/settings">设置</A>
							<A onClick={this.handleLogout}>退出</A>
						</>
					) : (
						<A as={Link} to="/login">登录</A>
					)}
				</Nav>
			</StyledHeader>
		);
	}
}

const StyledHeader = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 0.75em 0;
`;

const Nav = styled.div`
	background-color: white;
	border-radius: 10px;
	box-sizing: inner;
	display: inline-block;
	margin-top: 10px;
	padding: 7px;
`;

const Logo = styled.img`
	cursor: pointer;
`;

const A = styled.a`
	border-radius: 2px;
	color: #06c;
	cursor: pointer;
	padding: 2px 7px;
	text-decoration: none;

	&:visited {
		color: #06c;
	}

	&:hover {
		color: #06c;
	}
`;
