const CONFIG = {
	"background": {
		"enabled": true,
		"color": "#000000",
		"images": [
			"images/hula-stitch.gif",
			"images/shantae-dance.gif",
			"images/betty-boop-hula.gif"
		],
		"interval": 2000
	},
	"clock": {
		"enabled": true,
		"color": "#FFFFFF",
		"size": "calc(1em + 1vw)",
		"position": "bottom-center"
	},
	"date": {
		"enabled": true,
		"color": "#FFFFFF",
		"size": "calc(1em + 1vw)",
		"position": "top-center"
	}
};

/**
 * Initialize the application
 */
const initialize = async () => {
	// const CONFIG = await loadConfig('config.json');
	// const CONFIG = require('config.json');
	// var config = require('config.json');
	
	if (CONFIG.background.enabled) {
		setupBackground();
		// if (CONFIG.background.interval) updateBackground();
	}
	
	if (CONFIG.date.enabled) {
		updateDate();
	}

	if (CONFIG.clock.enabled) {
		updateClock();
	}
};

/**
 * Load the config file
 * @param {String} file - The url of the config file
 */
const loadConfig = async file => {
	// var req = new XMLHttpRequest();
	// req.overrideMimeType("application/json");
	// req.open('GET', file, false);
	// req.onreadystatechange = () => {
	// 	if (req.readyState == 4 && req.status == "200") {
	// 		window.CONFIG = JSON.parse(req.responseText);
	// 	}
	// };
	
	// req.send(null);

	return await fetch(`${file}`);
//   .then(config => window.CONFIG = JSON.parse(req.responseText));
};

const setupBackground = () => {
	if (CONFIG.background.color) {
		document.body.style.backgroundColor = CONFIG.background.color;
	}
	
	if (CONFIG.background.images && CONFIG.background.images.length) {
// 		var image = document.createElement('img');
		
// 		image.src = CONFIG.background.images[0];
// 		image.id = 'backgroundImage';
		
// 		document.body.appendChild(image);
		document.body.style.backgroundImage = 'url(\''+CONFIG.background.images[0]+'\')';
	}
};

const updateBackground = () => {
	var index = CONFIG.background.images.indexOf(backgroundImage.src);
	
	index = CONFIG.background.images.length === index + 1 ? 0 : index + 1;
	
	backgroundImage.src = CONFIG.background.images[index];
	
	setInterval(updateBackground, CONFIG.background.interval)
}

const updateClock = () => {
	var timestamp = new Date();
	
	clock.innerText = timestamp.toLocaleTimeString();
	
	setInterval(updateClock, 2000);
}

const updateDate = () => {
	var timestamp = new Date();
	
	date.innerText = timestamp.toLocaleDateString();
	
	setInterval(updateDate, 60000);
}

const setPosition = (el, position) => {
	switch (position) {
		case 'top-left':
			el.style.top = 0;
			el.style.left = 0;
			break;
		case 'top-center':
			el.style.top = 0;
			el.style.left ='50%';
			break;
		case 'top-right':
			el.style.top = 0;
			el.style.right = 0;
		case 'center-left':
			el.style.top = '50%';
			el.style.left = 0;
			break;
		case 'center-center':
			el.style.top = '50%';
			el.style.left = '50%';
			break;
		case 'center-right':
			el.style.top = '50%';
			el.style.right = 0;
			break;
		case 'bottom-left':
			el.style.bottom = 0;
			el.style.left = 0;
			break;
		case 'bottom-center':
			el.style.bottom = 0;
			el.style.left = '50%';
			break;
		case 'bottom-right':
			el.style.bottom = 0;
			el.style.right = 0;
			break;
	}
}

// Page Load
window.onload = initialize;
