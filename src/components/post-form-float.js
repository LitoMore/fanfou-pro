import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {LoadingOutlined} from '@ant-design/icons';
import close from '../assets/close.svg';

export default @connect(
	state => ({
		isShow: state.postFormFloat.isShow,
		isPosting: state.postFormFloat.isPosting,
		reference: state.postFormFloat.reference,
		text: state.postFormFloat.text
	}),
	dispatch => ({
		setRef: dispatch.postFormFloat.setRef,
		hide: dispatch.postFormFloat.hide,
		setText: dispatch.postFormFloat.setText,
		update: dispatch.postFormFloat.update
	})
)

class PostFormFloat extends React.Component {
	static propTypes = {
		isShow: PropTypes.bool,
		isPosting: PropTypes.bool,
		reference: PropTypes.string,
		text: PropTypes.string,
		setRef: PropTypes.func,
		hide: PropTypes.func,
		setText: PropTypes.func,
		update: PropTypes.func
	}

	static defaultProps = {
		isShow: false,
		isPosting: false,
		reference: '',
		text: '',
		setRef: () => {},
		hide: () => {},
		setText: () => {},
		update: () => {}
	}

	ref = React.createRef()

	componentDidMount() {
		const {setRef} = this.props;
		setRef(this.ref);
	}

	handleInput = event => {
		const {setText} = this.props;
		setText(event.target.value);
	}

	render() {
		const {isShow, isPosting, reference, text, hide, update} = this.props;

		return (
			<Container isShow={isShow}>
				<Close onClick={hide}/>
				<Reference>{reference}</Reference>
				<TextArea
					ref={this.ref}
					autoComplete="off"
					rows="4"
					value={text}
					onChange={this.handleInput}
				/>
				<PostButton onClick={update}>
					{isPosting ? <LoadingOutlined/> : '发 送'}
				</PostButton>
			</Container>
		);
	}
}

const Container = styled.div`
	position: fixed;
	margin: auto;
	border-radius: 10px;
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
	transition: all 0.2s;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 560px;
	height: 200px;
	background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);

	${props => props.isShow ? `
		opacity: 1;
	` : `
		visibility: hidden;
		opacity: 0;
	`}
`;

const Close = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	width: 14px;
	height: 14px;
	font-size: 20px;
	color: #666;
	cursor: pointer;
	background-image: url(${close});
`;

const Reference = styled.div`
	min-width: 10px;
	height: 17px;
	margin-top: 30px;
	margin-left: 30px;
	color: #666;
	padding-left: 5px;
	font-size: 12px;
`;

const TextArea = styled.textarea`
	display: block;
	margin-top: 10px;
	margin-left: 30px;
	width: 490px;
	padding: 4px;
	resize: none;
  border: 1px solid #bdbdbd;
	border-radius: 4px;
	font-size: 14px;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;

	&:focus {
		border-color: #0cf;
		outline: 0;
	}
`;

const PostButton = styled.button`
	background-color: #0cf;
	width: 115px;
	height: 32px;
	position: relative;
	float: right;
	margin-top: 10px;
	right: 30px;
	font-size: 14px;
	color: #fff;
	outline: 0;
	border: 0;
	border-radius: 5px;
	cursor: pointer;
`;
