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
	border-radius: 10px;
	display: flex;
	height: auto;
	overflow: hidden;
`;

const Base = styled.div`
	background-color: white;
	padding: 20px;
`;

const Main = styled(Base)`
	background-color: white;
	box-sizing: border-box;
	display: inline-block;
	vertical-align: top;
	width: 540px;
`;

const Side = styled(Base)`
	background-color: rgba(255, 255, 255, 0.9);
	box-sizing: border-box;
	display: inline-block;
	padding: 20px 0 20px 15px;
	vertical-align: top;
	width: 235px;
`;

const Timeline = styled.div`
	border-top: 1px solid #eee;
`;

const Notice = styled.div`
	border: 0;
	border-radius: 4px;
	clear: both;
	cursor: pointer;
	font-size: 12px;
	margin: 0 0 10px;
	padding: 5px 10px;
	text-align: center;

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
