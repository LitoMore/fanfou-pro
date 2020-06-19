export const fileToBase64ByQuality = (file, quality) => {
	const fileReader = new FileReader();
	const type = file.type;
	return new Promise((resolve, reject) => {
		if (window.URL || window.webkitURL) {
			resolve(compress(URL.createObjectURL(file), quality, type));
		} else {
			fileReader.addEventListener('load', () => {
				resolve(compress(fileReader.result, quality, type));
			});
			fileReader.addEventListener('error', event => {
				reject(event);
			});
			fileReader.readAsDataURL(file);
		}
	});
};

// Setting compression max width
const MAX_WIDTH = 2000;

export const compress = (base64, quality, mimeType) => {
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
	console.log(_blob);
	return _blob;
};
