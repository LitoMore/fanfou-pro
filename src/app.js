import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import styled, {createGlobalStyle} from 'styled-components';
import {ff, consumerKey, consumerSecret} from './api';
import {Header, Footer} from './components';
import Message from './components/message';
import Home from './pages/home';
import Login from './pages/login';
import 'moment/locale/zh-cn';
import 'uprogress/dist/uprogress.css';
import './app.css';

const key = localStorage.getItem('fanfouProKey');
const secret = localStorage.getItem('fanfouProSecret');
const token = localStorage.getItem('fanfouProToken');
const tokenSecret = localStorage.getItem('fanfouProTokenSecret');

const PrivateRoute = props => {
	if (key && secret && token && tokenSecret) {
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

		if (key && secret && token && tokenSecret && key === consumerKey && secret === consumerSecret) {
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
		const {current} = this.props;
		const linkColor = current ? current.profile_link_color : '#06c';

		return (
			<Container>
				<Router>
					<GlobalStyle color={linkColor}/>
					<Header/>
					<Switch>
						<PrivateRoute path="/home" component={Home}/>
						<Route path="/login" component={Login}/>
						<Route path="/" component={Login}/>
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
