import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class TabPane extends React.Component {
	static propTypes = {
		id: PropTypes.string,
		tab: PropTypes.node,
		isActive: PropTypes.bool,
		onClick: PropTypes.func,
	}

	static defaultProps = {
		id: 'default',
		tab: null,
		isActive: false,
		onClick: () => {},
	}

	render() {
		const {id, tab, isActive, onClick} = this.props;

		return (
			<TabButton id={id} isActive={isActive} onClick={onClick}>
				{tab}
			</TabButton>
		);
	}
}

export default class Tabs extends React.Component {
	static TabPane = TabPane

	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	render() {
		return (
			<Container>
				{this.props.children}
			</Container>
		);
	}
}

const Container = styled.div`
	position: relative;
`;

const TabButton = styled.button`
	position: relative;
	margin-bottom: -1px;
	padding: 0 10px;
	height: 30px;
	outline: 0;
	border: 1px solid #eee;
	border-radius: 3px 3px 0 0;
	background-color: white;
	color: #22222299;
	font-size: 14px;
	line-height: 30px;
	cursor: pointer;

	&:first-child {
		margin-left: 10px;
	}

	&:nth-child(n+2) {
		margin-left: 5px;
	}

	${props => props.isActive ? `
		border-bottom-color: white;
		color: #555;
	` : `
		background-color: #eeeeee99;
	`}
`;
