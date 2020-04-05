import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

export default @connect(
	state => ({
		accounts: state.login.accounts
	}),
	dispatch => ({
		notify: dispatch.message.notify,
		login: dispatch.login.login
	})
)

class extends React.Component {
	render() {
		return (
			<Container>
				<Main>
					To be written
				</Main>
			</Container>
		);
	}
}

const Container = styled.div`
	border-radius: 10px;
	overflow: hidden;
`;

const Base = styled.div`
	padding: 20px;
`;

const Main = styled(Base)`
	display: inline-block;
	box-sizing: border-box;
	vertical-align: top;
	width: 775px;
	background-color: white;
`;
