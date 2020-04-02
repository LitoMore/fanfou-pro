import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Status, ProfileSide, MenuSide, Paginator, SearchInput, Trends} from '../components';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.search.timeline,
		parameters: state.search.parameters
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.search.fetch
	})
)

class Search extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
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
		const {current, timeline, parameters, fetch} = this.props;

		if (!current) {
			return null;
		}

		const page = (parameters && parameters.page) || 1;

		return (
			<Container>
				<Main>
					<Timeline>
						{timeline.map(t => <Status key={`${t.id}-${t.favorited}`} status={t}/>)}
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

const Timeline = styled.div`
	border-top: 1px solid #eee;
`;
