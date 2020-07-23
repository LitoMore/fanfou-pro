import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {LoadingOutlined} from '@ant-design/icons';
import {SystemNotice, PostForm, Status, ProfileSide, MenuSide, SearchInput, Trends} from '../components';

export default @connect(
	state => ({
		timeline: state.home.timeline,
		cached: state.home.cached,
		parameters: state.home.parameters,
		isLoadingMore: state.home.isLoadingMore
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.home.fetch,
		cache: dispatch.home.cache,
		mergeCache: dispatch.home.mergeCache,
		loadMore: dispatch.home.loadMore
	})
)

class Home extends React.Component {
	static propTypes = {
		timeline: PropTypes.array,
		cached: PropTypes.array,
		parameters: PropTypes.object,
		isLoadingMore: PropTypes.bool,
		fetch: PropTypes.func,
		cache: PropTypes.func,
		mergeCache: PropTypes.func,
		loadMore: PropTypes.func,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func
	}

	static defaultProps = {
		timeline: [],
		cached: [],
		parameters: null,
		loadMore: false,
		fetch: () => {},
		cache: () => {},
		mergeCache: () => {},
		isLoadingMore: () => {},
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {}
	}

	cacheTimer = null

	async componentDidMount() {
		const {timeline, parameters, setPostFormPage, setPostFormFloatPage} = this.props;
		setPostFormPage('home');
		setPostFormFloatPage('home');
		if (timeline.length === 0 && !parameters) {
			await this.fetchHome();
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
		}, 45 * 1000);
	}

	fetchHome = async () => {
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
		const {timeline, parameters, isLoadingMore, loadMore} = this.props;

		return (
			<Container>
				<Main>
					<SystemNotice/>
					<PostForm/>
					{this.renderCachedNotice()}
					<Timeline>
						{timeline.map((t, i) => <Status key={`${t.id}-${t.favorited}-${String(i)}`} status={t}/>)}
					</Timeline>
					<LoadMore
						className="load-more"
						onClick={() => {
							if (isLoadingMore || (timeline.length === 0 && !parameters)) {
								return;
							}

							loadMore();
						}}
					>
						{isLoadingMore || (timeline.length === 0 && !parameters) ? <LoadingOutlined/> : '更多'}
					</LoadMore>
				</Main>
				<Side>
					<ProfileSide/>
					<MenuSide activeKey="home"/>
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

const LoadMore = styled(Notice)`
	background-color: #f0f0f099;
	box-sizing: border-box;
	color: #22222299;
	height: 27px;	
	margin-bottom: 0;
	margin-top: 15px;
	
	&:hover {
		background-color: #f0f0f0;
	}
`;
