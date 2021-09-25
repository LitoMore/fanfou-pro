import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {LoadingOutlined} from '@ant-design/icons';
import slogan from '../assets/slogan.svg';
import uploadIcon from '../assets/upload-icon.svg';
import {fileToBase64ByQuality, convertBase64UrlToBlob} from '../utils/image-compression.js';

export default @connect(
	state => ({
		text: state.postForm.text,
		file: state.postForm.file,
		isPosting: state.postForm.isPosting,
	}),
	dispatch => ({
		setText: dispatch.postForm.setText,
		setFile: dispatch.postForm.setFile,
		update: dispatch.postForm.update,
		upload: dispatch.postForm.upload,
	}),
)

class PostForm extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		file: PropTypes.oneOfType([
			PropTypes.instanceOf(File),
			PropTypes.instanceOf(Blob),
		]),
		isPosting: PropTypes.bool,
		setText: PropTypes.func,
		setFile: PropTypes.func,
		update: PropTypes.func,
		upload: PropTypes.func,
	}

	static defaultProps = {
		text: '',
		file: null,
		isPosting: false,
		setText: () => {},
		setFile: () => {},
		update: () => {},
		upload: () => {},
	}

	ref = React.createRef()

	qucickSubmitFired = false

	state = {
		inputExpand: false,
	}

	handleFocus = () => {
		this.setState({inputExpand: true});
	}

	handleInput = event => {
		const {setText} = this.props;
		setText(event.target.value);
	}

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
	}

	handleClear = () => {
		const {setFile} = this.props;
		setFile(null);
	}

	handleSubmit = async event => {
		event.preventDefault();
		const {text, file, update, upload} = this.props;
		await (file ? upload({status: text}) : update({status: text}));

		this.ref.current.focus();
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
					const level = 82;
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
	}

	render() {
		const {text, file, isPosting} = this.props;
		const {inputExpand} = this.state;
		const textCount = 140 - text.length;

		return (
			<StyledPostForm onSubmit={this.handleSubmit}>
				<img src={slogan}/>
				<TextArea
					ref={this.ref}
					css={`height: ${inputExpand ? 85 : 30}px;`}
					autoComplete="off"
					rows={inputExpand ? 4 : 1}
					value={text}
					onFocus={this.handleFocus}
					onChange={this.handleInput}
					onKeyDown={this.handleKeyDown}
					onKeyUp={this.handleKeyUp}
					onPaste={this.handlePaste}
				/>
				{inputExpand ? (
					<Actions>
						<label htmlFor="photo">
							<UploadIcon hasFile={Boolean(file)}/>
						</label>
						{file ? <Clear onClick={this.handleClear}>×</Clear> : null}
						<FileInput id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/gif" onChange={this.handleUpload}/>
						<RightSide>
							<Counter exceed={textCount < 0}>{textCount}</Counter>
							<PostButton type="submit">
								{isPosting ? <LoadingOutlined/> : '发 送'}
							</PostButton>
						</RightSide>
					</Actions>
				) : null}
			</StyledPostForm>
		);
	}
}

const StyledPostForm = styled.form`
	margin-bottom: 15px;
`;

const TextArea = styled.textarea`
	display: block;
	margin: 10px 0;
	padding: 4px;
	width: 100%;
	border: 1px solid #bdbdbd;
	border-radius: 4px;
  font-size: 14px;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
	resize: none;
	transition: height 0.2s;

	&:focus {
		outline: 0;
		border-color: #0cf;
	}
`;

const Actions = styled.div`
	position: relative;
	left: 5px;
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
