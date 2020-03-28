import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class Badge extends React.Component {
	static propTypes = {
		count: PropTypes.number
	}

	static defaultProps = {
		count: 0
	}

	render() {
		const {count} = this.props;

		if (count === 0) {
			return null;
		}

		return (
			<Container>{count}</Container>
		);
	}
}

const Container = styled.div`
	position: relative;
	display: inline-block;
	box-sizing: border-box;
	top: -1px;
	margin-left: 2px;
	min-width: 20px;
	height: 20px;
	line-height: 20px;
	padding: 0 6px;
	background-color: #ff4d4f;
	color: white;
	font-size: 12px;
	border-radius: 10px;
	font-weight: normal;
	text-align: center;
`;
