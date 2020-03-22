import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import slogan from '../assets/slogan.svg';
import uploadIcon from '../assets/upload-icon.svg';

export default @connect(
	state => ({
		text: state.postForm.text,
		file: state.postForm.file
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
		file: PropTypes.instanceOf(File),
		setText: PropTypes.func,
		setFile: PropTypes.func,
		update: PropTypes.func,
		upload: PropTypes.func
	}

	static defaultProps = {
		text: '',
		file: null,
		setText: () => {},
		setFile: () => {},
		update: () => {},
		upload: () => {}
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

	handleSubmit = event => {
		event.preventDefault();
		const {text, file, update, upload} = this.props;
		if (file) {
			upload({status: text});
		} else {
			update({status: text});
		}
	}

	render() {
		const {text, file} = this.props;

		return (
			<StyledPostForm onSubmit={this.handleSubmit}>
				<img src={slogan}/>
				<TextAreaWrapper>
					<TextArea
						autoComplete="off"
						rows="3"
						value={text}
						onChange={this.handleInput}
					/>
				</TextAreaWrapper>
				<Actions>
					<label htmlFor="photo">
						<UploadIcon hasFile={Boolean(file)}/>
					</label>
					{file ? <Clear onClick={this.handleClear}>×</Clear> : null}
					<FileInput id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/gif" onChange={this.handleUpload}/>
					<PostButton type="submit">发 送</PostButton>
				</Actions>
			</StyledPostForm>
		);
	}
}

const StyledPostForm = styled.form`
	margin-bottom: 10px;
`;

const TextAreaWrapper = styled.div`
	border: 4px solid #f3f7f8;
	width: 492px;
	border-radius: 3px;
	margin: 0.6em 0;
`;

const TextArea = styled.textarea`
	display: block;
	width: 482px;
	height: 4.6em;
	padding: 4px;
	resize: none;
	box-shadow: inset 0 0 1px #aaa;
  border: 1px solid rgb(125, 198, 221);
	font-size: 14px;
	font-family: HelveticaNeue, 'Helvetica Neue', Helvetica, Arial, sans-serif;

	&:focus {
		outline: 0;
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
	background-repeat: no-repeat;
	background-image: url(${uploadIcon});
	background-position-x: ${props => props.hasFile ? '-40px' : '0px'};
	cursor: pointer;

	&:active {
		background-position-x: -20px;
	}
`;

const Clear = styled.div`
	float: left;
	margin-left: 2px;
	font-size: 12px;
	font-weight: 800;
	color: #a6a6a6;
	cursor: pointer;
`;

const PostButton = styled.button`
	background-image: linear-gradient(#fff, #ccc);
	width: 96px;
	height: 28px;
	position: relative;
	float: right;
	right: 10px;
	font-size: 16px;
	font-weight: 700;
	color: #444;
	outline: 0;
	box-shadow: inset 0 0 1px #aaa;
	border: 1px solid #c3c3c3;
	border-radius: 5px;
	cursor: pointer;

	&:hover {
		color: #000;
	}
`;
