import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

export default @withRouter @connect(
	state => ({
		current: state.login.current
	}),
	dispatch => ({
		fetchHome: dispatch.home.fetch,
		fetchMentions: dispatch.mentions.fetch,
		fetchFavorites: dispatch.favorites.fetch
	})
)

class MenuSide extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		current: PropTypes.object,
		activeKey: PropTypes.string,
		fetchHome: PropTypes.func,
		fetchMentions: PropTypes.func,
		fetchFavorites: PropTypes.func
	}

	static defaultProps = {
		current: null,
		activeKey: '',
		fetchHome: () => {},
		fetchMentions: () => {},
		fetchFavorites: () => {}
	}

	menus = [{
		key: 'home',
		label: '首页',
		onClick: async () => {
			const {history, activeKey, fetchHome} = this.props;
			await fetchHome({format: 'html'});
			if (activeKey !== 'home') {
				history.push('/home');
			}
		}
	}, {
		key: 'mentions',
		label: '提到我的',
		onClick: async () => {
			const {history, activeKey, fetchMentions} = this.props;
			await fetchMentions({format: 'html'});
			if (activeKey !== 'mentions') {
				history.push('/mentions');
			}
		}
	}, {
		key: 'private-message',
		label: '私信'
	}, {
		key: 'favorites',
		label: '收藏',
		onClick: async () => {
			const id = this.props.current && this.props.current.id;
			const {history, activeKey, fetchFavorites} = this.props;
			await fetchFavorites({id, format: 'html'});
			if (activeKey !== 'favorites') {
				history.push('/favorites/' + id);
			}
		}
	}];

	render() {
		const {current, activeKey} = this.props;

		if (!current) {
			return null;
		}

		return (
			<Container>
				{this.menus.map(m => (
					<Link
						key={m.key}
						type={m.key === activeKey ? 'primary' : 'normal'}
						onClick={m.onClick}
					>
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

const Link = styled.a`
	display: block;
	font-weight: 700;
	text-decoration: none;
	line-height: 28px;
	padding-left: 15px;
	cursor: pointer;

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
