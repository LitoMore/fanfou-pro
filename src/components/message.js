import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';

export default @connect(
	state => ({
		message: state.message.message
	}),
	dispatch => ({
		setMessage: dispatch.message.setMessage
	})
)

class extends React.Component {
	static propTypes = {
		message: PropTypes.string,
		setMessage: PropTypes.func
	}

	static defaultProps = {
		message: '',
		setMessage: () => {}
	}

	timer = null

	componentDidUpdate() {
		const {message, setMessage} = this.props;

		if (message) {
			if (this.timer) {
				clearTimeout(this.timer);
			}

			this.timer = setTimeout(() => {
				setMessage('');
				this.timer = null;
			}, 3000);
		}
	}

	render() {
		const {message} = this.props;

		return (
			<StyledMessage display={message}>
				{message}
			</StyledMessage>
		);
	}
}

const StyledMessage = styled.div`
	opacity: ${props => props.display ? '1' : '0'};
	background-color: #fffaaa;
	position: fixed;
	top: 0;
	left: 0;
	padding: 8px 15px;
	text-align: center;
	border-bottom-right-radius: 5px;
`;

