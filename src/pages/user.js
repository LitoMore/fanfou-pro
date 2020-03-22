import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Status, ProfileSide, MenuSide} from '../components';

export default @connect(
	state => ({
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
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		profile: PropTypes.object,
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
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
		const {timeline, profile} = this.props;

		return (
			<Container>
				<Main>
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
	background-color: white;
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
`;

const Side = styled(Base)`
	display: inline-block;
	padding: 20px 0 20px 15px;
	box-sizing: border-box;
	vertical-align: top;
	background-color: #e2f2da;
	width: 235px;
`;
