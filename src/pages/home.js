import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {SystemNotice, PostForm, Status, ProfileSide, MenuSide} from '../components';

export default @connect(
	state => ({
		timeline: state.home.timeline,
		cache: state.home.cache,
		parameters: state.home.parameters
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.home.fetch
	})
)

class Home extends React.Component {
	static propTypes = {
		timeline: PropTypes.array,
		cache: PropTypes.array,
		parameters: PropTypes.object,
		fetch: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
		timeline: [],
		cache: [],
		parameters: null,
		fetch: () => {},
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {}
	}

	componentDidMount() {
		const {timeline, parameters, setPostFormPage, setPostFormFloatPage} = this.props;
		setPostFormPage('home');
		setPostFormFloatPage('home');
		if (timeline.length === 0 && !parameters) {
			this.fetchHome();
		}
	}

	fetchHome = async () => {
		const {parameters, fetch} = this.props;
		fetch({...parameters, format: 'html'});
	}

	renderCachedNotice = () => {
		const {cache, timeline} = this.props;
		const cachedIds = cache.map(c => c.id);
		const timelineIds = timeline.map(t => t.id);
		const newCount = cachedIds.filter(c => !timelineIds.includes(c)).length;

		return newCount > 0 ? (
			<CacheNotice>
				新增 <span>{cache.length}</span> 条新消息，点击查看
			</CacheNotice>
		) : null;
	}

	render() {
		const {timeline} = this.props;

		return (
			<Container>
				<Main>
					<SystemNotice/>
					<PostForm/>
					{this.renderCachedNotice()}
					<Timeline>
						{timeline.map(t => <Status key={`${t.id}-${t.favorited}`} status={t}/>)}
					</Timeline>
				</Main>
				<Side>
					<ProfileSide/>
					<MenuSide activeKey="home"/>
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
	background-color: white;
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

const CacheNotice = styled.div`
	clear: both;
	margin: 0 0 10px;
	padding: 5px 10px;
	border: 0;
	border-radius: 4px;
	background-color: #fff8e1;
	color: #795548;
	font-size: 12px;
	text-align: center;

	&:hover {
		background-color: #ffecb399;
	}

	& span {
		font-weight: bold;
	}
`;

