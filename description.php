<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="referrer" content="no-referrer" />
<title>The Pillager Bay - The overworlds most resilient black marketplace</title>
<link href="static/normalize.css" rel="stylesheet" type="text/css">
<link href="static/tpb.css" rel="stylesheet" type="text/css">

<script src="static/tinysort.min.js"></script>

<script src="mc/zip.min.js"></script>
<script src="mc/zip-fs.min.js"></script>
<script src="mc/mcbe.js"></script>
<script src="mc/aes2.js"></script>
<script src="mc/api.js"></script>

<script src="static/main.js"></script>

</head>
<body id="browse" onload="jswarnclear()">
<main>
<iframe id="downloadFrame" style="display: none;" width="0" height="0"></iframe>
<b><font color="RED"><label id="jscrwarn">Enable JS in your browser!</label></font></b>
<script>document.getElementById("jscrwarn").innerHTML='';</script>
<b><font color="RED"><label id="jscrwarn2">You may be blocking important javascript components, check that main.js is loaded or the webpage won't work.</label></font></b>
<h1>Details for: <label id="tlt"></label></h1>
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
<h2><label id="name"></label></h2>
<div id="metadata">
<dl id="meta-left" class="col-meta">
<div><dt class="dt-sm">Type:</dt><dd><label id="cat"></label></dd></div>
<div><dt class="dt-sm">Files:</dt><dd><label id="nfiles"></label></dd></div>
<div><dt class="dt-sm">Size:</dt><dd><label id="size"></label></dd></div>
<label id="imdb"></label>
<br />
<div><dt class="dt-md">Uploaded:</dt><dd><label id="uld"></label></dd></div>
<div><dt class="dt-md">By:</dt><dd><label id="user"></label></dd></div>
<br />
<div><dt class="dt-md">Seeders:</dt><dd><label id="s"></label></dd></div>
<div><dt class="dt-md">Leechers:</dt><dd><label id="l"></label></dd></div>
<div><dt class="dt-md">Store ID:</dt><dd style="overflow-wrap: break-word; overflow: hidden;"><label id="ih"></label></dd></div>
</dl>
<dl id="meta-right" class="col-meta">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" /></a> </dl>
</div>
<div class="links">
<label id="d"></label>
</div>
<div id="description_text" class="text-box"><label id="descr"></label></div>
<div class="links">
<label id="d2"></label>
</div>
<div id="filelist" class="text-box">
<ol>
<script>if (typeof make_filelist !== "undefined" ) make_filelist();</script>
</ol>
</div>
</div>
</section>
<section class="col-right ad120">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" /></a> </section>
</div>
<div class="adblock" id="ad-bottom">
<div class="ad728 align-center">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" /></a> </div>
<div class="ad468 align-center">
<a href="" style="text-decoration:none; border-bottom:none; color:none;"><img src="" style="text-decoration:none; border-bottom:none; color:none;" /></a> </div>
<div class="ad234 align-center">
<script type="application/javascript">
    var ad_idzone = "3804621",
    ad_width = "300",
    ad_height = "250"
</script>
<script type="application/javascript" src=""></script>
</div>
</div>
<script src="static/es5.js"></script>
<script>if (typeof make_details !== "undefined" ) make_details();</script>
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
storeId = <?php echo("\"".htmlspecialchars($_GET["id"], ENT_QUOTES)."\""); ?>;

function getKey(keyList, uuid){
	for(var i2 = 0; i2 < keyList.length; i2++){
		if(keyList[i2].KeyId == uuid) {
			return keysList[i2].Key;
		}
	}
	return "UNKNOWN";
}

function getUrl(ulList, UrlId){
	for(var i = 0; i < ulList.length; i++) {
		if(ulList[i].UrlId == UrlId) {
			return ulList[i].Url;
		}
	}
}





lookupUrls(storeId, function(urls) {
	window.urlList = urls;
	
	lookupModules(storeId, function(modules) {
		window.modList = modules;
		
		lookupKeys(storeId, function(keys) {
			keysList = keys;
			var dlsBlock = document.getElementById("mc-downloads");
			for(var i = 0; i < window.modList.length; i++){

				var keyId = modList[i].KeyId;
				var urlId = modList[i].UrlId;
				var zipName = modList[i].ZipName;
				var innerZipName = modList[i].InnerZipName;
				var module = modList[i].Module;
				
				var contentKey = getKey(keysList, keyId);
				document.querySelector("#fetching_info")?.remove();

				let a = document.createElement("a");
				let icon = document.createElement("img");
				a.onclick = (e) => {download_and_decrypt(e.target._url, e.target._key, e.target._keyid, e.target._name);};
				if(contentKey == "UNKNOWN")
					a.onclick = () => alert('No Key');

				a._url = getUrl(window.urlList, urlId);
				a._key = contentKey;
				a._keyid = keyId;
				a._name  = elements["name"];
				a.href = "#";

				switch(module) {
					case "skin_pack":
						icon.src = "/images/icon-skin.gif";
						a._name += ".mcpack";
						dl_text = " Skin Pack";
						break;
					case "resourcepack":
					case "resources":
						icon.src = "/images/icon-texture.gif";
						a._name += ".mcpack";
						dl_text = " Resource Pack";
						break;
					case "world_template":
						icon.src = "/images/icon-world.gif";
						a._name += ".mctemplate";
						dl_text = " World Template";
						break;
					case "persona_piece":
						icon.src = "/images/icon-persona.gif";
						a._name += ".zip";
						dl_text = " Persona";
						break;
					default:
						icon.src = "/images/icon-loading.gif";
						a._name += ".zip";
						dl_text = "";
						break;
				};
				
				if (contentKey == "UNKNOWN") {
					dl_text = "NO KEY for the " + dl_text + ".";
				} else {
					dl_text = "Download" + dl_text + ".";
				}
				a.appendChild(icon);
				a.appendChild(document.createTextNode(dl_text))
				dlsBlock.appendChild(a);
			}
		});
	});
});

</script>
</body>
</html>
