import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import styled, {createGlobalStyle} from 'styled-components';
import {ff, consumerKey, consumerSecret, oauthToken, oauthTokenSecret} from './api';
import {Header, Footer, PostFormFloat} from './components';
import Message from './components/message';
import Home from './pages/home';
import Mentions from './pages/mentions';
import Favorites from './pages/favorites';
import User from './pages/user';
import Search from './pages/search';
import Follows from './pages/follows';
import Login from './pages/login';
import 'moment/locale/zh-cn';
import 'uprogress/dist/uprogress.css';
import './app.css';

const key = localStorage.getItem('fanfouProKey');
const secret = localStorage.getItem('fanfouProSecret');

const PrivateRoute = props => {
	if (key && secret && oauthToken && oauthTokenSecret) {
		return <Route {...props}/>;
	}

	return <Redirect to="/login"/>;
};

export default @connect(
	state => ({
		accounts: state.login.accounts,
		current: state.login.current
	}),
	dispatch => ({
		login: dispatch.login.login,
		load: dispatch.notification.load
	})
)

class extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		login: PropTypes.func,
		load: PropTypes.func
	}

	static defaultProps = {
		current: null,
		login: () => {},
		load: () => {}
	}

	notificationTimer = null

	async componentDidMount() {
		const {login, current} = this.props;

		if (key && secret && oauthToken && oauthTokenSecret && key === consumerKey && secret === consumerSecret) {
			if (!current) {
				try {
					const user = await ff.get('/users/show');
					login(user);
					this.runNotificationTimer();
				} catch {}
			}
		} else {
			localStorage.removeItem('fanfouProKey');
			localStorage.removeItem('fanfouProSecret');
			localStorage.removeItem('fanfouProToken');
			localStorage.removeItem('fanfouProTokenSecret');
		}
	}

	componentWillUnmount() {
		clearInterval(this.notificationTimer);
		this.notificationTimer = null;
	}

	runNotificationTimer = () => {
		this.props.load();
		this.notificationTimer = setInterval(() => {
			this.props.load();
		}, 30 * 1000);
	}

	render() {
		return (
			<Container>
				<Router>
					<GlobalStyle/>
					<Header/>
					<Switch>
						<PrivateRoute path="/home" component={Home}/>
						<PrivateRoute path="/mentions" component={Mentions}/>
						<PrivateRoute path="/favorites/:id" component={Favorites}/>
						<PrivateRoute path="/search/:q" component={Search}/>
						<PrivateRoute path="/followers/:id" component={Follows}/>
						<PrivateRoute path="/following/:id" component={Follows}/>
						<Route path="/login" component={Login}/>
						<PrivateRoute path="/:id" component={User}/>
						<Route exact path="/">
							{oauthToken && oauthTokenSecret ? <Redirect to="/home"/> : <Redirect to="/login"/>}
						</Route>
					</Switch>
					<Footer/>
					<Message/>
				</Router>
				<PostFormFloat/>
			</Container>
		);
	}
}

const GlobalStyle = createGlobalStyle`
	.uprogress .blur {
		box-shadow: 0 0 8px #06c, 0 0 4px #06c;
	}

	.uprogress .bar {
		background-color: #06c;
	}
`;

const Container = styled.div`
	width: 775px;
	margin: 0 auto;
`;
