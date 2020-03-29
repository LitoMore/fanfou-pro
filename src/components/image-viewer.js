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
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.8);
	text-align: center;
	
	${props => props.active ? `
		opacity: 1;
	` : `
		visibility: hidden;
		opacity: 0;
	`}
`;

const LoadingIndicator = styled(LoadingOutlined)`
	position: absolute;
	margin: auto;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	height: 32px;
	width: 32px;
	font-size: 32px;
	color: #fff;
`;

const Img = styled.img`
	position: relative;
	margin: auto;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	max-width: 100%;
	max-height: 100%;
	vertical-align: middle;
`;
