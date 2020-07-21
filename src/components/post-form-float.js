import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {LoadingOutlined} from '@ant-design/icons';
import close from '../assets/close.svg';
import uploadIcon from '../assets/upload-icon.svg';

export default @connect(
	state => ({
		isShow: state.postFormFloat.isShow,
		isPosting: state.postFormFloat.isPosting,
		isResend: state.postFormFloat.isResend,
		reference: state.postFormFloat.reference,
		text: state.postFormFloat.text,
		file: state.postFormFloat.file
	}),
	dispatch => ({
		setRef: dispatch.postFormFloat.setRef,
		hide: dispatch.postFormFloat.hide,
		setText: dispatch.postFormFloat.setText,
		setFile: dispatch.postFormFloat.setFile,
		update: dispatch.postFormFloat.update
	})
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
			PropTypes.instanceOf(Blob)
		]),
		setRef: PropTypes.func,
		hide: PropTypes.func,
		setText: PropTypes.func,
		setFile: PropTypes.func,
		update: PropTypes.func
	}

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
		update: () => {}
	}

	ref = React.createRef()

	qucickSubmitFired = false

	componentDidMount() {
		const {setRef} = this.props;
		setRef(this.ref);
	}

	handleInput = event => {
		const {setText} = this.props;
		setText(event.target.value);
	}

	handleUpload = event => {
		const {files} = event.target;
		const {setFile} = this.props;
		if (files[0]) {
			setFile(files[0]);
		} else {
			setFile(null);
		}
	}

	handleClear = () => {
		const {setFile} = this.props;
		setFile(null);
	}

	handleSubmit = async event => {
		event.preventDefault();
		this.props.update();
	}

	handleKeyDown = event => {
		if (this.qucickSubmitFired) {
			return;
		}

		if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
			this.qucickSubmitFired = true;
			this.handleSubmit(event);
		}
	}

	handleKeyUp = event => {
		if (event.keyCode === 13 || event.keyCode === 93) {
			this.qucickSubmitFired = false;
		}
	}

	handlePaste = event => {
		const {setFile} = this.props;
		const typeSet = new Set(['image/jpeg', 'image/png', 'image/gif']);

		if (event.clipboardData && event.clipboardData.items.length > 0) {
			const [item] = event.clipboardData.items;
			if (typeSet.has(item.type)) {
				const blob = item.getAsFile();
				setFile(blob);
				return;
			}
		}

		if (event.clipboardData && event.clipboardData.files.length > 0) {
			const [file] = event.clipboardData.files;
			if (typeSet.has(file.type)) {
				event.preventDefault();
				setFile(file);
			}
		}
	}

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
						rows="4"
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
	background: rgba(255, 255, 255, 0.75);
	border-radius: 10px;
	bottom: 0;
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
	height: 200px;
	left: 0;
	margin: auto;
	position: fixed;
	right: 0;
	top: 0;
	transition: all 0.2s;
  width: 560px;

	${props => props.isShow ? `
		opacity: 1;
	` : `
		visibility: hidden;
		opacity: 0;
	`}
`;

const Close = styled.div`
	background-image: url(${close});
	color: #666;
	cursor: pointer;
	font-size: 20px;
	height: 14px;
	position: absolute;
	right: 10px;
	top: 10px;
	width: 14px;
`;

const Reference = styled.div`
	color: #666;
	font-size: 12px;
	height: 17px;
	margin-left: 30px;
	margin-top: 30px;
	min-width: 10px;
	padding-left: 5px;
`;

const TextArea = styled.textarea`
	border: 1px solid #bdbdbd;
	border-radius: 4px;
	display: block;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
	font-size: 14px;
	height: 85px;
	margin-left: 30px;
  margin-top: 10px;
	padding: 4px;
	resize: none;
	width: 500px;

	&:focus {
		border-color: #0cf;
		outline: 0;
	}
`;

const Actions = styled.div`
	height: 28px;
	left: 5px;
	margin-left: 30px;
	margin-top: 10px;
	position: relative;
`;

const FileInput = styled.input`
	display: none;
`;

const UploadIcon = styled.div`
	background-image: url(${uploadIcon});
	background-position-x: ${props => props.hasFile ? '-40px' : '0px'};
	background-repeat: no-repeat;
	cursor: pointer;
	float: left;
	height: 16px;
	width: 20px;

	&:active {
		background-position-x: -20px;
	}
`;

const Clear = styled.div`
	color: #a6a6a6;
	cursor: pointer;
	float: left;
	font-size: 12px;
	font-weight: 800;
	margin-left: 2px;
`;

const RightSide = styled.div`
	float: right;
	position: relative;
	right: 5px;
`;

const Counter = styled.div`
	color: ${props => props.exceed ? '#c62828' : '#bdbdbd'};
	float: left;
	font-size: 16px;
	height: 32px;
	line-height: 32px;
	padding-right: 8px;
	vertical-align: middle;
`;

const PostButton = styled.button`
	background-color: #0cf;
	border: 0;
	border-radius: 5px;
	color: #fff;
	cursor: pointer;
	float: left;
	font-size: 14px;
	height: 32px;
	line-height: 32px;
	margin-right: 30px;
	outline: 0;
	width: 115px;
`;
