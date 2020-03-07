import React from 'react';
import {connect} from 'react-redux';

export default @connect(
	state => ({
		accounts: state.login.accounts
	})
)

class extends React.Component {
	render() {
		return <div>login</div>;
	}
}
