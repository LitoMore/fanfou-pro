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
	top: -1px;
	display: inline-block;
	box-sizing: border-box;
	margin-left: 2px;
	padding: 0 6px;
	min-width: 20px;
	height: 20px;
	border-radius: 10px;
	background-color: #ff4d4f;
	color: white;
	text-align: center;
	font-weight: normal;
	font-size: 12px;
	line-height: 20px;
`;
