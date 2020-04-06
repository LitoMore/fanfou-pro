import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Status, ProfileSide, MenuSide, Paginator, SearchInput, Trends} from '../components';
import searchCreate from '../assets/search-create.svg';
import searchDestroy from '../assets/search-destroy.svg';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.search.timeline,
		parameters: state.search.parameters,
		list: state.trends.list
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.search.fetch,
		create: dispatch.trends.create,
		destroy: dispatch.trends.destroy
	})
)

class Search extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		current: PropTypes.object,
		timeline: PropTypes.array,
		parameters: PropTypes.object,
		list: PropTypes.array,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func,
		fetch: PropTypes.func,
		create: PropTypes.func,
		destroy: PropTypes.func
	}

	static defaultProps = {
		current: null,
		timeline: [],
		parameters: null,
		list: [],
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {},
		fetch: () => {},
		create: () => {},
		destroy: () => {}
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
		fetch({...parameters, format: 'html', q});
	}

	render() {
		const {match, current, timeline, parameters, list, fetch, create, destroy} = this.props;
		const {q} = match.params;

		if (!current) {
			return null;
		}

		const page = (parameters && parameters.page) || 1;
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
					{timeline.length > 0 ? (
						<Paginator
							total={Infinity}
							current={page}
							onChange={page => {
								fetch({id: current.id, page});
							}}
						/>
					) : null}
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

const Operation = styled.div`
	position: relative;
	font-size: 12px;
	height: 14px;
	line-height: 14px;
	margin-bottom: 10px;
	text-align: right;
	display: flex;
  align-items: center;
	color: #06c;
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
