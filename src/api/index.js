import Fanfou from 'fanfou-sdk-browser';

export const consumerKey = '3a63ae91e9fed24065c67015ad341479';
export const consumerSecret = '1afe9c453d6d47c641e00b50690aba51';

export const oauthToken = localStorage.getItem('fanfouProToken');
export const oauthTokenSecret = localStorage.getItem('fanfouProTokenSecret');

export const ff = new Fanfou({
	consumerKey,
	consumerSecret,
	apiDomain: 'cors.fanfou.pro',
	oauthDomain: 'cors.fanfou.pro',
	hooks: {
		baseString: string => string
			.replace('%2F%2Fcors.fanfou.pro%2Foauth', 'http%3A%2F%2Ffanfou.com%2Foauth')
			.replace('%2F%2Fcors.fanfou.pro', 'http%3A%2F%2Fapi.fanfou.com')
	}
});

if (oauthToken && oauthTokenSecret) {
	ff.oauthToken = oauthToken;
	ff.oauthTokenSecret = oauthTokenSecret;
}
