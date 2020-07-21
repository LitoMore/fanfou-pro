import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class TabPane extends React.Component {
	static propTypes = {
		id: PropTypes.string,
		tab: PropTypes.node,
		isActive: PropTypes.bool,
		onClick: PropTypes.func
	}

	static defaultProps = {
		id: 'default',
		tab: null,
		isActive: false,
		onClick: () => {}
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
		children: PropTypes.node.isRequired
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
	background-color: white;
	border: 1px solid #eee;
	border-radius: 3px 3px 0 0;
	color: #22222299;
	cursor: pointer;
	font-size: 14px;
	height: 30px;
	line-height: 30px;
	margin-bottom: -1px;
	outline: 0;
	padding: 0 10px;
	position: relative;

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
