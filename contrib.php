<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>The Pillager Bay - The overworlds most resilient black marketplace</title>
<link href="static/normalize.css" rel="stylesheet" type="text/css">
<link href="static/tpb.css" rel="stylesheet" type="text/css">

<script src="static/tinysort.min.js"></script>
<script src="mc/api.js"></script>
<script src="static/main.js"></script>

</head>
<body id="browse" onload="jswarnclear()">
<main>
<b><font color="RED"><label id="jscrwarn">Enable JS in your browser!</label></font></b>
<script>document.getElementById("jscrwarn").innerHTML='';</script>
<b><font color="RED"><label id="jscrwarn2">You may be blocking important javascript components, check that main.js is loaded or the webpage won't work.</label></font></b>
<h1><label id="toptxt">Upload Keys</label></h1>
<div class="adblock" id="ad-bottom">
<div class="ad728 align-center">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" /></a> </div>
<div class="ad468 align-center">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" style="text-decoration:none; border-bottom:none; color:none;" /></a> </div>
<div class="ad234 align-center">
<script type="application/javascript">
    var ad_idzone = "3804619",
    ad_width = "300",
    ad_height = "100"
</script>
<script type="application/javascript" src=""></script>
</div>
</div>
<div class="browse">
<section class="col-left ad120">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" /></a> </section>
<section class="col-center">
<div id="description_container">
	<div class="links">
		<table align="center">
			<tr><td>Upload your Keys!</td></tr>
			<tr><td>Doing this will add all marketplace contents you have purchased to the site!</td></tr>
			<tr><td>(No personally identifable information is ever transmitted to the server)</td></tr>
			<tr><td></td></tr>
			<tr><td></td></tr>
			<tr><td>How to (Windows)</td></tr>
			<tr><td>1)- Browse to <b>%LOCALAPPDATA%\packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState</b> </td></tr>
			<tr><td>2)- Select all files with a .ent extension</td></tr>
			<tr><td>3)- Click Open</tr></td>
			<tr><td><input type="file" id="entFiles" accept=".ent, .db" multiple></tr></td>
			<tr><td id="d2"></tr></td>
		</table>
	</div>
</div>
<input type="hidden" name="act" value="login">

</section>
<section class="col-right ad120">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" /></a> </section>
</div>
<div class="adblock" id="ad-bottom">
<div class="ad728 align-center">
<a href="0" style="text-decoration:none; border-bottom:none; color:none;"><img src="" /></a> </div>
<div class="ad468 align-center">
<a href="0" style="text-decoration:none; border-bottom:none; color:none;"><img src="" style="text-decoration:none; border-bottom:none; color:none;" /></a> </div>
<div class="ad234 align-center">
<script type="application/javascript">
    var ad_idzone = "3804621",
    ad_width = "300",
    ad_height = "250"
</script>
<script type="application/javascript" src=""></script>
</div>
</div>
</main>
<header class="row">
<script>print_header1()</script>
<input type="search" title="Pillager Search" name="q" placeholder="Search here..." id="search">
<script>document.getElementById("search").value = getParameterByName('q')</script>
<script>print_header2()</script>
<section class="col-right ad468" id="had468">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" style="text-decoration:none; border-bottom:none; color:none;" /></a> </section>
<section class="col-right ad234" id="had234">
</section>
</header>
<script>
print_footer();
mark_selected();
</script>
<script>do_pop()</script>
<script>do_interstitial()</script>
<script>

deviceId = null;
userId = null;

totalUploaded = 0;

submitQueue = [];


atob_og = window.atob;
atob = function(b64){
	var b64New = b64;
	for(var i = 0; i < 30; i++){
		try{
			return atob_og(b64New);
		}catch(DOMException){
			b64New += "=";
		}
	}
	return atob(b64);
}

function callbackUpld(cb){
	totalDone = 0;
	for(var i = 0; i < submitQueue.length; i++){
		if(submitQueue[i].readyState == 4)
			totalDone++;
	}
	var statusElem = document.getElementById("d2");
	if(totalDone < submitQueue.length) {
		statusElem.innerHTML = '<a href="javascript:void"><img src="/images/icon-loading.gif" /> Uploaded file '+totalDone.toString()+'/'+submitQueue.length.toString()+'</a>';
	}
	
	if(totalDone == submitQueue.length) {
		statusElem.innerHTML = '<a href="javascript:void"><img src="/images/icon-loading.gif" /> Done</a>';		
	}
}

function base64ToUint8array(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

function utf8toutf16(utf8Array) {
	var bytes = new Uint8Array(utf8Array.length * 2);
	for(var i = 0; i < utf8Array.length; i++){
		bytes[i*2] = utf8Array[i];
	}
	return bytes;
}

function deriveUserKey() {
	var devIdArray = utf8toutf16(new TextEncoder().encode(deviceId));
	var usrIdArray = utf8toutf16(new TextEncoder().encode(userId));
    
	var minSz = Math.min(devIdArray.length, usrIdArray.length);
	var userKey = new Uint8Array(minSz);
	
	for(var i = 0; i < minSz; i++) {
		userKey[i] = devIdArray[i] ^ usrIdArray[i];
	}
	
	return userKey;
}


function deriveContentKey(userKey, obfuscatedContentKey){
	var contentKeyDec = base64ToUint8array(obfuscatedContentKey);
	var minSz = Math.min(userKey.length, contentKeyDec.length);
	
	var workBuf = new Uint8Array(minSz);

	for(var i = 0; i < minSz; i++) {
		workBuf[i] = userKey[i] ^ contentKeyDec[i];
	}
	
	var realKeySize = Math.floor(minSz / 2);
	var realContentKey = new Uint8Array(realKeySize);
	
	for(var i = 0; i < minSz; i+=2) {
		realContentKey[Math.floor(i / 2)] = workBuf[i];
	}
	
	var keyStr = new TextDecoder().decode(realContentKey);
	return keyStr;
}

function readReceipt(receiptData){
	var contentKeys = []
	var receipt = JSON.parse(receiptData);	
	userId = receipt.Receipt.EntityId;
	
	if(receipt.Receipt.ReceiptData != undefined && receipt.Receipt.ReceiptData != null)
		deviceId = receipt.Receipt.ReceiptData.DeviceId;
	
	var userKey = deriveUserKey();
	for(var i = 0; i < receipt.Receipt.Entitlements.length; i++) {
		if(receipt.Receipt.Entitlements[i].ContentKey != undefined){
			contentKey = deriveContentKey(userKey, receipt.Receipt.Entitlements[i].ContentKey);
			friendlyId = receipt.Receipt.Entitlements[i].FriendlyId;
			contentKeys.push({"id": friendlyId, "contentKey": contentKey});
		}
	}
	
	return contentKeys;
}

function readKeysDb(readKeysDb){
	var contentKeys = []
	var keysList = readKeysDb.replace("\r", "").split('\n');
	
	for(var i = 0; i < keysList.length; i++) {
		var friendlyId = keysList[i].split('=')[0];
		var contentKey = keysList[i].split('=')[1];
		contentKeys.push({"id": friendlyId, "contentKey": contentKey});
	}
	
	return contentKeys;
}

function readInventory(entData){
	var keys = []
	var entitlements = JSON.parse(entData);
	
	if(entitlements.Receipt != undefined) {
		var receipt = atob(entitlements.Receipt.split('.')[1]) // 10/10 JWT parser lol
		var readKeys = readReceipt(receipt);
		keys = keys.concat(readKeys);
	}
	
	// Read all items
	if(entitlements.Items != undefined) {
		for(var i = 0; i < entitlements.Items.length; i++) { 
			if(entitlements.Items[i].Receipt != undefined){
				var receipt = atob(entitlements.Items[i].Receipt.split('.')[1]);
				var readKeys = readReceipt(receipt);
				keys = keys.concat(readKeys);
			}
		}
	}
	return keys;
	
}

const files = document.getElementById('entFiles');
files.addEventListener('change', () => {
	submitQueue = [];

	var statusElem = document.getElementById("d2");
	statusElem.innerHTML = '<a href="javascript:void"><img src="/images/icon-loading.gif" /> Uploading .. </a>';

	for(var i = 0; i < files.files.length; i++) {
		const f = files.files[i];
		var r = new FileReader();
		r.readAsText(f);
		
		if(f.name.toLowerCase().endsWith(".ent")) {
			r.onload = function(e) {
				submitQueue.push(submitKeys(readInventory(e.currentTarget.result), callbackUpld));
			}
		}
		
		if(f.name.toLowerCase().endsWith(".db")) {
			r.onload = function(e) {
				submitQueue.push(submitKeys(readKeysDb(e.currentTarget.result), callbackUpld));
			}
		}
	}  
});

</script>
</body>
</html>
