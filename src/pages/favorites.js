import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import {SystemNotice, PostForm, Status, ProfileSide, MenuSide} from '../components';

export default @withRouter @connect(
	state => ({
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
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
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
		const {timeline} = this.props;

		return (
			<Container>
				<Main>
					<SystemNotice/>
					<PostForm/>
					{timeline.map(t => <Status key={`${t.id}-${t.favorited}`} status={t}/>)}
				</Main>
				<Side>
					<ProfileSide/>
					<MenuSide activeKey="favorites"/>
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
