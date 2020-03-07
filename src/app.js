import React from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from './pages/login';

export default @connect(
	state => ({
		accounts: state.login.accounts
	})
)

class extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/login" component={Login}/>
				</Switch>
			</Router>
		);
	}
}
