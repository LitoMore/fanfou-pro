import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Main, Side, Status, ProfileSide, MenuSide, Paginator, SearchInput} from '../components';
import protectedIcon from '../assets/protected.svg';
export default @connect(
	state => ({
		current: state.login.current,
		page: state.postFormFloat.page,
		timeline: state.user.timeline,
		parameters: state.user.parameters,
		profile: state.user.profile,
		isNoPermit: state.user.isNoPermit
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		comment: dispatch.postFormFloat.comment,
		fetch: dispatch.user.fetch,
		follow: dispatch.follows.follow,
		unfollow: dispatch.follows.unfollow
	})
)

class User extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		current: PropTypes.object,
		page: PropTypes.string,
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		profile: PropTypes.object,
		isNoPermit: PropTypes.bool,
		comment: PropTypes.func,
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func,
		follow: PropTypes.func,
		unfollow: PropTypes.func
	}

	static defaultProps = {
		current: null,
		page: '',
		timeline: [],
		parameters: null,
		profile: null,
		isNoPermit: false,
		comment: () => {},
		fetch: () => {},
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {},
		follow: () => {},
		unfollow: () => {}
	}

	componentDidMount() {
		const {timeline, parameters, setPostFormPage, setPostFormFloatPage} = this.props;
		setPostFormPage('user');
		setPostFormFloatPage('user');
		if (timeline.length === 0 && !parameters) {
			this.fetchUser();
		}
	}

	fetchUser = async () => {
		const {match, parameters, fetch} = this.props;
		const {id} = match.params;
		fetch({...parameters, id, format: 'html', page: 1});
	}

	render() {
		const {current, timeline, parameters, profile, isNoPermit, comment, fetch, follow, unfollow} = this.props;

		if (!current || !profile) {
			return null;
		}

		const page = (parameters && parameters.page) || 1;
		const isMe = !(profile && (current.id !== profile.id));

		return (
			<Container>
				<Main>
					<Info>
						<Avatar src={profile.profile_image_url_large.replace(/^http:/, 'https:')}/>
						<Panel>
							<Name>
								<h1>
									{profile.name}
								</h1>
								{profile.protected ? <img src={protectedIcon}/> : null}
							</Name>
							{(!profile.following && profile.protected) || isNoPermit ? <Content>我只向关注我的人公开我的消息。</Content> : null}
							{isMe ? null : (
								<ButtonGroup>
									{profile.following ? <Normal onClick={() => unfollow(profile.id)}>取消关注</Normal> : <Primary onClick={() => follow(profile.id)}>关注此人</Primary>}
									<Normal onClick={() => comment(profile)}>给他留言</Normal>
									{/* <Normal>发私信</Normal> */}
								</ButtonGroup>
							)}
						</Panel>
					</Info>
					{timeline.length > 0 ? (
						<>
							<Timeline>
								{timeline.map((t, i) => <Status key={`${t.id}-${t.favorited}-${String(i)}`} status={t}/>)}
							</Timeline>
							<Paginator
								total={profile.statuses_count}
								current={page}
								onChange={page => {
									fetch({id: profile.id, page});
								}}
							/>
						</>
					) : null}
				</Main>
				<Side>
					<ProfileSide user={profile}/>
					<MenuSide user={profile} activeKey="user"/>
					<SearchInput/>
				</Side>
			</Container>
		);
	}
}

const Container = styled.div`
	display: flex;
	overflow: hidden;
	height: auto;
	border-radius: 10px;
`;

const Timeline = styled.div`
	border-top: 1px solid #eee;
`;

const Info = styled.div`
	display: block;
	padding-bottom: 5px;
	height: 114px;
`;

const Avatar = styled.img`
	float: left;
	width: 96px;
	height: 96px;
	border: 1px solid #999;
`;

const Panel = styled.div`
	float: left;
	margin-left: 20px;
	padding: 5px 0 0;
`;

const Name = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;

	h1 {
		margin: 0;
		padding: 0;
		font-size: 26px;
		font-family: HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif;
	}

	img {
		margin-left: 5px;
		width: 16px;
		height: 20px;
	}
`;

const Content = styled.div`
	margin-top: 10px;
`;

const Button = styled.button`
	box-sizing: content-box;
	width: 70px;
	height: 20px;
	outline: 0;
	border: 0;
	border-radius: 3px;
	font-size: 12px;
	line-height: 20px;
	cursor: pointer;
`;

const Primary = styled(Button)`
	background-color: #0cf;
	color: white;
`;

const Normal = styled(Button)`
	background-color: #f0f0f0;
	color: #333;
`;

const ButtonGroup = styled.div`
	margin-top: 10px;

	${Button}:nth-child(n+2) {
		margin-left: 5px;
	}
`;
