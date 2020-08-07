import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

export default @withRouter @connect(
	state => ({
		list: state.trends.list
	}),
	dispatch => ({
		fetch: dispatch.trends.fetch,
		fetchSearch: dispatch.search.fetch
	})
)

class Trends extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		list: PropTypes.array,
		fetch: PropTypes.func,
		fetchSearch: PropTypes.func
	}

	static defaultProps = {
		list: [],
		fetch: () => {},
		fetchSearch: () => {}
	}

	componentDidMount() {
		const {list, fetch} = this.props;
		if (list.length === 0) {
			fetch();
		}
	}

	goToSearch = async q => {
		const {history, fetchSearch} = this.props;
		await fetchSearch({q});
		history.push(`/search/${q}`);
	}

	render() {
		const {list} = this.props;

		return (
			<Container>
				<Title>关注的话题</Title>
				{list.map(l => <Link key={l.id} onClick={() => this.goToSearch(l.query)}>{l.query}</Link>)}
			</Container>
		);
	}
}

const Container = styled.div`
	float: left;
`;

const Title = styled.div`
	margin-top: 10px;
	margin-bottom: 10px;
	font-weight: 600;
	font-size: 14px;
`;

const Link = styled.div`
	height: 28px;
	color: #06c;
	font-size: 12px;
	line-height: 28px;
	cursor: pointer;
`;
