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
		fetchUser: dispatch.user.fetch,
		fetchFollowing: dispatch.following.fetch,
		fetchFollowers: dispatch.followers.fetch
	})
)

class ProfileSide extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		current: PropTypes.object,
		user: PropTypes.object,
		fetchUser: PropTypes.func,
		fetchFollowing: PropTypes.func,
		fetchFollowers: PropTypes.func
	}

	static defaultProps = {
		current: null,
		user: null,
		fetchUser: () => {},
		fetchFollowing: () => {},
		fetchFollowers: () => {}
	}

	goToUser = async id => {
		const {history, fetchUser} = this.props;
		await fetchUser({id, format: 'html'});
		history.push(`/${id}`);
	}

	goToFollowing = async id => {
		const {history, fetchFollowing} = this.props;
		await fetchFollowing({id});
		history.push(`/following/${id}`);
	}

	goToFollowers = async id => {
		const {history, fetchFollowers} = this.props;
		await fetchFollowers({id});
		history.push(`/followers/${id}`);
	}

	render() {
		const {current, user} = this.props;
		const u = user || current;

		if (!current) {
			return null;
		}

		return (
			<UserTop>
				{u.id === current.id ? (
					<>
						<AvatarLink onClick={() => this.goToUser(u.id)}>
							<Avatar src={u.profile_image_origin_large}/>
						</AvatarLink>
						<H3>{u.name}</H3>
					</>
				) : null}
				<UserStatistics>
					<StatisticBlock to={`following/${u.id}`}>
						<span>{u.friends_count}</span>
						<span>我关注的人</span>
					</StatisticBlock>
					<StatisticBlock onClick={() => this.goToFollowers(u.id)}>
						<span>{u.followers_count}</span>
						<span>关注我的人</span>
					</StatisticBlock>
					<StatisticBlock onClick={() => this.goToUser(u.id)}>
						<span>{u.statuses_count}</span>
						<span>消息</span>
					</StatisticBlock>
				</UserStatistics>
			</UserTop>
		);
	}
}

const UserTop = styled.div`
	float: left;
	margin-bottom: 5px;
`;

const AvatarLink = styled.a`
	float: left;
	margin-right: 10px;
	cursor: pointer;
`;

const Avatar = styled.img`
	height: 32px;
	width: 32px;
`;

const H3 = styled.h3`
	line-height: 32px;
	margin: 0;
	padding: 0;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
	font-weight: normal;
`;

const UserStatistics = styled.div`
	float: left;
	padding-top: 10px;
	margin-bottom: 15px;
`;

const StatisticBlock = styled.a`
	float: left;
	vertical-align: top;
	color: #222;
	text-decoration: none;
	cursor: pointer;

	&:first-child {
		padding: 0 4px 0 0;
	}
	
	&:nth-child(n+2) {
		border-left: 1px solid #eee;
		padding: 0 4px 0 6px;
	}

	&:hover {
		color: #222;
		cursor: pointer;
	}

	&:hover span {
		color: #06c;
	}

	span {
		display: block;
	}	

	span:nth-child(1) {
		font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
		font-size: 18px;
	}

	span:nth-child(2) {
		font-size: 12px;
		color: #06c;
	}
`;
