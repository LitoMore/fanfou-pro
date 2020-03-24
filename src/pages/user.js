import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Status, ProfileSide, MenuSide} from '../components';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.user.timeline,
		parameters: state.user.parameters,
		profile: state.user.profile
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
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
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
		current: null,
		timeline: [],
		parameters: null,
		profile: null,
		fetch: () => {},
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {}
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
		const {current, timeline, profile} = this.props;

		if (!current) {
			return null;
		}

		return (
			<Container>
				<Main>
					{profile && (current.id !== profile.id) ? (
						<Info>
							<Avatar src={profile.profile_image_origin_large}/>
							<Panel>
								<H1>{profile.name}</H1>
							</Panel>
						</Info>
					) : null}
					{timeline.map(t => <Status key={`${t.id}-${t.favorited}`} status={t}/>)}
				</Main>
				<Side>
					<ProfileSide user={profile}/>
					<MenuSide user={profile} activeKey="user"/>
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
