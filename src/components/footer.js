import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import styled from 'styled-components';
import GitHubFooter from './github-footer';

export default class Footer extends React.Component {
	render() {
		return (
			<StyledFooter>
				<P>
					<Link to="/about">关于饭否</Link>
					<Link to="/more">更多玩法</Link>
					<Link to="/blog">团队博客</Link>
					<Link to="/api">API</Link>
					<Link to="/help">帮助</Link>
					<Link to="/help">用户条款</Link>
					<Link to="/privacy">隐私声明</Link>
					<Link to="/help">合作伙伴</Link>
				</P>
				<P>
					<a href="https://github.com/LitoMore/fanfou-pro" target="_blank" rel="noopener noreferrer">
						<GitHubFooter/>
					</a>
				</P>
			</StyledFooter>
		);
	}
}

const StyledFooter = styled.div`
	border-radius: 10px;
	background-color: white;
	padding: 5px;
	text-align: center;
	margin: 1.25em 0;
	font-size: 12px;
`;

const Link = styled(RouterLink)`
	color: #06c;
	text-decoration: none;
	padding: 1px;
	margin: 0 5px;

	&:visited {
		color: #06c;
	}

	&:hover {
		color: #06c;
	}
`;

const P = styled.p`
	margin: 0;

	&:nth-child(1) {
		margin-bottom: 6px;
	}
`;
