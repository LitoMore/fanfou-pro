export const init = () => {
	const request = indexedDB.open('fanfou_pro_db');
	let db = null;

	return new Promise((resolve, reject) => {
		request.addEventListener('success', () => {
			db = request.result;
			resolve(db);
		});

		request.addEventListener('upgradeneeded', event => {
			db = event.target.result;

			if (!db.objectStoreNames.contains('statuses_history')) {
				db.createObjectStore('statuses_history', {keyPath: 'id'});
			}
		});

		request.addEventListener('error', error => {
			reject(error);
		});
	});
};

export const addStatusesHistory = async status => {
	const db = await init();

	const request = db.transaction(['statuses_history'], 'readwrite')
		.objectStore('statuses_history')
		.add(status);

	return new Promise((resolve, reject) => {
		request.addEventListener('success', () => {
			resolve(status);
		});

		request.addEventListener('error', error => {
			reject(error);
		});
	});
};

export const loadStatusesHistory = async () => {
	const db = await init();

	const request = db.transaction(['statuses_history'])
		.objectStore('statuses_history')
		.openCursor();

	const statuses = [];

	return new Promise((resolve, reject) => {
		request.addEventListener('success', event => {
			const cursor = event.target.result;
			if (cursor) {
				statuses.push(cursor.value);
				cursor.continue();
			} else {
				resolve(statuses);
			}
		});

		request.addEventListener('error', error => {
			reject(error);
		});
	});
};

export const deleteStatusesHistory = async id => {
	const db = await init();

	const request = db.transaction(['statuses_history'], 'readwrite')
		.objectStore('statuses_history')
		.delete(id);

	return new Promise((resolve, reject) => {
		request.addEventListener('success', () => {
			resolve(id);
		});

		request.addEventListener('error', error => {
			reject(error);
		});
	});
};

export const deleteAllStatusesHistory = async () => {
	const db = await init();

	const request = db.transaction(['statuses_history'], 'readwrite')
		.objectStore('statuses_history')
		.clear();

	return new Promise((resolve, reject) => {
		request.addEventListener('success', () => {
			resolve();
		});

		request.addEventListener('error', error => {
			reject(error);
		});
	});
};

