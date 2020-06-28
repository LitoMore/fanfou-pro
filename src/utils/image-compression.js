export const fileToBase64ByQuality = (file, quality, MAX_WIDTH) => {
	const fileReader = new FileReader();
	const type = file.type;
	return new Promise((resolve, reject) => {
		if (window.URL || window.webkitURL) {
			resolve(compress(URL.createObjectURL(file), quality, type, MAX_WIDTH));
		} else {
			fileReader.addEventListener('load', () => {
				resolve(compress(fileReader.result, quality, type, MAX_WIDTH));
			});
			fileReader.addEventListener('error', event => {
				reject(event);
			});
			fileReader.readAsDataURL(file);
		}
	});
};

// Setting compression max width

export const compress = (base64, quality, mimeType, MAX_WIDTH) => {
	const cvs = document.createElement('canvas');
	const img = document.createElement('img');
	img.crossOrigin = 'anonymous';
	return new Promise(resolve => {
		img.src = base64;
		img.addEventListener('load', () => {
			if (img.width > MAX_WIDTH) {
				cvs.width = MAX_WIDTH;
				cvs.height = img.height * MAX_WIDTH / img.width;
			} else {
				cvs.width = img.width;
				cvs.height = img.height;
			}

			cvs.getContext('2d').drawImage(img, 0, 0, cvs.width, cvs.height);
			const imageData = cvs.toDataURL(mimeType, quality / 100);
			resolve(imageData);
		});
	});
};

export const convertBase64UrlToBlob = (base64, mimeType) => {
	const bytes = window.atob(base64.split(',')[1]);
	const ab = new ArrayBuffer(bytes.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}

	const _blob = new Blob([ab], {type: mimeType});
	return _blob;
};
