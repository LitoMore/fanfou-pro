import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {SystemNotice, Status, ProfileSide, MenuSide, SearchInput, Trends} from '../components';

export default @connect(
	state => ({
		timeline: state.recents.timeline,
		cached: state.recents.cached,
		parameters: state.recents.parameters
	}),
	dispatch => ({
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.recents.fetch,
		cache: dispatch.recents.cache,
		mergeCache: dispatch.recents.mergeCache
	})
)

class Home extends React.Component {
	static propTypes = {
		timeline: PropTypes.array,
		cached: PropTypes.array,
		parameters: PropTypes.object,
		fetch: PropTypes.func,
		cache: PropTypes.func,
		mergeCache: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
		timeline: [],
		cached: [],
		parameters: null,
		fetch: () => {},
		cache: () => {},
		mergeCache: () => {},
		setPostFormFloatPage: () => {}
	}

	cacheTimer = null

	async componentDidMount() {
		const {timeline, parameters, setPostFormFloatPage} = this.props;
		setPostFormFloatPage('recents');
		if (timeline.length === 0 && !parameters) {
			await this.fetchRecents();
			this.runRunCacheTimer();
		}
	}

	componentWillUnmount() {
		clearInterval(this.cacheTimer);
		this.cacheTimer = null;
	}

	runRunCacheTimer = () => {
		this.cacheTimer = setInterval(() => {
			this.props.cache();
		}, 10 * 1000);
	}

	fetchRecents = async () => {
		const {parameters, fetch} = this.props;
		fetch({...parameters, format: 'html'});
	}

	renderCachedNotice = () => {
		const {cached, timeline, mergeCache} = this.props;
		const cachedIds = cached.map(c => c.id);
		const timelineIdsSet = new Set(timeline.map(t => t.id));
		const newCount = cachedIds.filter(c => !timelineIdsSet.has(c)).length;

		return newCount > 0 ? (
			<CacheNotice onClick={mergeCache}>
				新增 <span>{cached.length > 99 ? '99+' : cached.length}</span> 条新消息，点击查看
			</CacheNotice>
		) : null;
	}

	render() {
		const {timeline} = this.props;

		return (
			<Container>
				<Main>
					<SystemNotice/>
					{this.renderCachedNotice()}
					<Timeline>
						{timeline.map((t, i) => <Status key={`${t.id}-${t.favorited}-${String(i)}`} status={t}/>)}
					</Timeline>
				</Main>
				<Side>
					<ProfileSide/>
					<MenuSide activeKey="recents"/>
					<SearchInput/>
					<Trends/>
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
	background-color: white;
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

const Notice = styled.div`
	clear: both;
	margin: 0 0 10px;
	padding: 5px 10px;
	border: 0;
	border-radius: 4px;
	text-align: center;
	font-size: 12px;
	cursor: pointer;

	& span {
		font-weight: bold;
	}
`;

const CacheNotice = styled(Notice)`
	background-color: #fff8e1;
	color: #795548;

	&:hover {
		background-color: #ffecb399;
	}
`;
