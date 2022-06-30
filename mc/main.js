var server = '';
var static_server = '';

function jswarnclear() {
    document.getElementById("jscrwarn").innerHTML = '';
    document.getElementById("jscrwarn2").innerHTML = '';
}

function Get(yourUrl) {
    let Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}
function SetCorrectIcons(storeId){
	lookupUrls(storeId, function(urls) {
		lookupModules(storeId, function(modules) {
			lookupKeys(storeId, function(keys) {
				if(document.getElementById(storeId).innerHTML == '<img src="/images/icon-loading.gif">')
					document.getElementById(storeId).innerHTML = '';
				
				for(var i = 0; i < modules.length; i++){
					var setHtml = "";
					
					if(modules[i].Module == "skin_pack")
						setHtml += '<img alt="Skin pack" src="/images/icon-skin.gif"/> ';
					if(modules[i].Module == "resources")
						setHtml += '<img alt="Resource pack" src="/images/icon-texture.gif"/> ';
					if(modules[i].Module == "world_template")
						setHtml += '<img alt="World Template" src="/images/icon-world.gif"/> ';
					if(modules[i].Module.startsWith("persona"))
						setHtml += '<img alt="Persona peice" src="/images/icon-persona.gif"/> ';
					
					document.getElementById(storeId).innerHTML += setHtml;
				}
			})
		})
	});
}
function print_magnet(ih, name) {
    return '<span id="'+ih+'"><img src="/images/icon-loading.gif"/></span>';
}

function print_download2(ih, name, pos) {
    let dlbtn, before = '',
        after = '',
        lnk;
    return before + '<div id="mc-downloads"><a href="javascript:void();"><img src="/images/icon-loading.gif" /> Fetching Info... </a></div>' + after;
}

function print_trackers() {
    return "";
}

function print_status(status) {
    if (status == 'trusted') return '&nbsp;<img src="' + static_server + '/images/trusted.png" alt="Trusted"/>';
    if (status == 'vip') return '&nbsp;<img src="' + static_server + '/images/vip.gif" alt="VIP"/>';
    if (status == 'helper') return '&nbsp;<img src="' + static_server + '/images/helper.png" alt="Helper"/>';
    if (status == 'moderator') return '&nbsp;<img src="' + static_server + '/images/moderator.gif" alt="Moderator"/>';
    if (status == 'supermod') return '&nbsp;<img src="' + static_server + '/images/supermod.png" alt="Super Mod"/>';
    if (status == 'admin') return '&nbsp;<img src="' + static_server + '/images/admin.gif" alt="Admin"/>';
    return '&nbsp;';
}

function print_top100_title(cat) {
    let cc = cat.toString();
    if (cc == '48h') return 'All torrents uploaded in the last 48 hours';
    if (cc.substring(0, 4) == '48h_') {
        return print_category(cc.substring(4), 'top100:') + ' uploaded in the 48 hours';
    }
    if ((Number(cc.substring(0, 3)) > 99) && (Number(cc.substring(0, 3)) < 700)) {
        return print_category(cc.substring(0, 3), 'top100:');
    }
    return 'All torrents';
}

function print_category(cat, lnk) {
    if (typeof lnk === "undefined") lnk = 'category:';
    let main, cc = cat.toString();
    if (cat == 0) return '';
	main = "Marketplace Items";
    let maintxt = '<a href="/search.php?q=' + lnk + cc[0] + '00">' + main + '</a> > <a href="/search.php?q=' + lnk + cat + '">';
    if (cc[0] == 1) return maintxt + 'Skin Packs'+ '</a>';
    if (cc[0] == 2) return maintxt + 'Worlds' + '</a>';
    if (cc[0] == 3) return maintxt + 'Resoure Packs' + '</a>';
    if (cc[0] == 4) return maintxt + 'Personas' + '</a>';
	if (cc[0] == 5) return maintxt + 'Mash-Ups' + '</a>';
	if (cc[0] == 6) return maintxt + 'Unknown' + '</a>';
    return main;
}

function print_size(size, f) {
    let e = '';
    if (f) {
        e = '&nbsp;(' + size + ' Bytes)';
    }
    if (size >= 1125899906842624) return round_to_precision(size / 1125899906842624, 0.01) + '&nbsp;PiB' + e;
    if (size >= 1099511627776) return round_to_precision(size / 1099511627776, 0.01) + '&nbsp;TiB' + e;
    if (size >= 1073741824) return round_to_precision(size / 1073741824, 0.01) + '&nbsp;GiB' + e;
    if (size >= 1048576) return round_to_precision(size / 1048576, 0.01) + '&nbsp;MiB' + e;
    if (size >= 1024) return round_to_precision(size / 1024, 0.01) + '&nbsp;KiB' + e;
    return size + '&nbsp;B';
}

function round_to_precision(x, precision) {
    let y = +x + (precision === undefined ? 0.5 : precision / 2);
    let sz = y - (y % (precision === undefined ? 1 : +precision)) + '';
    if (sz.indexOf('.') == -1) return sz;
    else return sz.substring(0, sz.indexOf('.') + 3);
}

function print_date(date) {
    let dateObj = new Date(date * 1000);
    let m = dateObj.getUTCMonth() + 1;
    let d = dateObj.getUTCDate();
    let tt = dateObj.toTimeString();
    let mm;
    let dd;
    if (m < 10) mm = '0' + m
    else mm = m;
    if (d < 10) dd = '0' + d
    else dd = d;
    return '<label title="' + tt + '">' + dateObj.getUTCFullYear() + '-' + mm + '-' + dd + '</label>';
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function print_username(user) {
    if (user == "Anonymous") return "Anonymous";
    let u;
    u = encodeURIComponent(user);
    return '<a href="/search.php?q=user:' + u + '">' + user + '</a>';
}

function make_details() {
    let json_obj = JSON.parse(Get(server + '/t.php?id=' + encodeURIComponent(getParameterByName('id'))));
    window.elements = json_obj;
    document.getElementById("tlt").innerHTML = elements['name'];
    document.getElementById("name").innerHTML = elements['name'];
    document.getElementById("cat").innerHTML = print_category(elements['category']);
    document.getElementById("size").innerHTML = print_size(elements['size'], 1);
    document.getElementById("user").innerHTML = print_username(elements['username']) + '&nbsp;' + print_status(elements['status']);
    document.getElementById("ih").innerHTML = elements['info_hash'];
    document.getElementById("s").innerHTML = elements['seeders'];
    document.getElementById("l").innerHTML = elements['leechers'];
    document.getElementById("d").innerHTML = print_download2(elements['info_hash'], elements['name'], 0);
    document.getElementById("uld").innerHTML = print_date(elements['added']);
    document.getElementById("descr").innerHTML = elements['descr'];
    document.getElementById("nfiles").innerHTML = elements['num_files'];
    if (elements.hasOwnProperty('imdb')) {
        if (elements['imdb'] !== null) {
            document.getElementById("imdb").innerHTML = '<div><dt class="dt-sm">IMDB:</dt><dd><a href="https://www.imdb.com/title/' + elements['imdb'] + '" target="_imdb">' + elements['imdb'] + '</a>&snbsp;&nbsp;<a href="/search.php?q=' + elements['imdb'] + '">[search on TPB]</a></dd></div>';
        }
    }
}

function make_filelist() {
    let json_obj = JSON.parse(Get(server + '/f.php?id=' + encodeURIComponent(getParameterByName('id'))));
    let elements = json_obj;
    let i = 0;
    for (element in elements) {
        if (i == 1) {
            document.write('\n<li class="alt">');
            i = 0;
        } else {
            document.write('\n<li>');
            i = 1;
        }
        document.write('<span class="file-name">' + elements[element]['name'][0] + '</span><span class="file-size">' + print_size(elements[element]['size'][0], 0) + '</span></li>\n');
    }
}

function make_search() {
    let cats = '',
        lnk = 'category:',
        json_obj, i = 0,
        cpage;
    let qu = getParameterByName('q');
	let pageNo = getParameterByName('page');
	
	if(pageNo == null)
		pageNo = 0;

    if (getParameterByName('cat')) cats = cats + getParameterByName('cat');
    if (getParameterByName('worlds')) cats = cats + ',WORLD';
    if (getParameterByName('personas')) cats = cats + ',PERSONA';
    if (getParameterByName('resourcepacks')) cats = cats + ',RESOURCEPACK';
    if (getParameterByName('skinpacks')) cats = cats + ',SKINPACK';
	if (getParameterByName('mixed')) cats = cats + ',MIXED';
    if (cats[0] == ',') cats = cats.substring(1);
	
    if (qu.substring(0, 13) == 'top100:recent') {
        document.getElementById("tlt").innerHTML = 'Recent Uploads';
        if (qu.substring(0, 13) == 'top100:recent') {
            json_obj = JSON.parse(Get(server + '/precompiled/data_top100_recent.json'));
        }
        if (qu.substring(0, 14) == 'top100:recent:') {
            cpage = Number(get_q_part(qu, 2));
            if (cpage == 0) {
                json_obj = JSON.parse(Get(server + '/precompiled/data_top100_recent.json'));
            } else {
                json_obj = JSON.parse(Get(server + '/precompiled/data_top100_recent_' + cpage + '.json'));
            }
        }
    } else if (qu.substring(0, 7) == 'top100:') {
        json_obj = JSON.parse(Get(server + '/precompiled/data_top100_' + qu.substring(7) + '.json'));
        document.getElementById("tlt").innerHTML = 'Top 100: ' + print_top100_title(qu.substring(7));
        lnk = 'top100:';
    } else if (qu.substring(0, 9) == 'category:') {
        json_obj = JSON.parse(Get(server + '/q.php?q=' + encodeURIComponent(qu) + '&cat=' + cats + "&page="+ encodeURIComponent(pageNo)));
        document.getElementById("tlt").innerHTML = 'Browse ' + print_category(qu.substring(9));
    } else if (qu.substring(0, 5) == 'user:') {
        json_obj = JSON.parse(Get(server + '/q.php?q=' + encodeURIComponent(qu) + '&cat=' + cats + "&page="+ encodeURIComponent(pageNo)));
        document.getElementById("tlt").innerHTML = 'User: ' + htmlEntities(qu.substring(5));
    } else {
        json_obj = JSON.parse(Get(server + '/q.php?q=' + encodeURIComponent(qu) + '&cat=' + cats + "&page="+ encodeURIComponent(pageNo)));
        document.getElementById("tlt").innerHTML = 'Results for: ' + htmlEntities(qu);
    }
    window.elements = json_obj;
    for (element in elements) {
        if (i == 1) {
            document.write('\n<li class="list-entry alt" id="st">\n');
            i = 0;
        } else {
            document.write('\n<li class="list-entry" id="st">\n');
            i = 1;
        }
        document.write('<span class="list-item item-type">' + print_category(elements[element]['category'], lnk) + '</span>');
        document.write('<span class="list-item item-name item-title"><a href="/description.php?id=' + elements[element]['id'] + '">' + elements[element]['name'] + '</a></span>');
        document.write('<span class="list-item item-uploaded">' + print_date(elements[element]['added']) + '</span>');
        document.write('<span class="item-icons">' + print_magnet(elements[element]['info_hash'], elements[element]['name']) + print_status(elements[element]['status']) + '</span>');
        document.write('<span class="list-item item-size">' + print_size(elements[element]['size'], 0) + '<input type="hidden" name="size" value="' + elements[element]['size'] + '"/></span>');
        document.write('<span class="list-item item-seed">' + elements[element]['seeders'] + '</span>');
        document.write('<span class="list-item item-leech">' + elements[element]['leechers'] + '&nbsp;</span>');
        document.write('<span class="list-item item-user">' + print_username(elements[element]['username']) + '</span>\n</li>\n');
		
		SetCorrectIcons(elements[element]['info_hash']);
    }
    document.write('</ol>\n');
    
	if (qu.substring(0, 5) == 'user:') {
        document.write('<center>\n');
        if (get_q_part(qu, 1)) print_pageselector(get_q_part(qu, 1), Number(get_q_part(qu, 2)), '/search.php?q=user:' + htmlEntities(get_q_part(qu, 1)));
        document.write('<br />All uploads from this user <a href="/search.php?q=user:' + htmlEntities(get_q_part(qu, 1)) + ':today"><b>Today</b></a>&nbsp;|&nbsp;<a href="/search.php?q=user:' + htmlEntities(get_q_part(qu, 1)) + ':twodays">Last two days</a>&nbsp;|&nbsp;<a href="/search.php?q=user:' + htmlEntities(get_q_part(qu, 1)) + ':threedays">Last three days</a><br />');
        document.write('</center>\n');
    }
    
	if (qu.substring(0, 13) == 'top100:recent') {
        document.write('<center>\n');
        print_pageselector('recent', Number(get_q_part(qu, 2)), '/search.php?q=top100:recent');
        document.write('</center>\n');
    }
	
	var curUrl = location.href;
	if(curUrl.indexOf("page=") == -1)
		curUrl += "&page="+pageNo.toString();
	
	document.write("<center>");
	if(pageNo != 0){
		document.write("<a href=\""+curUrl.replace("page="+pageNo.toString(), "page="+(Number(pageNo)-1).toString())+"\"> Previous Page</a> ")
	}
	if(elements.length >= 50){
	document.write("<a href=\""+curUrl.replace("page="+pageNo.toString(), "page="+(Number(pageNo)+1).toString())+"\"> Next Page</a> ")
	}
	document.write("</center>");
	
	document.write('</section>\n');
}

function get_q_part(stra, part) {
    if (part == 2) {
        if (stra.split(':').length == 2) return 0;
        let pg = stra.split(':')[stra.split(':').length - 1];
        if (isNaN(pg)) return 0;
        if (pg == '') return 0;
        return Number(pg);
    }
    return stra.split(':')[part];
}

function setAll() {
    document.forms['q'].elements['skinpacks'].checked = false;
    document.forms['q'].elements['worlds'].checked = false;
    document.forms['q'].elements['resourcepacks'].checked = false;
    document.forms['q'].elements['personas'].checked = false;
}

function rmAll() {
    document.forms['q'].elements['all'].checked = false;
}
var sort_o = new Array(10);
sort_o[1] = 1;
sort_o[2] = 1;
sort_o[3] = 0;
sort_o[5] = 0;
sort_o[6] = 0;
sort_o[7] = 0;
sort_o[8] = 1;

function sortlist(sr) {
    if (sort_o[sr] == 1) {
        tinysort.defaults.order = 'asc';
        sort_o[sr] = 0;
    } else {
        tinysort.defaults.order = 'desc';
        sort_o[sr] = 1;
    }
    if (sr == 5) {
        tinysort('li#st', {
            selector: 'input',
            attr: 'value'
        });
        return;
    }
    tinysort('li#st', 'span:nth-child(' + sr + ')');
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function print_footer() {
    document.write('<footer class="row flow-root flow-column align-center">\n<nav>\n<div>\n</div>\n<div>\n<a href="http://piratebayo3klnzokct3wt5yyxb2vpebbuyjl7m623iaxmqhsd52coid.onion" title="tor address">TOR (New v3)</a> |\n<a href="https://www.minecraftforum.net/" title="discussion forum" target="_blank">Forum</a> |\n<a href="/contrib.php" title="discussion forum" target="_blank">Upload!</a>\n</div>\n</nav>\n<p style="overflow-wrap: break-word;">\n<a href="https://minecraft.net" target="_NEW">MINECOINS</a>: <b><a href="https://www.bestbuy.com/site/minecoins-3500-coin-in-game-currency-card/6350837.p?skuId=6350837#&intl=nosplash">Best Buy</a></b>\n</p>\n<br /><br />\n</footer>');
}

function print_header1() {
    document.write('<section class="col-left" id="logo"><a href="/index.html"><img src="' + static_server + '/images/tpbsmall_notext.png" width="82" height="82" alt="The Pillager Bay"></a></section>\n', '<section class="col-center">\n', '<nav>\n', '<a href="/index.html" title="Search the Black Market"><strong>Search&nbsp;the&nbsp;Black&nbsp;Market</strong></a> |\n', '<a href="/browse.php" title="Browse the Black Market">Browse&nbsp;the&nbsp;Black&nbsp;Market</a> |\n', '<a href="/search.php?q=top100:recent" title="Recent Uploads">Recent&nbsp;Uploads</a> |\n', '<a href="/top.php" title="Top 100">Top&nbsp;100</a>\n', '</nav>\n', '<form action="/search.php">\n');
}

function print_header2() {
    document.write('<input value="Pillager Search" type="submit">\n', '<select name="cat" id="cat">\n', '<option value="0">All</option>\n', '</select>\n', '</form>\n', '</section>\n');
}

function mark_selected() {
    let scate = document.getElementById('cat');
    if (scate) {
        let ct = getParameterByName('cat');
        if ((Number(ct) > 99) && (Number(ct) < 700)) {
            scate.value = ct;
        } else {
            scate.value = 0;
        }
    }
}

function print_search() {
    document.write('<section class="col-center">\n', '<input type="text" id="flist" onkeyup="filter_list2()" placeholder="Filter names.." size=40>');
    document.write(' Quick Filters: <label title="Skin Packs"><input name="skinPack"  id="f_skinpack"  onclick="filter_list2();" type="checkbox">Skin Packs</label>&nbsp;&nbsp;', '<label title="Worlds"><input  name="worlds"  id="f_worlds"  onclick="filter_list2();" type="checkbox">Worlds</label>&nbsp;&nbsp;', '<label title="resourcePacks"><input name="resourcePacks" id="f_resourcePacks" onclick="filter_list2();" type="checkbox">Resource Packs</label>&nbsp;&nbsp;', '<label title="Personas"><input name="personas" id="f_personas" onclick="filter_list2();" type="checkbox">Personas</label>&nbsp;&nbsp;', '<label title="Mash-Ups"><input  name="mixed"  id="f_mixed"  onclick="filter_list2();" type="checkbox">Mash-Ups</label>');
    document.write('<ol id="torrents" class="view-single">\n', '<li class="list-header">\n', '<span class="list-item list-header item-type"><label onclick="sortlist(1);" title="Order by Category">Category</label></span>\n', '<span class="list-item list-header item-name"><label onclick="sortlist(2);"  title="Order by Name">Name</label></span>\n', '<span class="list-item list-header item-uploaded"><label onclick="sortlist(3);" title="Order by Date Uploaded">Uploaded</label></span>\n', '<span class="list-item list-header item-icons">&nbsp;</span>\n', '<span class="list-item list-header item-size"><label onclick="sortlist(5);" title="Order by Size">Size</label></span>\n', '<span class="list-item list-header item-seed"><label onclick="sortlist(6);" title="Order by Seeders">SE</label></span>\n', '<span class="list-item list-header item-leech"><label onclick="sortlist(7);" title="Order by Leechers">LE</label></span>\n', '<span class="list-item list-header item-user"><label onclick="sortlist(8);" title="Order by ULed by">ULed by</label></span>\n', '</li>\n');


    if (typeof make_search !== "undefined") make_search();
}

function print_browse() {
    document.write('<section class="col-center">\n', '<dl class="row">\n', '<div class="category_list">\n', '<div>\n', '<dt><a href="/search.php?q=category:100" title="Audio">Audio</a></dt>\n', '<dd>\n', '<a href="/search.php?q=category:101" title="Music">Music</a>\n', '<a href="/search.php?q=category:102" title="Audio books">Audio books</a>\n', '<a href="/search.php?q=category:103" title="Sound clips">Sound clips</a>\n', '<a href="/search.php?q=category:104" title="FLAC">FLAC</a>\n', '<a href="/search.php?q=category:199" title="Other">Other</a>\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><a href="/search.php?q=category:200" title="Video">Video</a></dt>\n', '<dd>\n', '<a href="/search.php?q=category:201" title="Movies">Movies</a>\n', '<a href="/search.php?q=category:202" title="Movies DVDR">Movies DVDR</a>\n', '<a href="/search.php?q=category:203" title="Music videos">Music videos</a>\n', '<a href="/search.php?q=category:204" title="Movie clips">Movie clips</a>\n', '<a href="/search.php?q=category:205" title="TV shows">TV shows</a>\n', '<a href="/search.php?q=category:206" title="Handheld">Handheld</a>\n', '<a href="/search.php?q=category:207" title="HD - Movies">HD - Movies</a>\n', '<a href="/search.php?q=category:208" title="HD - TV shows">HD - TV shows</a>\n', '<a href="/search.php?q=category:209" title="3D">3D</a>\n', '<a href="/search.php?q=category:299" title="Other">Other</a>\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><a href="/search.php?q=category:300" title="Applications">Applications</a></dt>\n', '<dd>\n', '<a href="/search.php?q=category:301" title="Windows">Windows</a>\n', '<a href="/search.php?q=category:302" title="Mac">Mac</a>\n', '<a href="/search.php?q=category:303" title="UNIX">UNIX</a>\n', '<a href="/search.php?q=category:304" title="Handheld">Handheld</a>\n', '<a href="/search.php?q=category:305" title="IOS (iPad/iPhone)">IOS (iPad/iPhone)</a>\n', '<a href="/search.php?q=category:306" title="Android">Android</a>\n', '<a href="/search.php?q=category:399" title="Other OS">Other OS</a>\n', '</dd>\n', '</div>\n', '</div>\n', '<div class="category_list">\n', '<div>\n', '<dt><a href="/search.php?q=category:400" title="Games">Games</a></dt>\n', '<dd>\n', '<a href="/search.php?q=category:401" title="PC">PC</a>\n', '<a href="/search.php?q=category:402" title="Mac">Mac</a>\n', '<a href="/search.php?q=category:403" title="PSx">PSx</a>\n', '<a href="/search.php?q=category:404" title="XBOX360">XBOX360</a>\n', '<a href="/search.php?q=category:405" title="Wii">Wii</a>\n', '<a href="/search.php?q=category:406" title="Handheld">Handheld</a>\n', '<a href="/search.php?q=category:407" title="IOS (iPad/iPhone)">IOS (iPad/iPhone)</a>\n', '<a href="/search.php?q=category:408" title="Android">Android</a>\n', '<a href="/search.php?q=category:499" title="Other">Other</a>\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><a href="/search.php?q=category:500" title="Porn">Porn</a></dt>\n', '<dd>\n', '<a href="/search.php?q=category:501" title="Movies">Movies</a>,\n', '<a href="/search.php?q=category:502" title="Movies DVDR">Movies DVDR</a>\n', '<a href="/search.php?q=category:503" title="Pictures">Pictures</a>\n', '<a href="/search.php?q=category:504" title="Games">Games</a>\n', '<a href="/search.php?q=category:505" title="HD - Movies">HD - Movies</a>\n', '<a href="/search.php?q=category:506" title="Movie clips">Movie clips</a>\n', '<a href="/search.php?q=category:599" title="Other">Other</a>\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><a href="/search.php?q=category:600" title="Other">Other</a></dt>\n', '<dd>\n', '<a href="/search.php?q=category:601" title="E-books">E-books</a>\n', '<a href="/search.php?q=category:602" title="Comics">Comics</a>\n', '<a href="/search.php?q=category:603" title="Pictures">Pictures</a>\n', '<a href="/search.php?q=category:604" title="Covers">Covers</a>\n', '<span><a href="/search.php?q=category:605" title="Physibles">Physibles</a><a href=""><b>(?!)</b></a></span>\n', '<a href="/search.php?q=category:699" title="Other">Other</a>\n', '</dd>\n', '</div>\n', '</div>\n', '</dl>\n', '</section>\n');
}

function print_top() {
    document.write('<section class="col-center">\n', '<dl class="row">\n', '<div class="category_list">\n', '<b><a href="/search.php?q=top100:all">Total Top100</a></b> (<a href="/search.php?q=top100:48h">48h</a>)\n', '</div>\n', '</dl>\n', '<dl class="row">\n', '<div class="category_list">\n', '<div>\n', '<dt><b><a href="/search.php?q=top100:100" title="Audio">Audio</a></b> (<a href="/search.php?q=top100:48h_100">48h</a>)</dt>\n', '<dd>\n', '<a href="/search.php?q=top100:101" title="Music">Music</a> (<a href="/search.php?q=top100:48h_101">48h</a>)\n', '<a href="/search.php?q=top100:102" title="Audio books">Audio books</a> (<a href="/search.php?q=top100:48h_102">48h</a>)\n', '<a href="/search.php?q=top100:103" title="Sound clips">Sound clips</a> (<a href="/search.php?q=top100:48h_103">48h</a>)<br />\n', '<a href="/search.php?q=top100:104" title="FLAC">FLAC</a> (<a href="/search.php?q=top100:48h_104">48h</a>)\n', '<a href="/search.php?q=top100:199" title="Other">Other</a> (<a href="/search.php?q=top100:48h_199">48h</a>)\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><b><a href="/search.php?q=top100:200" title="Video">Video</a></b> (<a href="/search.php?q=top100:48h_200">48h</a>)</dt>\n', '<dd>\n', '<a href="/search.php?q=top100:201" title="Movies">Movies</a> (<a href="/search.php?q=top100:48h_201">48h</a>)\n', '<a href="/search.php?q=top100:202" title="Movies DVDR">Movies DVDR</a> (<a href="/search.php?q=top100:48h_202">48h</a>)\n', '<a href="/search.php?q=top100:203" title="Music videos">Music videos</a> (<a href="/search.php?q=top100:48h_203">48h</a>)<br />\n', '<a href="/search.php?q=top100:204" title="Movie clips">Movie clips</a> (<a href="/search.php?q=top100:48h_204">48h</a>)\n', '<a href="/search.php?q=top100:205" title="TV shows">TV shows</a> (<a href="/search.php?q=top100:48h_205">48h</a>)\n', '<a href="/search.php?q=top100:206" title="Handheld">Handheld</a> (<a href="/search.php?q=top100:48h_206">48h</a>)\n', '<a href="/search.php?q=top100:207" title="HD - Movies">HD - Movies</a> (<a href="/search.php?q=top100:48h_207">48h</a>)<br />\n', '<a href="/search.php?q=top100:208" title="HD - TV shows">HD - TV shows</a> (<a href="/search.php?q=top100:48h_208">48h</a>)\n', '<a href="/search.php?q=top100:209" title="3D">3D</a> (<a href="/search.php?q=top100:48h_209">48h</a>)\n', '<a href="/search.php?q=top100:299" title="Other">Other</a> (<a href="/search.php?q=top100:48h_299">48h</a>)\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><b><a href="/search.php?q=top100:300" title="Applications">Applications</a></b> (<a href="/search.php?q=top100:48h_400">48h</a>)</dt>\n', '<dd>\n', '<a href="/search.php?q=top100:301" title="Windows">Windows</a> (<a href="/search.php?q=top100:48h_301">48h</a>)\n', '<a href="/search.php?q=top100:302" title="Mac">Mac</a> (<a href="/search.php?q=top100:48h_302">48h</a>)\n', '<a href="/search.php?q=top100:303" title="UNIX">UNIX</a> (<a href="/search.php?q=top100:48h_303">48h</a>)\n', '<a href="/search.php?q=top100:304" title="Handheld">Handheld</a> (<a href="/search.php?q=top100:48h_304">48h</a>)<br />\n', '<a href="/search.php?q=top100:305" title="IOS (iPad/iPhone)">IOS (iPad/iPhone)</a> (<a href="/search.php?q=top100:48h_305">48h</a>)\n', '<a href="/search.php?q=top100:306" title="Android">Android</a> (<a href="/search.php?q=top100:48h_306">48h</a>)\n', '<a href="/search.php?q=top100:399" title="Other OS">Other OS</a> (<a href="/search.php?q=top100:48h_399">48h</a>)\n', '</dd>\n', '</div>\n', '</div>\n', '<div class="category_list">\n', '<div>\n', '<dt><b><a href="/search.php?q=top100:400" title="Games">Games</a></b> (<a href="/search.php?q=top100:48h_400">48h</a>)</dt>\n', '<dd>\n', '<a href="/search.php?q=top100:401" title="PC">PC</a> (<a href="/search.php?q=top100:48h_401">48h</a>)\n', '<a href="/search.php?q=top100:402" title="Mac">Mac</a> (<a href="/search.php?q=top100:48h_402">48h</a>)\n', '<a href="/search.php?q=top100:403" title="PSx">PSx</a> (<a href="/search.php?q=top100:48h_403">48h</a>)\n', '<a href="/search.php?q=top100:404" title="XBOX360">XBOX360</a> (<a href="/search.php?q=top100:48h_404">48h</a>)\n', '<a href="/search.php?q=top100:405" title="Wii">Wii</a> (<a href="/search.php?q=top100:48h_405">48h</a>)<br />\n', '<a href="/search.php?q=top100:406" title="Handheld">Handheld</a> (<a href="/search.php?q=top100:48h_406">48h</a>)\n', '<a href="/search.php?q=top100:407" title="IOS (iPad/iPhone)">IOS (iPad/iPhone)</a> (<a href="/search.php?q=top100:48h_407">48h</a>)\n', '<a href="/search.php?q=top100:408" title="Android">Android</a> (<a href="/search.php?q=top100:48h_408">48h</a>)\n', '<a href="/search.php?q=top100:499" title="Other">Other</a> (<a href="/search.php?q=top100:48h_499">48h</a>)\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><b><a href="/search.php?q=top100:500" title="Porn">Porn</a></b> (<a href="/search.php?q=top100:48h_500">48h</a>)</dt>\n', '<dd>\n', '<a href="/search.php?q=top100:501" title="Movies">Movies</a> (<a href="/search.php?q=top100:48h_501">48h</a>)\n', '<a href="/search.php?q=top100:502" title="Movies DVDR">Movies DVDR</a> (<a href="/search.php?q=top100:48h_502">48h</a>)\n', '<a href="/search.php?q=top100:503" title="Pictures">Pictures</a> (<a href="/search.php?q=top100:48h_503">48h</a>)\n', '<a href="/search.php?q=top100:504" title="Games">Games</a> (<a href="/search.php?q=top100:48h_504">48h</a>)\n', '<a href="/search.php?q=top100:505" title="HD - Movies">HD - Movies</a> (<a href="/search.php?q=top100:48h_505">48h</a>)\n', '<a href="/search.php?q=top100:506" title="Movie clips">Movie clips</a> (<a href="/search.php?q=top100:48h_506">48h</a>)\n', '<a href="/search.php?q=top100:599" title="Other">Other</a> (<a href="/search.php?q=top100:48h_599">48h</a>)\n', '</dd>\n', '</div>\n', '<div>\n', '<dt><b><a href="/search.php?q=top100:600" title="Other">Other</a></b> (<a href="/search.php?q=top100:48h_600">48h</a>)</dt>\n', '<dd>\n', '<a href="/search.php?q=top100:601" title="E-books">E-books</a> (<a href="/search.php?q=top100:48h_601">48h</a>)\n', '<a href="/search.php?q=top100:602" title="Comics">Comics</a> (<a href="/search.php?q=top100:48h_602">48h</a>)\n', '<a href="/search.php?q=top100:603" title="Pictures">Pictures</a> (<a href="/search.php?q=top100:48h_603">48h</a>)<br />\n', '<a href="/search.php?q=top100:604" title="Covers">Covers</a> (<a href="/search.php?q=top100:48h_604">48h</a>)\n', '<span><a href="/search.php?q=top100:605" title="Physibles">Physibles</a></a></span> (<a href="/search.php?q=top100:48h_605">48h</a>)\n', '<a href="/search.php?q=top100:699" title="Other">Other</a> (<a href="/search.php?q=top100:48h_699">48h</a>)\n', '</dd>\n', '</div>\n', '</div>\n', '</dl>\n', '</section>\n');
}

function do_pop_porn() {
	return;
}

function do_pop() {
    return;
}

function thepop(adConfig) {
    if (!window.document.querySelectorAll) {
        document.querySelectorAll = document.body.querySelectorAll = Object.querySelectorAll = function querySelectorAllPolyfill(r, c, i, j, a) {
            var d = document
              , s = d.createStyleSheet();
            a = d.all;
            c = [];
            r = r.replace(/\[for\b/gi, "[htmlFor").split(",");
            for (i = r.length; i--; ) {
                s.addRule(r[i], "k:v");
                for (j = a.length; j--; ) {
                    a[j].currentStyle.k && c.push(a[j])
                }
                s.removeRule(0)
            }
            return c
        }
    }
    var popMagic = {
        version: "1.0.0",
        cookie_name: "",
        url: "",
        config: {},
        open_count: 0,
        top: null,
        browser: null,
        configTpl: {
            ads_host: "",
            syndication_host: "",
            idzone: "",
            frequency_period: 720,
            frequency_count: 1,
            trigger_method: 1,
            trigger_class: "",
            popup_force: false,
            popup_fallback: false,
            chrome_enabled: true,
            new_tab: false,
            cat: "",
            tags: "",
            el: "",
            sub: "",
            sub2: "",
            sub3: "",
            only_inline: false
        },
        init: function(config) {
            if (typeof config.idzone === "undefined" || !config.idzone) {
                return
            }
            for (var key in this.configTpl) {
                if (!this.configTpl.hasOwnProperty(key)) {
                    continue
                }
                if (typeof config[key] !== "undefined") {
                    this.config[key] = config[key]
                } else {
                    this.config[key] = this.configTpl[key]
                }
            }
            if (typeof this.config.idzone === "undefined" || this.config.idzone === "") {
                return
            }
            if (this.config.only_inline !== true) {
                this.loadHosted()
            }
            this.addEventToElement(window, "load", this.preparePop)
        },
        getCountFromCookie: function() {
            var shownCookie = popMagic.getCookie(popMagic.cookie_name);
            var ctr = typeof shownCookie === "undefined" ? 0 : parseInt(shownCookie);
            if (isNaN(ctr)) {
                ctr = 0
            }
            return ctr
        },
        shouldShow: function() {
            if (popMagic.open_count >= popMagic.config.frequency_count) {
                return false
            }
            var ctr = popMagic.getCountFromCookie();
            popMagic.open_count = ctr;
            return !(ctr >= popMagic.config.frequency_count)
        },
        setAsOpened: function() {
            var new_ctr = 1;
            if (popMagic.open_count !== 0) {
                new_ctr = popMagic.open_count + 1
            } else {
                new_ctr = popMagic.getCountFromCookie() + 1
            }
            popMagic.setCookie(popMagic.cookie_name, new_ctr, popMagic.config.frequency_period);
            if (new_ctr >= popMagic.config.frequency_count) {
                popMagic.setCookie("nb-no-req-" + popMagic.config.idzone, true, popMagic.config.frequency_period)
            }
        },
        loadHosted: function() {
            var hostedScript = document.createElement("script");
            hostedScript.type = "text/javascript";
            hostedScript.async = true;
            hostedScript.src = "//" + this.config.ads_host + "/popunder1000.js";
            hostedScript.id = "popmagicldr";
            for (var key in this.config) {
                if (!this.config.hasOwnProperty(key)) {
                    continue
                }
                if (key === "ads_host" || key === "syndication_host") {
                    continue
                }
                hostedScript.setAttribute("data-exo-" + key, this.config[key])
            }
            var insertAnchor = document.getElementsByTagName("body").item(0);
            if (insertAnchor.firstChild) {
                insertAnchor.insertBefore(hostedScript, insertAnchor.firstChild)
            } else {
                insertAnchor.appendChild(hostedScript)
            }
        },
        preparePop: function() {
            if (typeof exoJsPop101 === "object" && exoJsPop101.hasOwnProperty("add")) {
                return
            }
            popMagic.top = self;
            if (popMagic.top !== self) {
                try {
                    if (top.document.location.toString()) {
                        popMagic.top = top
                    }
                } catch (err) {}
            }
            popMagic.cookie_name = "splashWeb-" + popMagic.config.idzone + "-42";
            popMagic.buildUrl();
            popMagic.browser = popMagic.browserDetector.detectBrowser(navigator.userAgent);
            if (!popMagic.config.chrome_enabled && (popMagic.browser.name === "chrome" || popMagic.browser.name === "crios")) {
                return
            }
            var popMethod = popMagic.getPopMethod(popMagic.browser);
            popMagic.addEvent("click", popMethod)
        },
        getPopMethod: function(browserInfo) {
            if (popMagic.config.popup_force) {
                return popMagic.methods.popup
            }
            if (popMagic.config.popup_fallback && browserInfo.name === "chrome" && browserInfo.version >= 68 && !browserInfo.isMobile) {
                return popMagic.methods.popup
            }
            if (browserInfo.isMobile) {
                return popMagic.methods.default
            }
            if (browserInfo.name === "chrome") {
                return popMagic.methods.chromeTab
            }
            return popMagic.methods.default
        },
        buildUrl: function() {
            var protocol = document.location.protocol !== "https:" && document.location.protocol !== "http:" ? "https:" : document.location.protocol;
            var p = top === self ? document.URL : document.referrer;
            var script_info = {
                type: "inline",
                name: "popMagic",
                ver: this.version
            };
            var encodeScriptInfo = function(script_info) {
                var result = script_info["type"] + "|" + script_info["name"] + "|" + script_info["ver"];
                return encodeURIComponent(btoa(result))
            };
            this.url = protocol + "//" + this.config.syndication_host + "/splash.php" + "?cat=" + this.config.cat + "&idzone=" + this.config.idzone + "&type=8" + "&p=" + encodeURIComponent(p) + "&sub=" + this.config.sub + (this.config.sub2 !== "" ? "&sub2=" + this.config.sub2 : "") + (this.config.sub3 !== "" ? "&sub3=" + this.config.sub3 : "") + "&block=1" + "&el=" + this.config.el + "&tags=" + this.config.tags + "&scr_info=" + encodeScriptInfo(script_info)
        },
        addEventToElement: function(obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false)
            } else if (obj.attachEvent) {
                obj["e" + type + fn] = fn;
                obj[type + fn] = function() {
                    obj["e" + type + fn](window.event)
                }
                ;
                obj.attachEvent("on" + type, obj[type + fn])
            } else {
                obj["on" + type] = obj["e" + type + fn]
            }
        },
        addEvent: function(type, fn) {
            var targetElements;
            if (popMagic.config.trigger_method == "3") {
                targetElements = document.querySelectorAll("a");
                for (i = 0; i < targetElements.length; i++) {
                    popMagic.addEventToElement(targetElements[i], type, fn)
                }
                return
            }
            if (popMagic.config.trigger_method == "2" && popMagic.config.trigger_method != "") {
                var trigger_classes;
                var trigger_classes_final = [];
                if (popMagic.config.trigger_class.indexOf(",") === -1) {
                    trigger_classes = popMagic.config.trigger_class.split(" ")
                } else {
                    var trimmed_trigger_classes = popMagic.config.trigger_class.replace(/\s/g, "");
                    trigger_classes = trimmed_trigger_classes.split(",")
                }
                for (var i = 0; i < trigger_classes.length; i++) {
                    if (trigger_classes[i] !== "") {
                        trigger_classes_final.push("." + trigger_classes[i])
                    }
                }
                targetElements = document.querySelectorAll(trigger_classes_final.join(", "));
                for (i = 0; i < targetElements.length; i++) {
                    popMagic.addEventToElement(targetElements[i], type, fn)
                }
                return
            }
            popMagic.addEventToElement(document, type, fn)
        },
        setCookie: function(name, value, ttl_minutes) {
            var now_date = new Date;
            now_date.setMinutes(now_date.getMinutes() + parseInt(ttl_minutes));
            var c_value = encodeURIComponent(value) + "; expires=" + now_date.toUTCString() + "; path=/";
            document.cookie = name + "=" + c_value
        },
        getCookie: function(name) {
            var i, x, y, cookiesArray = document.cookie.split(";");
            for (i = 0; i < cookiesArray.length; i++) {
                x = cookiesArray[i].substr(0, cookiesArray[i].indexOf("="));
                y = cookiesArray[i].substr(cookiesArray[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x === name) {
                    return decodeURIComponent(y)
                }
            }
        },
        randStr: function(length, possibleChars) {
            var text = "";
            var possible = possibleChars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length))
            }
            return text
        },
        isValidUserEvent: function(event) {
            if ("isTrusted"in event && event.isTrusted && popMagic.browser.name !== "ie" && popMagic.browser.name !== "safari") {
                return true
            } else {
                return event.screenX != 0 && event.screenY != 0
            }
        },
        isValidHref: function(href) {
            if (typeof href === "undefined" || href == "") {
                return false
            }
            var empty_ref = /\s?javascript\s?:/i;
            return !empty_ref.test(href)
        },
        findLinkToOpen: function(clickedElement) {
            var target = clickedElement;
            var location = false;
            try {
                var breakCtr = 0;
                while (breakCtr < 20 && !target.getAttribute("href") && target !== document && target.nodeName.toLowerCase() !== "html") {
                    target = target.parentNode;
                    breakCtr++
                }
                var elementTargetAttr = target.getAttribute("target");
                if (!elementTargetAttr || elementTargetAttr.indexOf("_blank") === -1) {
                    location = target.getAttribute("href")
                }
            } catch (err) {}
            if (!popMagic.isValidHref(location)) {
                location = false
            }
            return location || window.location.href
        },
        getPuId: function() {
            return "ok_" + Math.floor(89999999 * Math.random() + 1e7)
        },
        browserDetector: {
            browserDefinitions: [["firefox", /Firefox\/([0-9.]+)(?:\s|$)/], ["opera", /Opera\/([0-9.]+)(?:\s|$)/], ["opera", /OPR\/([0-9.]+)(:?\s|$)$/], ["edge", /Edge\/([0-9._]+)/], ["ie", /Trident\/7\.0.*rv:([0-9.]+)\).*Gecko$/], ["ie", /MSIE\s([0-9.]+);.*Trident\/[4-7].0/], ["ie", /MSIE\s(7\.0)/], ["safari", /Version\/([0-9._]+).*Safari/], ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/], ["bb10", /BB10;\sTouch.*Version\/([0-9.]+)/], ["android", /Android\s([0-9.]+)/], ["ios", /Version\/([0-9._]+).*Mobile.*Safari.*/], ["yandexbrowser", /YaBrowser\/([0-9._]+)/], ["crios", /CriOS\/([0-9.]+)(:?\s|$)/]],
            detectBrowser: function(userAgent) {
                var isMobile = userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WebOS|Windows Phone/i);
                for (var i in this.browserDefinitions) {
                    var definition = this.browserDefinitions[i];
                    if (definition[1].test(userAgent)) {
                        var match = definition[1].exec(userAgent);
                        var version = match && match[1].split(/[._]/).slice(0, 3);
                        var versionTails = Array.prototype.slice.call(version, 1).join("") || "0";
                        if (version && version.length < 3) {
                            Array.prototype.push.apply(version, version.length === 1 ? [0, 0] : [0])
                        }
                        return {
                            name: definition[0],
                            version: version.join("."),
                            versionNumber: parseFloat(version[0] + "." + versionTails),
                            isMobile: isMobile
                        }
                    }
                }
                return {
                    name: "other",
                    version: "1.0",
                    versionNumber: 1,
                    isMobile: isMobile
                }
            }
        },
        methods: {
            default: function(triggeredEvent) {
                if (!popMagic.shouldShow() || !popMagic.isValidUserEvent(triggeredEvent))
                    return true;
                var clickedElement = triggeredEvent.target || triggeredEvent.srcElement;
                var href = popMagic.findLinkToOpen(clickedElement);
                window.open(href, "_blank");
                popMagic.setAsOpened();
                popMagic.top.document.location = popMagic.url;
                if (typeof triggeredEvent.preventDefault !== "undefined") {
                    triggeredEvent.preventDefault();
                    triggeredEvent.stopPropagation()
                }
                return true
            },
            chromeTab: function(event) {
                if (!popMagic.shouldShow() || !popMagic.isValidUserEvent(event))
                    return true;
                if (typeof event.preventDefault !== "undefined") {
                    event.preventDefault();
                    event.stopPropagation()
                } else {
                    return true
                }
                var a = top.window.document.createElement("a");
                var target = event.target || event.srcElement;
                a.href = popMagic.findLinkToOpen(target);
                document.getElementsByTagName("body")[0].appendChild(a);
                var e = new MouseEvent("click",{
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    screenX: 0,
                    screenY: 0,
                    clientX: 0,
                    clientY: 0,
                    ctrlKey: true,
                    altKey: false,
                    shiftKey: false,
                    metaKey: true,
                    button: 0
                });
                e.preventDefault = undefined;
                a.dispatchEvent(e);
                a.parentNode.removeChild(a);
                window.open(popMagic.url, "_self");
                popMagic.setAsOpened()
            },
            popup: function(triggeredEvent) {
                if (!popMagic.shouldShow() || !popMagic.isValidUserEvent(triggeredEvent))
                    return true;
                var winOptions = "";
                if (popMagic.config.popup_fallback && !popMagic.config.popup_force) {
                    var height = Math.max(Math.round(window.innerHeight * .8), 300);
                    var width = Math.max(Math.round(window.innerWidth * .7), 300);
                    var top = window.screenY + 100;
                    var left = window.screenX + 100;
                    winOptions = "menubar=1,resizable=1,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
                }
                var prePopUrl = document.location.href;
                var popWin = window.open(prePopUrl, popMagic.getPuId(), winOptions);
                setTimeout(function() {
                    popWin.location.href = popMagic.url
                }, 200);
                popMagic.setAsOpened();
                if (typeof triggeredEvent.preventDefault !== "undefined") {
                    triggeredEvent.preventDefault();
                    triggeredEvent.stopPropagation()
                }
            }
        }
    };
    popMagic.init(adConfig);
}

function print_selector_number(i, curpage, linkto) {
    let before, after;
    if (i == curpage) {
        before = '<b>';
        after = '</b>';
    } else {
        before = '<a href="' + linkto + ':' + i + '">';
        after = '</a>';
    }
    document.write(before, i + 1, after, ' \n');
}

function print_pageselector(username, curpage, linkto) {
    let json_obj = JSON.parse(Get(server + '/q.php?q=pcnt:' + username));
    window.elements = json_obj;
    let pages = Number(elements) - 1;
    let before, after, o, i, strt, stp;
    if (pages < 2) return '';
    if (pages < 30) {
        for (i = 0; i < pages; i++) {
            print_selector_number(i, curpage, linkto);
        }
    } else {
        if (curpage - 10 > 5) {
            strt = curpage - 10;
            if (strt > pages - 25) strt = pages - 25;
            print_selector_number(0, curpage, linkto);
            print_selector_number(1, curpage, linkto);
            print_selector_number(2, curpage, linkto);
            document.write('... ');
        } else {
            strt = 0;
        }
        if (pages - curpage - 10 > 5) {
            stp = curpage + 11;
            if (stp < 27) stp = 26;
            if (stp > pages) stp = pages;
        } else {
            if (strt == 0) {
                stp = 16;
            } else {
                stp = pages;
            }
        }
        for (i = strt; i < stp; i++) {
            print_selector_number(i, curpage, linkto);
        }
        if (pages - curpage - 10 > 5) {
            document.write('... ');
            print_selector_number(pages - 2, curpage, linkto);
            print_selector_number(pages - 1, curpage, linkto);
            print_selector_number(pages, curpage, linkto);
        }
    }
    document.write('<br />\n');
}

function filter_list() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('flist');
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName('list-entry');
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName('span')[1];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
    }
}

function filter_list2() {
    let input, filter, ul, li, a, i, txtValue;
    let f1, f2, f3, f4, f5, f6, f7, f8, f9, f10;
    let show, qshow, txtv, do_qshow = 1;
    if (document.getElementById('f_worlds').checked) f1 = 'World';
    else f1 = '';
    if (document.getElementById('f_personas').checked) f2 = 'Persona';
    else f2 = '';
    if (document.getElementById('f_resourcePacks').checked) f3 = 'Resoure Pack';
    else f3 = '';
    if (document.getElementById('f_mixed').checked) f4 = 'Mash-Up';
    else f4 = '';
    if (document.getElementById('f_skinpack').checked) f5 = 'Skin Pack';
    else f5 = '';
    if ((f1.length == 0) && (f2.length == 0) && (f3.length == 0) && (f4.length == 0) && (f5.length == 0)) do_qshow = 0;
    input = document.getElementById('flist');
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName('list-entry');
    for (i = 0; i < li.length; i++) {
        show = 0;
        qshow = 0;
        a = li[i].getElementsByTagName('span')[1];
        txtv = a.textContent || a.innerText;
        txtValue = txtv.toUpperCase();
        if (do_qshow) {
            if (f1.length > 0)
                if (txtValue.indexOf(f1, 0) !== -1) qshow = 1;
            if (f2.length > 0)
                if (txtValue.indexOf(f2, 0) !== -1) qshow = 1;
            if (f3.length > 0)
                if (txtValue.indexOf(f3, 0) !== -1) qshow = 1;
            if (f4.length > 0)
                if (txtValue.indexOf(f4, 0) !== -1) qshow = 1;
            if (f5.length > 0)
                if (txtValue.indexOf(f5, 0) !== -1) qshow = 1;
        } else {
            qshow = 1;
        }
        if (txtValue.indexOf(filter) > -1) show = 1
        if ((qshow == 1) && (show == 1)) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
    }
}

function do_interstitial_porn() {
	return;
}

function do_interstitial() {
	return;
}