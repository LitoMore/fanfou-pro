import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Status, ProfileSide, MenuSide, Paginator, SearchInput} from '../components';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.user.timeline,
		parameters: state.user.parameters,
		profile: state.user.profile,
		isNoPermit: state.user.isNoPermit
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		comment: dispatch.postFormFloat.comment,
		fetch: dispatch.user.fetch
	})
)

class User extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		current: PropTypes.object,
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		profile: PropTypes.object,
		isNoPermit: PropTypes.bool,
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func,
		comment: PropTypes.func
	}

	static defaultProps = {
		current: null,
		timeline: [],
		parameters: null,
		profile: null,
		isNoPermit: false,
		fetch: () => {},
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {},
		comment: () => {}
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
		fetch({...parameters, id, format: 'html'});
	}

	render() {
		const {current, timeline, parameters, profile, isNoPermit, fetch, comment} = this.props;

		if (!current || !profile) {
			return null;
		}

		const page = (parameters && parameters.page) || 1;

		return (
			<Container>
				<Main>
					{profile && (current.id !== profile.id) ? (
						<Info>
							<Avatar src={profile.profile_image_origin_large}/>
							<Panel>
								<H1>{profile.name}</H1>
								{(!profile.following && profile.protected) || isNoPermit ? <Content>我只向关注我的人公开我的消息。</Content> : null}
								<ButtonGroup>
									{/* {profile.following ? null : <Primary>关注此人</Primary>} */}
									<Normal onClick={() => comment(profile)}>给他留言</Normal>
									{/* <Normal>发私信</Normal> */}
								</ButtonGroup>
							</Panel>
						</Info>
					) : null}
					{timeline.length > 0 ? (
						<>
							<Timeline>
								{timeline.map(t => <Status key={`${t.id}-${t.favorited}`} status={t}/>)}
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
	border-radius: 10px;
	overflow: hidden;
	height: auto;
`;

const Base = styled.div`
	padding: 20px;
`;

const Main = styled(Base)`
	display: inline-block;
	box-sizing: border-box;
	vertical-align: top;
	width: 540px;
	background-color: white;
`;

const Side = styled(Base)`
	display: inline-block;
	padding: 20px 0 20px 15px;
	box-sizing: border-box;
	vertical-align: top;
	background-color: rgba(255, 255, 255, 0.9);
	width: 235px;
`;

const Timeline = styled.div`
	border-top: 1px solid #eee;
`;

const Info = styled.div`
	display: block;
	height: 114px;
	padding-bottom: 5px;
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

const H1 = styled.h1`
	font-family: HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif;
	margin: 0;
	padding: 0;
	font-size: 26px;
  line-height: 30px;
`;

const Content = styled.div`
	margin-top: 10px;
`;

const Button = styled.button`
	box-sizing: content-box;
	width: 70px;
	height: 20px;
	line-height: 20px;
	font-size: 12px;
	border: 0;
	outline: 0;
	border-radius: 3px;
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
