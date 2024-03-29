import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {LoadingOutlined} from '@ant-design/icons';
import close from '../assets/close.svg';
import uploadIcon from '../assets/upload-icon.svg';
import {fileToBase64ByQuality, convertBase64UrlToBlob} from '../utils/image-compression.js';

export default @connect(
	state => ({
		isShow: state.postFormFloat.isShow,
		isPosting: state.postFormFloat.isPosting,
		isResend: state.postFormFloat.isResend,
		reference: state.postFormFloat.reference,
		text: state.postFormFloat.text,
		file: state.postFormFloat.file,
	}),
	dispatch => ({
		setRef: dispatch.postFormFloat.setRef,
		hide: dispatch.postFormFloat.hide,
		setText: dispatch.postFormFloat.setText,
		setFile: dispatch.postFormFloat.setFile,
		update: dispatch.postFormFloat.update,
	}),
)

class PostFormFloat extends React.Component {
	static propTypes = {
		isShow: PropTypes.bool,
		isPosting: PropTypes.bool,
		isResend: PropTypes.bool,
		reference: PropTypes.string,
		text: PropTypes.string,
		file: PropTypes.oneOfType([
			PropTypes.instanceOf(File),
			PropTypes.instanceOf(Blob),
		]),
		setRef: PropTypes.func,
		hide: PropTypes.func,
		setText: PropTypes.func,
		setFile: PropTypes.func,
		update: PropTypes.func,
	};

	static defaultProps = {
		isShow: false,
		isPosting: false,
		isResend: false,
		reference: '',
		text: '',
		file: null,
		setRef: () => {},
		hide: () => {},
		setText: () => {},
		setFile: () => {},
		update: () => {},
	};

	ref = React.createRef();

	qucickSubmitFired = false;

	componentDidMount() {
		const {setRef} = this.props;
		setRef(this.ref);
	}

	handleInput = event => {
		const {setText} = this.props;
		setText(event.target.value);
	};

	handleUpload = async event => {
		const {files} = event.target;
		const {setFile} = this.props;
		if (files[0]) {
			if (files[0].size >= 5_000_000 && files[0].type !== 'image/gif') {
				// eslint-disable-next-line
				const answer = confirm('图片过大，将尝试对图片进行压缩');
				const level = 92;
				const max_width = 2200;
				if (answer === true) {
					const result = await fileToBase64ByQuality(files[0], level, max_width);
					const result_blob = convertBase64UrlToBlob(result, files[0].type);
					setFile(result_blob);
				} else {
					setFile(null);
				}
			} else {
				setFile(files[0]);
			}
		} else {
			setFile(null);
		}
	};

	handleClear = () => {
		const {setFile} = this.props;
		setFile(null);
	};

	handleSubmit = async event => {
		event.preventDefault();
		this.props.update();
	};

	handleKeyDown = event => {
		if (this.qucickSubmitFired) {
			return;
		}

		if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
			this.qucickSubmitFired = true;
			this.handleSubmit(event);
		}
	};

	handleKeyUp = event => {
		if (event.keyCode === 13 || event.keyCode === 93) {
			this.qucickSubmitFired = false;
		}
	};

	handlePaste = async event => {
		const {setFile} = this.props;
		const typeSet = new Set(['image/jpeg', 'image/png', 'image/gif']);

		if (event.clipboardData && event.clipboardData.items.length > 0) {
			const [item] = event.clipboardData.items;
			if (typeSet.has(item.type)) {
				const blob = item.getAsFile();
				if (blob.size >= 5_000_000 && blob.type !== 'image/gif') {
					// eslint-disable-next-line
					const answer = confirm('图片过大，将尝试对图片进行压缩');
					const level = 92;
					const max_width = 2200;
					if (answer === true) {
						const result = await fileToBase64ByQuality(blob, level, max_width);
						const result_blob = convertBase64UrlToBlob(result, blob.type);
						setFile(result_blob);
					} else {
						setFile(null);
					}
				} else {
					setFile(blob);
				}
			}
		}

		if (event.clipboardData && event.clipboardData.files.length > 0) {
			const [file] = event.clipboardData.files;
			if (typeSet.has(file.type)) {
				event.preventDefault();
				if (file.size >= 5_000_000 && file.type !== 'image/gif') {
					// eslint-disable-next-line
					const answer = confirm('图片过大，将尝试对图片进行压缩');
					const level = 42;
					const max_width = 1400;
					if (answer === true) {
						const result = await fileToBase64ByQuality(file, level, max_width);
						const result_blob = convertBase64UrlToBlob(result, file.type);
						setFile(result_blob);
					}
				} else {
					setFile(file);
				}
			}
		}
	};

	render() {
		const {isShow, isPosting, isResend, reference, text, file, hide} = this.props;
		const textCount = 140 - text.length;

		return (
			<Container isShow={isShow}>
				<Close onClick={hide}/>
				<Reference>{reference}</Reference>
				<form onSubmit={this.handleSubmit}>
					<TextArea
						ref={this.ref}
						autoComplete="off"
						rows={window.innerWidth > 450 ? 4 : 8}
						value={text}
						onChange={this.handleInput}
						onKeyDown={this.handleKeyDown}
						onKeyUp={this.handleKeyUp}
						onPaste={isResend ? this.handlePaste : () => {}}
					/>
					<Actions>
						{isResend ? (
							<>
								<label htmlFor="file">
									<UploadIcon hasFile={Boolean(file)}/>
								</label>
								{file ? <Clear onClick={this.handleClear}>×</Clear> : null}
								<FileInput id="file" name="file" type="file" accept="image/jpeg,image/png,image/gif" onChange={this.handleUpload}/>
							</>
						) : null}
						<RightSide>
							<Counter exceed={textCount < 0}>{textCount}</Counter>
							<PostButton type="submit">
								{isPosting ? <LoadingOutlined/> : '发 送'}
							</PostButton>
						</RightSide>
					</Actions>
				</form>
			</Container>
		);
	}
}

const Container = styled.div`
	backdrop-filter: blur(8px);
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	width: 560px;
	height: 200px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.75);
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
  transition: all 0.2s;

	${props => props.isShow ? `
		opacity: 1;
	` : `
		visibility: hidden;
		opacity: 0;
	`}

	@media (max-width: 560px) {
		width: calc(100% - 20px);
	}

	@media (max-width: 450px) {
		width: 100%;
		height: 275px;
		top: 0;
		bottom: unset;
		border-radius: 0 0 10px 10px;
	}
`;

const Close = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	width: 14px;
	height: 14px;
	background-image: url(${close});
	color: #666;
	font-size: 20px;
	cursor: pointer;
`;

const Reference = styled.div`
	margin-top: 30px;
	margin-left: 30px;
	padding-left: 5px;
	min-width: 10px;
	height: 17px;
	color: #666;
	font-size: 12px;
`;

const TextArea = styled.textarea`
	display: block;
	margin-top: 10px;
	margin-left: 30px;
	padding: 4px;
	width: calc(100% - 60px);
	height: 85px;
	border: 1px solid #bdbdbd;
  border-radius: 4px;
	font-size: 14px;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
	resize: none;

	&:focus {
		outline: 0;
		border-color: #0cf;
	}

	@media (max-width: 450px) {
		height: 160px;
	}
`;

const Actions = styled.div`
	position: relative;
	left: 5px;
	margin-top: 10px;
	margin-left: 30px;
	height: 28px;
`;

const FileInput = styled.input`
	display: none;
`;

const UploadIcon = styled.div`
	float: left;
	width: 20px;
	height: 16px;
	background-image: url(${uploadIcon});
	background-position-x: ${props => props.hasFile ? '-40px' : '0px'};
	background-repeat: no-repeat;
	cursor: pointer;

	&:active {
		background-position-x: -20px;
	}
`;

const Clear = styled.div`
	float: left;
	margin-left: 2px;
	color: #a6a6a6;
	font-weight: 800;
	font-size: 12px;
	cursor: pointer;
`;

const RightSide = styled.div`
	position: relative;
	right: 5px;
	float: right;
`;

const Counter = styled.div`
	float: left;
	padding-right: 8px;
	height: 32px;
	color: ${props => props.exceed ? '#c62828' : '#bdbdbd'};
	vertical-align: middle;
	font-size: 16px;
	line-height: 32px;
`;

const PostButton = styled.button`
	float: left;
	margin-right: 30px;
	width: 115px;
	height: 32px;
	outline: 0;
	border: 0;
	border-radius: 5px;
	background-color: #0cf;
	color: #fff;
	font-size: 14px;
	line-height: 32px;
	cursor: pointer;
`;
