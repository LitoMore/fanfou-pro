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
		image: state.imageViewer.image,
	}),
	dispatch => ({
		open: dispatch.imageViewer.open,
		close: dispatch.imageViewer.close,
		toggleZoom: dispatch.imageViewer.toggleZoom,
	}),
)

class ImageViewer extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		isLoading: PropTypes.bool,
		isZoomed: PropTypes.bool,
		image: PropTypes.instanceOf(Image),
		close: PropTypes.func,
		toggleZoom: PropTypes.func,
	};

	static defaultProps = {
		isOpen: false,
		isLoading: false,
		isZoomed: false,
		image: null,
		close: () => {},
		toggleZoom: () => {},
	};

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeydown);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeydown);
	}

	handleKeydown = event => {
		const {isOpen, close} = this.props;

		if (event.keyCode === 27 && isOpen) {
			close();
		}
	};

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
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: scroll;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.8);
	text-align: center;
	transition: all 0.2s;
	
	${props => props.active ? `
		opacity: 1;
	` : `
		opacity: 0;
		visibility: hidden;
	`}
`;

const LoadingIndicator = styled(LoadingOutlined)`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	width: 32px;
	height: 32px;
	color: #fff;
	font-size: 32px;
`;

const Img = styled.img.attrs(props => ({
	src: props.image.src,
}))`
	position: relative;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	vertical-align: middle;

	${props => props.isZoomed ? `
		${props.canZoom ? 'cursor: zoom-out;' : ''}
	` : `
		${props.canZoom ? 'cursor: zoom-in;' : ''}
		max-height: 100%;
		max-width: 100%;
	`}
`;
