<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
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

function getUrl(ulList, filename){
	for(var i = 0; i < ulList.length; i++) {
		if(ulList[i].Url.endsWith(filename)) {
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
			for(var i = 0; i < window.modList.length; i++){
				var keyId = modList[i].KeyId;
				var zipName = modList[i].ZipName;
				var module = modList[i].Module;
				
				var contentKey = getKey(keysList, keyId);
				if (contentKey != "UNKNOWN") {
					var dlsBlock = document.getElementById("mc-downloads");
						
					if(dlsBlock.innerHTML == '<a href="javascript:void();"><img src="/images/icon-loading.gif"> Fetching Info... </a>')
						dlsBlock.innerHTML = '';

					var start = dlsBlock.innerHTML + '<a href="javascript:download_and_decrypt(\''+getUrl(window.urlList, zipName)+'\', \''+contentKey.replace("'", "\\'")+'\', \''+keyId+'\', \''+escape(elements["name"].replace("'", "\\'"))+'.REPLACEME\')">';
					if(module == "skin_pack")
						dlsBlock.innerHTML = start.replace("REPLACEME", "mcpack") + '<img src="/images/icon-skin.gif" /> Download Skin Pack.</a>';
					else if(module == "resources")
						dlsBlock.innerHTML = start.replace("REPLACEME", "mcpack") + '<img src="/images/icon-texture.gif" /> Download Resource Pack.</a>';
					else if(module == "world_template")
						dlsBlock.innerHTML = start.replace("REPLACEME", "mctemplate") + '<img src="/images/icon-world.gif" /> Download World Template.</a>';
					else if(module.startsWith("persona"))
						dlsBlock.innerHTML = start.replace("REPLACEME", "zip") + '<img src="/images/icon-persona.gif" /> Download Persona.</a>';
					else
						dlsBlock.innerHTML = start.replace("REPLACEME", "zip") + '<img src="/images/icon-loading.gif" /> Download.</a>';
				}
			}
		});
	});
});

</script>
</body>
</html>
