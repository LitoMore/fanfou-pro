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
		await fetchSearch({format: 'html', q});
		history.push(`/search/${q}`);
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
	width: 150px;
	height: 26px;
	padding: 0 5px;
	border-top: 1px solid;
	border-bottom: 1px solid ;
	border-left: 1px solid;
	border-right: 0;
	border-color: #ccc;
	outline: 0;
	border-radius: 5px 0 0 5px;
	box-shadow: none;
`;

const Button = styled.button`
	margin: 0;
	float: left;
	background-color: #f0f0f0;
	box-shadow: none;
	color: #222;
	position: relative;
	padding: 0 6px;
	height: 28px;
	line-height: 28px;
	border: 1px solid #ccc;
	font-size: 14px;
	outline: 0;
	border-radius: 0 5px 5px 0;
	cursor: pointer;
`;

const Container = styled.div`
	float: left;
	position: relative;
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
