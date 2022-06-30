function lookupKeys(uuid, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/mc/lookupKeys.php?id="+uuid, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			keysList = JSON.parse(xhr.responseText);
			callback(keysList);
		}
	}
    xhr.send();
	return xhr;
}

function lookupModules(uuid, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/mc/lookupModules.php?id="+uuid, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			moduleList = JSON.parse(xhr.responseText);
			callback(moduleList);
		}
	}
    xhr.send();
	return xhr;
}

function lookupUrls(uuid, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/mc/lookupUrls.php?id="+uuid, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			urlsList = JSON.parse(xhr.responseText);
			callback(urlsList);
		}
	}
    xhr.send();
	return xhr;
}

function submitKeys(keyLst, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/mc/submitKeys.php", true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			callback(JSON.parse(xhr.responseText));
		}
	}
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(keyLst));
	return xhr;
}