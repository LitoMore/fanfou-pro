import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import close from '../assets/close.svg';

export default @connect(
	state => ({
		isShow: state.postFormFloat.isShow,
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
		reference: PropTypes.string,
		text: PropTypes.string,
		setRef: PropTypes.func,
		hide: PropTypes.func,
		setText: PropTypes.func,
		update: PropTypes.func
	}

	static defaultProps = {
		isShow: false,
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
		const {isShow, reference, text, hide, update} = this.props;

		return (
			<Container isShow={isShow}>
				<Close onClick={hide}/>
				<Reference>{reference}</Reference>
				<TextAreaWrapper>
					<TextArea
						ref={this.ref}
						autoComplete="off"
						rows="3"
						value={text}
						onChange={this.handleInput}
					/>
				</TextAreaWrapper>
				<PostButton onClick={update}>发 送</PostButton>
			</Container>
		);
	}
}

const Container = styled.div`
	display: ${props => props.isShow ? 'block' : 'none'};
	position: fixed;
	margin: auto;
	border-radius: 10px;
	box-shadow: 0 0 10px #ccc;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 560px;
	height: 180px;
	background-color: rgba(255, 255, 255, 1);
`;

const Close = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	width: 10px;
	height: 10px;
	font-size: 20px;
	color: #666;
	cursor: pointer;
	background-image: url(${close});
`;

const Reference = styled.div`
	min-width: 10px;
	height: 17px;
	margin-top: 20px;
	margin-left: 30px;
	color: #666;
	padding-left: 5px;
	font-size: 12px;
`;

const TextAreaWrapper = styled.div`
	margin-top: 10px;
	margin-left: 30px;
	border: 4px solid #f3f7f8;
	width: 492px;
	border-radius: 3px;
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

const PostButton = styled.button`
	background-image: linear-gradient(#fff, #ccc);
	width: 96px;
	height: 28px;
	position: relative;
	float: right;
	margin-top: 10px;
	right: 35px;
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
