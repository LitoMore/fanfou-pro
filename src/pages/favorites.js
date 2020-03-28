import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import {Status, ProfileSide, MenuSide, Paginator, SearchInput} from '../components';

export default @withRouter @connect(
	state => ({
		profile: state.user.profile,
		timeline: state.favorites.timeline,
		parameters: state.favorites.parameters
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.favorites.fetch
	})
)

class Favorites extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		profile: PropTypes.object,
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
		profile: null,
		timeline: [],
		parameters: null,
		fetch: () => {},
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {}
	}

	componentDidMount() {
		const {timeline, parameters, setPostFormPage, setPostFormFloatPage} = this.props;

		setPostFormPage('favorites');
		setPostFormFloatPage('favorites');
		if (timeline.length === 0 && !parameters) {
			this.fetchFavorites();
		}
	}

	fetchFavorites = async () => {
		const {match, parameters, fetch} = this.props;
		const {id} = match.params;
		fetch({...parameters, id, format: 'html'});
	}

	render() {
		const {profile, timeline, parameters, fetch} = this.props;

		if (!profile) {
			return null;
		}

		const page = (parameters && parameters.page) || 1;

		return (
			<Container>
				<Main>
					<Timeline>
						{timeline.map(t => <Status key={`${t.id}-${t.favorited}`} status={t}/>)}
					</Timeline>
					<Paginator
						total={profile.favourites_count}
						current={page}
						onChange={page => {
							fetch({id: profile.id, page});
						}}
					/>
				</Main>
				<Side>
					<ProfileSide user={profile}/>
					<MenuSide user={profile} activeKey="favorites"/>
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
