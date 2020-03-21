import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {SystemNotice, PostForm, Status, ProfileSide} from '../components';
import {ff} from '../api';

export default @connect(
	state => ({
		timeline: state.home.timeline,
		parameters: state.home.parameters
	}),
	dispatch => ({
		setPage: dispatch.postForm.setPage,
		fetch: dispatch.home.fetch
	})
)

class Home extends React.Component {
	static propTypes = {
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		fetch: PropTypes.func,
		setPage: PropTypes.func
	}

	static defaultProps = {
		timeline: [],
		parameters: null,
		fetch: () => {},
		setPage: () => {}
	}

	componentDidMount() {
		const {timeline, setPage} = this.props;
		setPage('home');
		if (timeline.length === 0) {
			this.fetchHome();
		}
	}

	fetchHome = async () => {
		const {parameters, fetch} = this.props;
		ff.oauthToken = localStorage.getItem('fanfouProToken');
		ff.oauthTokenSecret = localStorage.getItem('fanfouProTokenSecret');
		fetch({...parameters, format: 'html'});
	}

	render() {
		const {timeline} = this.props;

		return (
			<Container>
				<Main>
					<SystemNotice/>
					<PostForm/>
					{timeline.map(t => <Status key={t.id} status={t}/>)}
				</Main>
				<Side>
					<ProfileSide/>
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
	border-left: 1px solid #e2f2da;
`;
