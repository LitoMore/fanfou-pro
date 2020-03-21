import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

export default @connect(
	state => ({
		current: state.login.current
	})
)

class ProfileSide extends React.Component {
	static propTypes = {
		current: PropTypes.object
	}

	static defaultProps = {
		current: null
	}

	render() {
		const {current} = this.props;
		const linkColor = current ? current.profile_link_color : '#06c';

		if (!current) {
			return null;
		}

		return (
			<UserTop>
				<AvatarLink to={current.id}>
					<Avatar src={current.profile_image_origin_large}/>
				</AvatarLink>
				<H3>{current.name}</H3>
				<UserStatistics>
					<StatisticBlock color={linkColor} to={`friends/${current.id}`}>
						<span>{current.friends_count}</span>
						<span>我关注的人</span>
					</StatisticBlock>
					<StatisticBlock color={linkColor} to={`followers/${current.id}`}>
						<span>{current.followers_count}</span>
						<span>关注我的人</span>
					</StatisticBlock>
					<StatisticBlock color={linkColor} to={current.id}>
						<span>{current.statuses_count}</span>
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

const AvatarLink = styled(Link)`
	float: left;
	margin-right: 10px;
`;

const Avatar = styled.img`
	height: 32px;
	width: 32px;
`;

const H3 = styled.h3`
	line-height: 32px;
	margin: 0;
	padding: 0;
`;

const UserStatistics = styled.div`
	float: left;
	padding-top: 10px;
	margin-bottom: 15px;
`;

const StatisticBlock = styled(Link)`
	float: left;
	width: 60px;
	vertical-align: top;
	padding: 0 4px 0 6px;
	color: #222;
	text-decoration: none;
	
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
		font-family: ’Times New Roman’, Times, serif;
		font-weight: 700;
		font-size: 20px;
	}

	&:hover span:nth-child(2) {
		text-decoration: underline;
	}

	span:nth-child(2) {
		font-size: 12px;
		color: ${props => props.color};
	}
`;
