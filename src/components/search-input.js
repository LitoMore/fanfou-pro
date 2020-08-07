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
	position: relative;
	float: left;
	padding: 0 5px;
	width: 150px;
	height: 26px;
	outline: 0;
	border-top: 1px solid #ccc;
	border-right: 0;
	border-bottom: 1px solid #ccc;
	border-left: 1px solid #ccc;
	border-radius: 5px 0 0 5px;
	box-shadow: none;
	font-size: 14px;
`;

const Button = styled.button`
	position: relative;
	float: left;
	margin: 0;
	padding: 0 6px;
	height: 26px;
	outline: 0;
	border: 1px solid #ccc;
	border-radius: 0 5px 5px 0;
	background-color: #f0f0f0;
	box-shadow: none;
	color: #666;
	font-size: 14px;
	line-height: 26px;
	cursor: pointer;
`;

const Container = styled.div`
	position: relative;
	float: left;
	margin: 10px 0;
	outline: 0;

	&:focus-within ${Input} {
		border-top-color: #0cf;
		border-bottom-color: #0cf;
		border-left-color: #0cf;
	}

	&:focus-within ${Button} {
		border-top-color: #0cf;
		border-right-color: #0cf;
		border-bottom-color: #0cf;
	}
`;
