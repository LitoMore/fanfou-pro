import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {LoadingOutlined} from '@ant-design/icons';
import slogan from '../assets/slogan.svg';
import uploadIcon from '../assets/upload-icon.svg';

export default @connect(
	state => ({
		text: state.postForm.text,
		file: state.postForm.file,
		isPosting: state.postForm.isPosting
	}),
	dispatch => ({
		setText: dispatch.postForm.setText,
		setFile: dispatch.postForm.setFile,
		update: dispatch.postForm.update,
		upload: dispatch.postForm.upload
	})
)

class PostForm extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		file: PropTypes.oneOfType([
			PropTypes.instanceOf(File),
			PropTypes.instanceOf(Blob)
		]),
		isPosting: PropTypes.bool,
		setText: PropTypes.func,
		setFile: PropTypes.func,
		update: PropTypes.func,
		upload: PropTypes.func
	}

	static defaultProps = {
		text: '',
		file: null,
		isPosting: false,
		setText: () => {},
		setFile: () => {},
		update: () => {},
		upload: () => {}
	}

	ref = React.createRef()

	qucickSubmitFired = false

	state = {
		inputExpand: false
	}

	handleFocus = () => {
		this.setState({inputExpand: true});
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
		const {text, file, update, upload} = this.props;
		if (file) {
			await upload({status: text});
		} else {
			await update({status: text});
		}

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
	border: 1px solid #bdbdbd;
	border-radius: 4px;
	display: block;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
	font-size: 14px;
	margin: 10px 0;
  padding: 4px;
	resize: none;
	transition: height 0.2s;
	width: 500px;

	&:focus {
		border-color: #0cf;
		outline: 0;
	}
`;

const Actions = styled.div`
	height: 28px;
	left: 5px;
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
	outline: 0;
	width: 115px;
`;
