import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {LoadingOutlined} from '@ant-design/icons';
import {Status, ProfileSide, MenuSide, SearchInput, Trends} from '../components';
import searchCreate from '../assets/search-create.svg';
import searchDestroy from '../assets/search-destroy.svg';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.search.timeline,
		parameters: state.search.parameters,
		isLoadingMore: state.search.isLoadingMore,
		list: state.trends.list
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.search.fetch,
		create: dispatch.trends.create,
		destroy: dispatch.trends.destroy,
		loadMore: dispatch.search.loadMore
	})
)

class Search extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		current: PropTypes.object,
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		isLoadingMore: PropTypes.bool,
		list: PropTypes.array,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func,
		fetch: PropTypes.func,
		create: PropTypes.func,
		destroy: PropTypes.func,
		loadMore: PropTypes.func
	}

	static defaultProps = {
		current: null,
		timeline: [],
		parameters: null,
		isLoadingMore: false,
		list: [],
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {},
		fetch: () => {},
		create: () => {},
		destroy: () => {},
		loadMore: () => {}
	}

	componentDidMount() {
		const {timeline, parameters, setPostFormPage, setPostFormFloatPage} = this.props;
		setPostFormPage('search');
		setPostFormFloatPage('search');
		if (timeline.length === 0 && !parameters) {
			this.fetchSearch();
		}
	}

	fetchSearch = async () => {
		const {match, parameters, fetch} = this.props;
		const {q} = match.params;
		fetch({...parameters, format: 'html', q, page: 1});
	}

	render() {
		const {match, current, timeline, parameters, isLoadingMore, list, create, destroy, loadMore} = this.props;
		const {q} = match.params;

		if (!current) {
			return null;
		}

		const foundQuery = list.find(l => l.query === q);

		return (
			<Container>
				<Main>
					{foundQuery ? (
						<Operation onClick={() => destroy(foundQuery.id)}><img src={searchDestroy}/><span>不再关注这个话题</span></Operation>
					) : (
						<Operation onClick={() => create(q)}><img src={searchCreate}/><span>关注这个话题</span></Operation>
					)}

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
					<MenuSide activeKey="search"/>
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

const Operation = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	height: 14px;
	color: #06c;
	text-align: right;
  font-size: 12px;
	line-height: 14px;
	cursor: pointer;

	img {
		margin-left: auto;
	}

	span {
		margin-left: 5px;
	}
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

const LoadMore = styled(Notice)`
	box-sizing: border-box;
	margin-top: 15px;
	margin-bottom: 0;
	height: 27px;	
	background-color: #f0f0f099;
	color: #22222299;
	
	&:hover {
		background-color: #f0f0f0;
	}
`;

// Const Audio = styled.audio`
// 	border-top: 1px solid #eee;
// 	width: 500px;
// 	padding-top: 15px;
// 	margin-bottom: 10px;
// 	outline: 0;
// `;
