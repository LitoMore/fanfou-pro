import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import styled, {createGlobalStyle} from 'styled-components';
import {ff, consumerKey, consumerSecret} from './api';
import {uProgress, Header, Footer} from './components';
import Message from './components/message';
import Login from './pages/login';
import 'uprogress/dist/uprogress.css';
import './app.css';

export default @connect(
	state => ({
		accounts: state.login.accounts,
		current: state.login.current
	}),
	dispatch => ({
		login: dispatch.login.login
	})
)

class extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		login: PropTypes.func
	}

	static defaultProps = {
		current: null,
		login: () => {}
	}

	async componentDidMount() {
		const {login} = this.props;

		const key = localStorage.getItem('fanfouProKey');
		const secret = localStorage.getItem('fanfouProSecret');
		const token = localStorage.getItem('fanfouProToken');
		const tokenSecret = localStorage.getItem('fanfouProTokenSecret');

		if (key && secret && token && tokenSecret && key === consumerKey && secret === consumerSecret) {
			try {
				uProgress.start();
				ff.consumerKey = key;
				ff.consumerSecret = secret;
				ff.oauthToken = token;
				ff.oauthTokenSecret = tokenSecret;
				const user = await ff.get('/users/show');
				login(user);
			} finally {
				uProgress.done();
			}
		} else {
			localStorage.removeItem('fanfouProKey');
			localStorage.removeItem('fanfouProSecret');
			localStorage.removeItem('fanfouProToken');
			localStorage.removeItem('fanfouProTokenSecret');
		}
	}

	render() {
		const {current} = this.props;
		const linkColor = current ? current.profile_link_color : '#06c';

		return (
			<Container>
				<Router>
					<GlobalStyle color={linkColor}/>
					<Header/>
					<Switch>
						<Route path="/login" component={Login}/>
					</Switch>
					<Footer/>
					<Message/>
				</Router>
			</Container>
		);
	}
}

const GlobalStyle = createGlobalStyle`
	.uprogress .blur {
		box-shadow: 0 0 8px ${props => props.color}, 0 0 4px ${props => props.color};
	}

	.uprogress .bar {
		background-color: ${props => props.color};
	}
`;

const Container = styled.div`
	width: 775px;
	margin: 0 auto;
`;

