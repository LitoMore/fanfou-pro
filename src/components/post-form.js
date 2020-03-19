import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import slogan from '../assets/slogan.svg';
import uploadIcon from '../assets/upload-icon.svg';

export default @connect(
	state => ({
		text: state.postForm.text
	}),
	dispatch => ({
		setText: dispatch.postForm.setText,
		update: dispatch.postForm.update
	})
)

class PostForm extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		setText: PropTypes.func,
		update: PropTypes.func
	}

	static defaultProps = {
		text: '',
		setText: () => {},
		update: () => {}
	}

	handleInput = event => {
		const {setText} = this.props;
		setText(event.target.value);
	}

	handleSubmit = event => {
		event.preventDefault();
		const {text, update} = this.props;
		update({status: text});
	}

	render() {
		const {text} = this.props;

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
					<label htmlFor="upload">
						<UploadIcon/>
					</label>
					<FileInput id="upload" type="file"/>
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
	background-image: url(${uploadIcon});
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

	&:hover {
		color: #000;
	}
`;
