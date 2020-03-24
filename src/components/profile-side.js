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
		fetchUser: dispatch.user.fetch
	})
)

class ProfileSide extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		current: PropTypes.object,
		user: PropTypes.object,
		fetchUser: PropTypes.func
	}

	static defaultProps = {
		current: null,
		user: null,
		fetchUser: () => {}
	}

	goToUser = async id => {
		const {history, fetchUser} = this.props;
		await fetchUser({id, format: 'html'});
		history.push(`/${id}`);
	}

	render() {
		const {current, user} = this.props;
		const u = user || current;
		const linkColor = u ? u.profile_link_color : '#06c';

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
					<StatisticBlock color={linkColor} to={`friends/${u.id}`}>
						<span>{u.friends_count}</span>
						<span>我关注的人</span>
					</StatisticBlock>
					<StatisticBlock color={linkColor} to={`followers/${u.id}`}>
						<span>{u.followers_count}</span>
						<span>关注我的人</span>
					</StatisticBlock>
					<StatisticBlock color={linkColor} onClick={() => this.goToUser(u.id)}>
						<span>{u.statuses_count}</span>
						<span>消息</span>
					</StatisticBlock>
				</UserStatistics>
			</UserTop>
		);
	}
}

const UserTop = styled.div`
	margin-bottom: 12px;
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
	width: 60px;
	vertical-align: top;
	padding: 0 4px 0 6px;
	color: #222;
	text-decoration: none;
	cursor: pointer;
	
	&:nth-child(n+2) {
		border-left: 1px solid #b2d1a3;
	}

	&:hover {
		cursor: pointer;
	}

	&:hover span {
		color: ${props => props.color};
	}

	span {
		display: block;
	}	

	span:nth-child(1) {
		font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
		font-size: 20px;
	}

	span:nth-child(2) {
		font-size: 12px;
		color: ${props => props.color};
	}
`;
