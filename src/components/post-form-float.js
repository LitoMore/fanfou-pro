import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import close from '../assets/close.svg';

export default @connect(
	state => ({
		isShow: state.postFormFloat.show
	})
)

class PostFormFloat extends React.Component {
	static propTypes = {
		isShow: PropTypes.bool
	}

	static defaultProps = {
		isShow: false
	}

	render() {
		const {isShow} = this.props;

		if (!isShow) {
			return null;
		}

		return (
			<Container>
				<Close/>
				<Reference>回复: 橫柯上蔽，在晝猶昏。疏條交映，有時見日。…回</Reference>
			</Container>
		);
	}
}

const Container = styled.div`
	position: fixed;
	margin: auto;
	border-radius: 10px;
	box-shadow: 0 0 10px #ccc;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 560px;
	height: 180px;
	background-color: rgba(255, 255, 255, 0.9);
`;

const Close = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	width: 10px;
	height: 10px;
	font-size: 20px;
	color: #666;
	cursor: pointer;
	background-image: url(${close});
`;

const Reference = styled.div`
	margin-top: 30px;
	margin-left: 30px;
	color: #666;
	padding-left: 5px;
	font-size: 12px;
`;
