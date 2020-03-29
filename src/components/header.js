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
					{/* <A as={Link} to="/search">搜索</A> */}
					{current ? (
						<A onClick={this.handleLogout}>退出</A>
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
	margin-top: 10px;
	display: inline-block;
	box-sizing: inner;
	border-radius: 10px;
	background-color: white;
	padding: 7px;
`;

const Logo = styled.img`
	cursor: pointer;
`;

const A = styled.a`
	padding: 2px 7px;
	color: #06c;
	text-decoration: none;
	border-radius: 2px;
	cursor: pointer;

	&:visited {
		color: #06c;
	}

	&:hover {
		color: #06c;
	}
`;
