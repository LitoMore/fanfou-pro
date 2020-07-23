import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {LoadingOutlined, LinkOutlined} from '@ant-design/icons';

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
				{!isLoading && image ?
					<ImgBox>
						<Img src={image.src}/>
						<JumpBox>
							<ViewJump>
								<LinkOutlined/>
								<a href={image.src} target="_blank" rel="noreferrer">查看原图</a>
							</ViewJump>
						</JumpBox>
					</ImgBox> : null}
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

const ImgBox = styled.div`
	display:flex;
	color: white;
`;

const JumpBox = styled.div`
	display: flex;
	justify-items: center;
	align-items: center;
	writing-mode: vertical-rl;
	&:hover {
		cursor: pointer;
	}
`;

const ViewJump = styled.a`
	display:flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: white;
	border: 1px solid #aaa;	
	border-radius: 3px;
	background: #666666;
	padding: 4px 4px;
	font-size: 12px;

  a {
		margin-top: 3px;
		text-decoration: none;
		color: #fff;		
	}
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
