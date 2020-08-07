import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {SystemNotice, PostForm, Status, ProfileSide, MenuSide, Paginator, SearchInput} from '../components';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.mentions.timeline,
		parameters: state.mentions.parameters
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.mentions.fetch
	})
)

class Mentions extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
		current: null,
		timeline: [],
		parameters: null,
		fetch: () => {},
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {}
	}

	componentDidMount() {
		const {timeline, parameters, setPostFormPage, setPostFormFloatPage} = this.props;
		setPostFormPage('mentions');
		setPostFormFloatPage('mentions');
		if (timeline.length === 0 && !parameters) {
			this.fetchMentions();
		}
	}

	fetchMentions = async () => {
		const {parameters, fetch} = this.props;
		fetch({...parameters, format: 'html'});
	}

	render() {
		const {current, timeline, parameters, fetch} = this.props;

		if (!current) {
			return null;
		}

		const page = (parameters && parameters.page) || 1;

		return (
			<Container>
				<Main>
					<SystemNotice/>
					<PostForm/>
					<Timeline>
						{timeline.map((t, i) => <Status key={`${t.id}-${t.favorited}-${String(i)}`} status={t}/>)}
					</Timeline>
					<Paginator
						total={Infinity}
						current={page}
						onChange={page => {
							fetch({id: current.id, page});
						}}
					/>
				</Main>
				<Side>
					<ProfileSide/>
					<MenuSide activeKey="mentions"/>
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

const Base = styled.div`
	padding: 20px;
`;

const Main = styled(Base)`
	display: inline-block;
	box-sizing: border-box;
	width: 540px;
	background-color: white;
	vertical-align: top;
`;

const Side = styled(Base)`
	display: inline-block;
	box-sizing: border-box;
	padding: 20px 0 20px 15px;
	width: 235px;
	background-color: rgba(255, 255, 255, 0.9);
	vertical-align: top;
`;

const Timeline = styled.div`
	border-top: 1px solid #eee;
`;
