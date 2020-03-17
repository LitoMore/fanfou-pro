import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.svg';

export default @withRouter @connect(
	state => ({
		current: state.login.current
	}),
	dispatch => ({
		logout: dispatch.login.logout
	})
)

class extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		logout: PropTypes.func
	}

	static defaultProps = {
		current: null,
		logout: () => {}
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
				<img src={logo}/>
				<Nav>
					<StyledLink to="/home">首页</StyledLink>
					<StyledLink to="/search">搜索</StyledLink>
					{current ? (
						<StyledLink to="/login" onClick={this.handleLogout}>退出</StyledLink>
					) : (
						<StyledLink to="/login">登录</StyledLink>
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

const StyledLink = styled(Link)`
	padding: 2px 7px;
	color: #06c;
	text-decoration: none;
	border-radius: 2px;

	&:visited {
		color: #06c;
	}

	&:hover {
		background-color: #06c;
		color: white;
	}
`;
