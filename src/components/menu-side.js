import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Badge} from '../components';
import {defaultState as notificationDefault} from '../models/notification/notification';

export default @withRouter @connect(
	state => ({
		current: state.login.current,
		notification: state.notification.notification
	}),
	dispatch => ({
		fetchHome: dispatch.home.fetch,
		fetchMentions: dispatch.mentions.fetch,
		fetchFavorites: dispatch.favorites.fetch,
		fetchUser: dispatch.user.fetch
	})
)

class MenuSide extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		notification: PropTypes.object,
		current: PropTypes.object,
		user: PropTypes.object,
		activeKey: PropTypes.string,
		fetchHome: PropTypes.func,
		fetchMentions: PropTypes.func,
		fetchFavorites: PropTypes.func,
		fetchUser: PropTypes.func
	}

	static defaultProps = {
		notification: notificationDefault,
		current: null,
		user: null,
		activeKey: '',
		fetchHome: () => {},
		fetchMentions: () => {},
		fetchFavorites: () => {},
		fetchUser: () => {}
	}

	renderMenu = () => {
		const {history, notification, current, user, activeKey, fetchHome, fetchMentions, fetchFavorites, fetchUser} = this.props;

		return user && (user.id !== current.id) ? (
			[{
				key: 'user',
				label: '消息',
				onClick: async () => {
					await fetchUser({id: user.id, format: 'html'});
					history.push(`/${user.id}`);
				}
			}, {
				key: 'favorites',
				label: '收藏',
				onClick: async () => {
					const {id} = user;
					await fetchFavorites({id, format: 'html'});
					if (activeKey !== 'favorites') {
						history.push('/favorites/' + id);
					}
				}
			}]
		) : (
			[{
				key: 'home',
				label: '首页',
				onClick: async () => {
					await fetchHome({format: 'html'});
					if (activeKey !== 'home') {
						history.push('/home');
					}
				}
			}, {
				key: 'mentions',
				label: <span>@提到我的<Badge count={notification.mentions} offset={[3, -3]}/></span>,
				onClick: async () => {
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
					const id = current && current.id;
					await fetchFavorites({id, format: 'html'});
					if (activeKey !== 'favorites') {
						history.push('/favorites/' + id);
					}
				}
			}]
		);
	}

	render() {
		const {current, user, activeKey} = this.props;

		if (!(current || user)) {
			return null;
		}

		return (
			<Container>
				{this.renderMenu().map(m => (
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
	color: #06c;

	&:hover {
		color: #06c;
		background-color: rgba(255, 255, 255, 0.5);
	}

	&:nth-child(n+2) {
		margin-top: 1px;
	}

	${props => props.type === 'primary' ? `
		color: #222;
		background-color: rgba(255, 255, 255, 0.5);

		&:hover {
			color: #222;
		}
	` : ''};
`;
