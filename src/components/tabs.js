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
		id: '',
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
	font-size: 14px;
	position: relative;
	height: 30px;
	line-height: 30px;
	padding: 0 10px;
	border-radius: 3px 3px 0 0;
	border: 1px solid #eee;
	background-color: white;
	margin-bottom: -1px;
	outline: 0;
	cursor: pointer;

	&:first-child {
		margin-left: 10px;
	}

	&:nth-child(n+2) {
		margin-left: 5px;
	}

	${props => props.isActive ? `
		border-bottom-color: white;
	` : `
		color: #22222299;
	`}
`;
