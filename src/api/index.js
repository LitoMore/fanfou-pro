import process from 'node:process';
import Fanfou from 'fanfou-sdk-browser';

export const consumerKey = '3a63ae91e9fed24065c67015ad341479';
export const consumerSecret = '1afe9c453d6d47c641e00b50690aba51';

export const oauthToken = localStorage.getItem('fanfouProToken');
export const oauthTokenSecret = localStorage.getItem('fanfouProTokenSecret');

const {REACT_APP_API_DOMAIN, REACT_APP_OAUTH_DOMAIN} = process.env;

export const ff = new Fanfou({
	consumerKey,
	consumerSecret,
	apiDomain: REACT_APP_API_DOMAIN,
	oauthDomain: REACT_APP_OAUTH_DOMAIN,
	protocol: 'https:',
	hooks: {
		baseString: string => string
			.replace('https', 'http'),
	},
});

if (oauthToken && oauthTokenSecret) {
	ff.oauthToken = oauthToken;
	ff.oauthTokenSecret = oauthTokenSecret;
}
