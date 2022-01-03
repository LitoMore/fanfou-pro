import React from 'react';
import styled from 'styled-components';
import GitHubFooter from './github-footer.js';

export default class Footer extends React.Component {
	render() {
		return (
			<StyledFooter>
				<P>
					<Link href="http://help.fanfou.com/about.html">关于饭否</Link>
					<Link>更多玩法</Link>
					<Link href="http://github.com/FanfouAPI/FanFouAPIDoc/wiki/Apicategory">API</Link>
					<Link href="https://github.com/fanfoujs/fanfou-sdk-browser">SDK</Link>
					<Link href="https://join.slack.com/t/fanfoujs/shared_invite/zt-8tqp3exc-HcVpqP4fFu~UTFptotsBBg">Slack</Link>
					<Link href="http://help.fanfou.com/agreement.html">用户条款</Link>
					<Link href="http://help.fanfou.com/privacy.html">隐私声明</Link>
					<Link href="https://litomore.github.io/fanfou-export">消息备份</Link>
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
	margin: 1.25em 0;
	padding: 5px;
	border-radius: 10px;
	background-color: white;
	text-align: center;
	font-size: 12px;
`;

const Link = styled.a.attrs(() => ({
	target: '_blank',
	rel: 'noopener noreferrer',
}))`
	margin: 0 5px;
	padding: 1px;
	color: #06c;
	text-decoration: none;
	cursor: pointer;

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
