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
	background-color: #ff4d4f;
	border-radius: 10px;
	box-sizing: border-box;
	color: white;
	display: inline-block;
	font-size: 12px;
	font-weight: normal;
	height: 20px;
	line-height: 20px;
	margin-left: 2px;
	min-width: 20px;
	padding: 0 6px;
	position: relative;
	text-align: center;
	top: -1px;
`;
