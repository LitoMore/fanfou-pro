import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {LoadingOutlined} from '@ant-design/icons';

export default @connect(
	state => ({
		isOpen: state.imageViewer.isOpen,
		isLoading: state.imageViewer.isLoading,
		isZoomed: state.imageViewer.isZoomed,
		image: state.imageViewer.image
	}),
	dispatch => ({
		open: dispatch.imageViewer.open,
		close: dispatch.imageViewer.close,
		toggleZoom: dispatch.imageViewer.toggleZoom
	})
)

class ImageViewer extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		isLoading: PropTypes.bool,
		isZoomed: PropTypes.bool,
		image: PropTypes.instanceOf(Image),
		close: PropTypes.func,
		toggleZoom: PropTypes.func
	}

	static defaultProps = {
		isOpen: false,
		isLoading: false,
		isZoomed: false,
		image: null,
		close: () => {},
		toggleZoom: () => {}
	}

	render() {
		const {isOpen, isLoading, isZoomed, image, close, toggleZoom} = this.props;
		const canZoom = image && (image.height > window.innerHeight || image.width > window.innerWidth);

		return (
			<Mask active={isOpen} onClick={close}>
				{isLoading ? <LoadingIndicator/> : null}
				{!isLoading && image ? (
					<Img
						canZoom={canZoom}
						isZoomed={isZoomed}
						image={image}
						onClick={event => {
							if (canZoom) {
								event.stopPropagation();
								toggleZoom();
							}
						}}
					/>
				) : null}
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
	overflow: scroll;
	position: fixed;
	text-align: center;
	top: 0;
	transition: all 0.2s;
	width: 100vw;
	
	${props => props.active ? `
		opacity: 1;
	` : `
		opacity: 0;
		visibility: hidden;
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

const Img = styled.img.attrs(props => ({
	src: props.image.src
}))`
	bottom: 0;
	left: 0;
	margin: auto;
	position: relative;
	right: 0;
	top: 0;
	vertical-align: middle;

	${props => props.isZoomed ? `
		${props.canZoom ? 'cursor: zoom-out;' : ''}
	` : `
		${props.canZoom ? 'cursor: zoom-in;' : ''}
		max-height: 100%;
		max-width: 100%;
	`}
`;
