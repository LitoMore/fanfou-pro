import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import styled, {createGlobalStyle} from 'styled-components';
import {ff, consumerKey, consumerSecret, oauthToken, oauthTokenSecret} from './api.js';
import {Header, Footer, PostFormFloat, ImageViewer} from './components.js';
import Message from './components/message.js';
import Home from './pages/home.js';
import Recents from './pages/recents.js';
import Mentions from './pages/mentions.js';
import Favorites from './pages/favorites.js';
import User from './pages/user.js';
import Search from './pages/search.js';
import Follows from './pages/follows.js';
import Login from './pages/login.js';
import Requests from './pages/requests.js';
import About from './pages/about.js';
import History from './pages/history.js';
import DirectMessages from './pages/direct-messages.js';
import Settings from './pages/settings.js';
import 'moment/locale/zh-cn.js';
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
		current: state.login.current,
	}),
	dispatch => ({
		login: dispatch.login.login,
		load: dispatch.notification.load,
	}),
)

class extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		login: PropTypes.func,
		load: PropTypes.func,
	}

	static defaultProps = {
		current: null,
		login: () => {},
		load: () => {},
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

		document.querySelector('#welcome').style.display = 'none';
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
						<PrivateRoute path="/recents" component={Recents}/>
						<PrivateRoute path="/mentions" component={Mentions}/>
						<PrivateRoute path="/friend.request" component={Requests}/>
						<PrivateRoute path="/history" component={History}/>
						<PrivateRoute path="/settings" component={Settings}/>
						<PrivateRoute path="/direct.messages" component={DirectMessages}/>
						<PrivateRoute path="/favorites/:id" component={Favorites}/>
						<PrivateRoute path="/search/:q" component={Search}/>
						<PrivateRoute path="/followers/:id" component={Follows}/>
						<PrivateRoute path="/following/:id" component={Follows}/>
						<Route path="/login" component={Login}/>
						<Route path="/about" component={About}/>
						<PrivateRoute path="/:id" component={User}/>
						<Route exact path="/">
							{oauthToken && oauthTokenSecret ? <Redirect to="/home"/> : <Redirect to="/login"/>}
						</Route>
					</Switch>
					<Footer/>
					<Message/>
				</Router>
				<PostFormFloat/>
				<ImageViewer/>
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
	margin: 0 auto;
	max-width: 775px;

	@media (max-width: 775px) {
		padding: 0 10px;
	}
`;
