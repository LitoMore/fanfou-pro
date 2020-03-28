import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {LoadingOutlined} from '@ant-design/icons';
import {SystemNotice, PostForm, Status, ProfileSide, MenuSide, SearchInput} from '../components';

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
		const timelineIds = timeline.map(t => t.id);
		const newCount = cachedIds.filter(c => !timelineIds.includes(c)).length;

		return newCount > 0 ? (
			<CacheNotice onClick={mergeCache}>
				新增 <span>{cached.length > 99 ? '99+' : cached.length}</span> 条新消息，点击查看
			</CacheNotice>
		) : null;
	}

	render() {
		const {timeline, isLoadingMore, loadMore} = this.props;

		return (
			<Container>
				<Main>
					<SystemNotice/>
					<PostForm/>
					{this.renderCachedNotice()}
					<Timeline>
						{timeline.map(t => <Status key={`${t.id}-${t.favorited}`} status={t}/>)}
					</Timeline>
					<LoadMore
						className="load-more"
						onClick={() => {
							if (isLoadingMore) {
								return;
							}

							loadMore();
						}}
					>
						{isLoadingMore ? <LoadingOutlined/> : '更多'}
					</LoadMore>
				</Main>
				<Side>
					<ProfileSide/>
					<MenuSide activeKey="home"/>
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

const Notice = styled.div`
	clear: both;
	margin: 0 0 10px;
	padding: 5px 10px;
	border: 0;
	border-radius: 4px;
	font-size: 12px;
	text-align: center;
	cursor: pointer;

	& span {
		font-weight: bold;
	}
`;

const CacheNotice = styled(Notice)`
	color: #795548;
	background-color: #fff8e1;

	&:hover {
		background-color: #ffecb399;
	}
`;

const LoadMore = styled(Notice)`
	height: 27px;
	box-sizing: border-box;
	margin-top: 15px;
	margin-bottom: 0;	
	background-color: #f0f0f099;
	color: #22222299;
	
	&:hover {
		background-color: #f0f0f0;
	}
`;
