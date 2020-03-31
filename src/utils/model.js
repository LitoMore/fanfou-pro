export const ffErrorHandler = async error => {
	let errorMessage = error.message;
	try {
		const body = await error.response.text();
		const result = JSON.parse(body);

		if (result.error) {
			errorMessage = result.error;
		}
	} catch {}

	return errorMessage;
};
