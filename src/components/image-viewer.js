import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {LoadingOutlined} from '@ant-design/icons';

export default @connect(
	state => ({
		isOpen: state.imageViewer.isOpen,
		isLoading: state.imageViewer.isLoading,
		image: state.imageViewer.image
	}),
	dispatch => ({
		open: dispatch.imageViewer.open,
		close: dispatch.imageViewer.close
	})
)

class ImageViewer extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		isLoading: PropTypes.bool,
		image: PropTypes.instanceOf(Image),
		close: PropTypes.func
	}

	static defaultProps = {
		isOpen: false,
		isLoading: false,
		image: null,
		close: () => {}
	}

	render() {
		const {isOpen, isLoading, image, close} = this.props;

		return (
			<Mask active={isOpen} onClick={close}>
				{isLoading ? <LoadingIndicator/> : null}
				{!isLoading && image ? <Img src={image.src}/> : null}
			</Mask>
		);
	}
}

const Mask = styled.div`
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
	display: flex;
	height: 100vh;
	justify-content: center;
	left: 0;
	position: fixed;
	text-align: center;
	top: 0;
	transition: all 0.2s;
	width: 100vw;
	
	${props => props.active ? `
		opacity: 1;
	` : `
		visibility: hidden;
		opacity: 0;
	`}
`;

const LoadingIndicator = styled(LoadingOutlined)`
	bottom: 0;
	color: #fff;
	font-size: 32px;
	height: 32px;
	left: 0;
	margin: auto;
	position: absolute;
	right: 0;
	top: 0;
	width: 32px;
`;

const Img = styled.img`
	bottom: 0;
	left: 0;
	margin: auto;
	max-height: 100%;
	max-width: 100%;
	position: relative;
	right: 0;
	top: 0;
	vertical-align: middle;
`;
