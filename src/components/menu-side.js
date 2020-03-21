import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';

export default @connect(
	state => ({
		current: state.login.current
	})
)

class MenuSide extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		activeKey: PropTypes.string
	}

	static defaultProps = {
		current: null,
		activeKey: ''
	}

	menus = [{
		key: 'home',
		label: '首页',
		to: '/home'
	}, {
		key: 'mentions',
		label: '提到我的',
		to: '/metions'
	}, {
		key: 'private-message',
		label: '私信',
		to: '/privatemsg'
	}, {
		key: 'favorites',
		label: '收藏',
		to: '/favorites/' + (this.props.current && this.props.current.id)
	}];

	render() {
		const {current, activeKey} = this.props;

		if (!current) {
			return null;
		}

		return (
			<Container>
				{this.menus.map(m => (
					<Link key={m.key} type={m.key === activeKey ? 'primary' : 'normal'} to={m.to}>
						<span>{m.label}</span>
					</Link>
				))}
			</Container>
		);
	}
}

const Container = styled.div`
	float: left;
	margin-left: -15px;
	width: 235px;
`;

const Link = styled(RouterLink)`
	display: block;
	font-weight: 700;
	text-decoration: none;
	line-height: 28px;
	padding-left: 15px;

	&:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}

	&:nth-child(n+2) {
		margin-top: 1px;
	}

	${props => props.type === 'primary' ? `
		color: #222;
		background-color: rgba(255, 255, 255, 0.5);
	` : ''};

	${props => props.type === 'normal' ? `
		&:hover {
			text-decoration: underline;
		}
	` : ''}
`;
