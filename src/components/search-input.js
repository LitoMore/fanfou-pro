import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

export default @withRouter @connect(
	_ => ({}),
	dispatch => ({
		fetchSearch: dispatch.search.fetch
	})
)

class SearchInput extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		fetchSearch: PropTypes.func
	}

	static defaultProps = {
		fetchSearch: () => {}
	}

	state = {
		q: ''
	}

	handleInput = event => {
		this.setState({q: event.target.value});
	}

	handleSearch = async event => {
		event.preventDefault();
		const {history, fetchSearch} = this.props;
		const {q} = this.state;
		if (q) {
			await fetchSearch({format: 'html', q});
			history.push(`/search/${q}`);
		}
	}

	render() {
		return (
			<Container>
				<form onSubmit={this.handleSearch}>
					<Input onChange={this.handleInput}/>
					<Button type="submit">搜索</Button>
				</form>
			</Container>
		);
	}
}

const Input = styled.input`
	border-bottom: 1px solid ;
	border-color: #ccc;
	border-left: 1px solid;
	border-radius: 5px 0 0 5px;
	border-right: 0;
	border-top: 1px solid;
	box-shadow: none;
	float: left;
	font-size: 14px;
	height: 26px;
	outline: 0;
	padding: 0 5px;
	position: relative;
	width: 150px;
`;

const Button = styled.button`
	background-color: #f0f0f0;
	border: 1px solid #ccc;
	border-radius: 0 5px 5px 0;
	box-shadow: none;
	color: #666;
	cursor: pointer;
	float: left;
	font-size: 14px;
	height: 26px;
	line-height: 26px;
	margin: 0;
	outline: 0;
	padding: 0 6px;
	position: relative;
`;

const Container = styled.div`
	float: left;
	margin: 10px 0;
	outline: 0;
	position: relative;

	&:focus-within ${Input} {
		border-bottom-color: #0cf;
		border-left-color: #0cf;
		border-top-color: #0cf;
	}

	&:focus-within ${Button} {
		border-bottom-color: #0cf;
		border-right-color: #0cf;
		border-top-color: #0cf;
	}
`;
