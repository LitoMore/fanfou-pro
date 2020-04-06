import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

export default @withRouter @connect(
	state => ({
		current: state.login.current,
		page: state.postFormFloat.page
	}),
	dispatch => ({
		fetchUser: dispatch.user.fetch,
		fetchFollowing: dispatch.follows.fetchFollowing,
		fetchFollowers: dispatch.follows.fetchFollowers
	})
)

class ProfileSide extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		current: PropTypes.object,
		page: PropTypes.string,
		user: PropTypes.object,
		fetchUser: PropTypes.func,
		fetchFollowing: PropTypes.func,
		fetchFollowers: PropTypes.func
	}

	static defaultProps = {
		current: null,
		page: '',
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

	getBirthDate = birthday => {
		const match = birthday.match(/(\d{4})-(\d{2})-(\d{2})/);
		if (match) {
			const year = parseInt(match[1], 10);
			const month = parseInt(match[2], 10);
			const day = parseInt(match[3], 10);
			const yearString = year ? year.toString() + ' 年 ' : '';
			const dateString = month && day ? month.toString() + ' 月 ' + day.toString() + ' 日' : '';
			return yearString + dateString;
		}

		return '';
	}

	getFanfouAge = createdAt => {
		const getDays = (year, month) => {
			return new Date(year, month, 0).getDate();
		};

		const reg = new Date(createdAt);
		const now = new Date();

		const regYear = reg.getFullYear();
		const regMonth = reg.getMonth() + 1;
		const regDate = reg.getDate();
		const nowYear = now.getFullYear();
		const nowMonth = now.getMonth() + 1;
		const nowDate = now.getDate();

		let years = nowYear - regYear;
		let months = nowMonth - regMonth;
		let days = nowDate - regDate;

		if (months < 0) {
			years -= 1;
			months += 12;
		}

		if (days < 0) {
			const daySum = getDays(nowYear, nowMonth);
			if (months === 0) {
				months += 11;
				years -= 1;
			} else {
				months -= 1;
			}

			days += daySum;
		}

		if (years + months + days === 0) {
			return '刚刚注册';
		}

		return `${days === 0 ? '正好 ' : ''}${years ? years + ' 年 ' : ''}${months ? months + ' 个月 ' : ''}${days ? days + ' 天' : ''}`;
	}

	render() {
		const {current, user, page} = this.props;
		const u = user || current;

		if (!current) {
			return null;
		}

		const isMe = u.id === current.id;
		let pronounce = '我';
		const birthDate = this.getBirthDate(u.birthday);
		const fanfouAge = this.getFanfouAge(u.created_at);

		if (!isMe) {
			pronounce = '他';
		}

		if (u.gender === '女') {
			pronounce = '她';
		}

		return (
			<UserTop>
				{page === 'home' ? (
					<>
						<AvatarLink onClick={() => this.goToUser(u.id)}>
							<Avatar src={u.profile_image_origin_large}/>
						</AvatarLink>
						<H3>{u.name}</H3>
					</>
				) : (
					<Info>
						{u.location ? <Section>所在地：{u.location}</Section> : null}
						{u.url ? <Section>网站：<a href={u.url} target="_blank" rel="noopener noreferrer">{u.url}</a></Section> : null}
						{u.gender ? <Section>性别：{u.gender}</Section> : null}
						{birthDate ? <Section>生日：{birthDate}</Section> : null}
						{fanfouAge ? <Section>饭龄：{fanfouAge}</Section> : null}
						{u.description ? (
							<Section>
								{u.description.trim().split('\n').map((l, i) => <div key={String(i)} css="line-height: 1.6;">{(i === 0 ? '自述：' : '') + l}</div>)}
							</Section>
						) : null}
					</Info>
				)}
				<UserStatistics>
					<StatisticBlock onClick={() => this.goToFollowing(u.id)}>
						<span>{u.friends_count}</span>
						<span>{pronounce}关注的人</span>
					</StatisticBlock>
					<StatisticBlock onClick={() => this.goToFollowers(u.id)}>
						<span>{u.followers_count}</span>
						<span>关注{pronounce}的人</span>
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

const Info = styled.div`
	font-size: 12px;
	padding-right: 20px;
`;

const Section = styled.div`
	margin: 5px 0;
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
