var cincopa = cincopa || {}; //4
cincopa.isnull = function (obj) { return typeof obj == "undefined" || obj == null || obj == ""; }
cincopa.inBetween = function (str, start, end) {
	var i = str.indexOf(start);
	if (i == -1)
		return null;

	var x = str.indexOf(end, i + start.length);
	if (x == -1 || (end == null || end == ""))
		return str.substr(i + start.length);

	return str.substr(i + start.length, x - i - start.length);
}
cincopa.get_root_loader = function () {
	var __tmp_scripts = document.getElementsByTagName("script");
	for (var s = __tmp_scripts.length - 1; s >= 0; s--) {
		var i = __tmp_scripts[s].src.indexOf("libasync");
		if (i > -1) {
			var tmp = __tmp_scripts[s].src.substring(0, i);

			//i = tmp.indexOf("://");
			//tmp = tmp.substring(i + 1);

			//tmp = tmp.replace("www.cincopa.com/wpplugin/runtime", "www.cincopa.com/media-platform/runtime");

			return tmp;
		}
	}
}
cincopa.location_blocked = function () {
	try {
		if (parent.location.href)
			return false;
	}
	catch (ex) {
	}
	return true;
} ();
cincopa.location = function () {
	if (cincopa.location_blocked)
		return document.referrer;
	else
		return parent.location.href;
} ();
cincopa.disable_analytics = cincopa.disable_analytics || false;
cincopa._debug = cincopa._debug || (cincopa.inBetween(location.search, "cpdebug=", "&") == "true") || (cincopa.inBetween(document.cookie, "cpdebug=", ";") == "true");
cincopa.registeredFunctions = cincopa.registeredFunctions || [];
cincopa.registerEvent = cincopa.registerEvent || function (fname, namespace) {
	for (p in this.registeredFunctions)
		if (this.registeredFunctions[p].func == fname && this.registeredFunctions[p].filter == namespace)
			return;
	this.registeredFunctions.push({ func: fname, filter: namespace });
};
cincopa._ROOT_LOADER = cincopa._ROOT_LOADER || cincopa.get_root_loader();
cincopa._ROOT_PROTOCOL = cincopa._ROOT_PROTOCOL || function () { var i = cincopa._ROOT_LOADER.indexOf("://"); return cincopa._ROOT_LOADER.substring(0, i + 1) } ();
cincopa._ROOT_ANALYTICS = cincopa._ROOT_ANALYTICS || cincopa._ROOT_PROTOCOL + "//analytics.cincopa.com";
cincopa._ROOT_LOADER_STATIC = cincopa._ROOT_LOADER_STATIC || function (root) {
	try {
		if (!root.startsWith("https:"))
			return root.replace("//www.", "//static.");
		return root;

		// this will throw in case user is using iframe embed code
		if (parent.location.protocol != "https:" && parent.location.protocol) // the second part is for safari, crazy but safari will not throw incases where iframe trys to access parents url, it will just return null
			return root.replace("//www.", "//static.");
		//else if (parent.location.protocol == "https:" && parent.location.protocol)
		//return root.replace("//www.cincopa.com", "//cpwww-cincopa2.netdna-ssl.com");
	}
	catch (ex) {
		if (window.location.protocol != "https:")
			return root.replace("//www.", "//static.");
	}
	return root;
} (cincopa._ROOT_LOADER);
cincopa._AJAX = cincopa._AJAX || cincopa._ROOT_LOADER_STATIC.replace("/runtime/", "/runtimeze/");
cincopa._HOST = cincopa._HOST || cincopa._ROOT_LOADER_STATIC.replace("/runtime/", "/runtimeze/");
cincopa.set_debug = function (d) {
	try { console.log(cincopa.inBetween(document.cookie, "cpdebug=", ";")); } catch (ex) { }

	if (typeof d == "undefined")
		return;

	window.cincopa._debug = d;
	var f = new Date();
	f.setDate(f.getDate() + 70);
	document.cookie = "cpdebug=" + d + "; expires=" + f.toGMTString() + "; path=/";
}
cincopa._wp_filesadded = cincopa._wp_filesadded || "";
cincopa.loadJSFile = function (filename) {
	if (filename.toLowerCase().indexOf("//") == -1)
		filename = _cincopa_url + filename;

	if (true) //_wp_filesadded.indexOf("[" + filename + "]") == -1)
	{
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);

		document.getElementsByTagName("head")[0].appendChild(fileref);

		cincopa._wp_filesadded += "[" + filename + "]";
	}
}
cincopa.loadCSSFile = function (filename) {
	if (filename.toLowerCase().indexOf("//") == -1)
		filename = _cincopa_url + filename;

	if (cincopa._wp_filesadded.indexOf("[" + filename + "]") == -1) {
		var fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);

		document.getElementsByTagName("head")[0].appendChild(fileref);
		cincopa._wp_filesadded += "[" + filename + "]";
	}
}
cincopa.trace = function (msg, data) {
	data = data || "";
	if (!window.console || !window.cincopa._debug) return;
	try {
		if (typeof msg == 'object') {
			console.dir(msg, data);
		} else {
			console.log(msg, data);
		}
	} catch (e) {

	}
}
cincopa.logError = function (what) {
	try {
		var oat = new Image(1, 1);
		oat.src = cincopa._ROOT_ANALYTICS + "/oa.aspx?uid=rtlogerror&fid=" + what + "&setref=" + encodeURIComponent(location.href.replace("?", "@").replace("#", "@"));
	} catch (ex) { }
}
cincopa.parseqs = function (a) {
	if (a == "") return {};
	var b = {};
	for (var i = 0; i < a.length; ++i) {
		var p = a[i].split('=', 2);
		if (p.length == 1)
			b[p[0]] = "";
		else
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
}
try
{
	cincopa.qs = cincopa.qa || cincopa.parseqs(window.location.search.substr(1).split('&'));
	cincopa.hash = cincopa.hash || cincopa.parseqs(window.location.hash.substr(1).split('&'));
} catch (ex) {}
var zeSkins = zeSkins || []; // array of skin objects
var zeGalleryArray = zeGalleryArray || []; // array of active galleries
var _cp_go_hooks = new Object();
var _cp_last_gallery = _cp_last_gallery || 0;
var _wp_widget_js_array = _wp_widget_js_array || [];
var _cp_preloaded_files = new Object();

if (location.search.indexOf("cpenablefirebug") > -1) {
	var firebug = document.createElement('script'); firebug.setAttribute('src', '//getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js'); document.body.appendChild(firebug); (function () { if (window.firebug.version) { firebug.init(); } else { setTimeout(arguments.callee); } })(); void (firebug);
}

var _cpmp = _cpmp || [];
for (var i = 0; i < _cpmp.length; i++) //
{
//	getElement(_cpmp[i]["_object"]).innerHTML = '<img src="' + _ROOT_LOADER + 'loading.gif" style="border:0;width:50px;height:10px;"/>';

	var go = new GalleryObject(_cpmp[i]);
	_cpmp[i]["_id"] = "_cp_" + _cp_last_gallery++;
	zeGalleryArray[_cpmp[i]["_id"]] = go;

	if (_cpmp[i]["_iframeParentObject"])
		go.iframeParentObject = _cpmp[i]["_iframeParentObject"];


	if (_cpmp[i]["_args"]) {
		cincopa.trace("loading args directly into go object");
		go.onArgs(_cpmp[i]["_args"]);
	}
	else {
		var setref = "";
		if (cincopa.location_blocked)
			setref = "&setref=" + encodeURIComponent(cincopa.location);

		var url = cincopa._ROOT_LOADER_STATIC + "widgetasync.aspx?id=" + _cpmp[i]["_id"] + setref;
		if (_cpmp[i]["_fid"] != null)
			url += "&fid=" + _cpmp[i]["_fid"];
		else
			url += "&refid=" + _cpmp[i]["_refid"] + "&userid=" + _cpmp[i]["_userid"];

		url += cp_add_override();

		cincopa.loadJSFile(url);
	}
}
_cpmp = [];

function cp_load_widget(fid, objid, host) {

	if (location.href.indexOf("cpdebug=stopall") > -1) {
		alert("stopall");
		return;
	}
/*
	try {
		getElement(id).innerHTML = '<img src="' + _ROOT_LOADER + 'loading.gif" style="border:0;width:50px;height:10px;"/>';
	} catch (ex) {
		var googla = new Image(1, 1);
		googla.src = "//goo.gl/pyAFT";
		return;
	}
*/
	var zeo = [];
	zeo["_object"] = objid;
	zeo["_fid"] = fid;
	zeo["_id"] = "_cp_" + _cp_last_gallery++;

	var go = new GalleryObject(zeo);
	zeGalleryArray[zeo["_id"]] = go;

	var setref = "";
	if (cincopa.location_blocked)
		setref = "&setref=" + encodeURIComponent(cincopa.location);

	var url = cincopa._ROOT_LOADER_STATIC + "widgetasync.aspx?id=" + zeo["_id"] + "&fid=" + zeo["_fid"] + setref;
	url += cp_add_override();

	cincopa.loadJSFile(url);
}

function getElement(aID) {
	return (document.getElementById) ? document.getElementById(aID) : document.all[aID];
}

function cp_add_override() {
	var query = location.search.replace("?", "&");
	var add = "";
	var t = cincopa.inBetween(query, "&cptemplate=", "&");
	if (t) add += "&cptemplate=" + t;
	t = cincopa.inBetween(query, "&cpskin=", "&");
	if (t) add += "&cpskin=" + t;
	t = cincopa.inBetween(query, "&cpdisablepreload=", "&");
	if (t) add += "&cpdisablepreload=" + t;
	return add;
}

function wp_widget_show(cjd, tcjd) {

	try {
		cjd.id = zeGalleryArray[cjd.id].loaderParams._object;
	} catch (ex) {}
	var go = new GalleryObject(new Object());

	go.loadjscssfile(cincopa._ROOT_LOADER_STATIC + 'libasync_old.js?aas', 'js', 'body', function () {
		wp_widget_show_old(cjd, tcjd);
	});
}


cincopa.testtrack = function (uid) {
	if (cincopa.location.indexOf("cincopa.com") > -1)
		return;

	var lf = eval(atob("WyJicmlnaHRjb3ZlIiwieW91dHViZSIsInZpbWVvIiwid2lzdGlhIiwidnphYXIiLCJzcHJvdXR2aWRlbyIsImRyb3BzaG90cyIsInZpZGRsZXIiLCJpcGxheWVyaGQiLCJrYWx0dXJhIiwidmlkYmVvIiwiandwbGF5ZXIiLCJkYWlseW1vdGlvbiIsIm9veWFsYSIsInZpZHlhcmQiLCJsaXZlcGVyc29uIiwiaW50ZXJjb20iLCJtYXJrZXRvIiwiaHVic3BvdCIsInBhcmRvdCIsImVsb3F1ZSIsIm1vb2RsZSIsImFjdC1vbiIsImNsaWNrdGFsZSIsImhvdGphciIsImx1Y2t5b3JhbmdlIiwic2hvcGlmeSIsImJpZ2NvbW1lcmNlIiwicHJlc3Rhc2hvcCIsIm1hZ2VudG8iLCJkcnVwYWwiLCJtaWNyb3NvZnQiLCJzaGFyZXBvbnQiLCJzYWxlc2ZvcmNlIiwibWl4cGFuZWwiLCJraXNzbWV0cmljcyJd"));
	var found = new Object();
	var lists = [];
	lists.push(document.getElementsByTagName("script"));
	lists.push(document.getElementsByTagName("iframe"));
	for (var lx in lists)
		for (var s = lists[lx].length - 1; s >= 0; s--) {
			var src = lists[lx][s].src.toLowerCase();
			for (var lfi in lf)
				if (src.indexOf(lf[lfi]) > -1)
					found[lf[lfi]] = null;
		}

	for (var f in found) {
		var oat = new Image(1, 1);
		oat.src = cincopa._ROOT_ANALYTICS + "/oa.aspx?uid=track&fid=" + f + "&setref=" + encodeURIComponent("http://" + uid + "/" + cincopa.location);
	}
}

/*
**********************************  loader.js  **************************
*/




//fix for IE7
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === val) return i;
		}
		return -1;
	}
}

function trace(msg, data) {
	cincopa.trace(msg, data);
}

function getElement(aID) {
	return (document.getElementById) ? document.getElementById(aID) : document.all[aID];
}

// get instructions from the page of what galleries to load	
if (typeof _zel != "undefined") {

	for (var i = 0; i < _zel.length; i++) {
		var go = new GalleryObject(_zel[i]);
		_zel[i]["_id"] = "_cp_" + _cp_last_gallery++;
		zeGalleryArray[_zel[i]["_id"]] = go;

		if (_zel[i]["_iframeParentObject"])
			go.iframeParentObject = _zel[i]["_iframeParentObject"];

		if (_zel[i]["_args"]) {
			cincopa.trace("loading args directly into go object");
			go.onArgs(_zel[i]["_args"]);
		}
		else
			go.initialize();
	}

	// this will make sure that if someone called the loader.js more than once if will not do any job the second time
	_zel = [];
}

function GalleryObject(params) {
	var self = this;
	this.loaderParams = params;
	this.saveJSONPars = null;
	this.skinPath = null;
	this.skin = null;
	this.args = null;
	this.galleryEditPanel = null;
	this.iframeParentObject = null;
	this.iframeParentId = null;
	this.url_params = {};

	try {
		this.loaderParams["_id"] = this.loaderParams["_id"] || this.loaderParams._object;
	} catch (ex) { }

	try {
		var tmpsplit = location.search.substring(1).split("&");
		for (var x = 0; x < tmpsplit.length; x++) {
			var tmp = tmpsplit[x].split("=");
			this.url_params[tmp[0]] = tmp[1];
		}
	} catch (ex) { }

	function _trace(msg) {
		return cincopa.trace('GO [ ' + self.loaderParams._object + ' ] : ' + msg);
	}

	this.arg_misc_group = {
		misc: { name: "Misc", desc: "Add-on settings for the gallery, availalble only for pro users." }
	};

	this.arg_misc = {
		//			remove_branding: { group: "misc", type: "bool", name: "Remove Branding", desc: "Remove the icon and the 'Powered By' text." },
		//			cooliris: { group: "misc", name: "Cooliris", type: "list:no,yes", desc: "Add a [View with Cooliris] link. Cooliris is the fastest and most stunning way to browse photos and videos." },
		allow_download: { group: "misc", name: "Allow Download", type: "list", values: { "no": "No" , "original": "Original files" , "resized": "Web version"}, desc: "Allow user to download and save all files.<br>* Resized zip contains photos resized to 600x450, videos in mp4 format and music in original sampling." },
		domain_lock: { group: "misc", type: "text", name: "Domain Lock", desc: "Allow this gallery to appear only in the domains on this list. This will prevent others from grabbing your gallery to their site. <br>Type a list of domains separated by comma or leave empty to allow all domains.<br>No need for <i>http://</i><br>For example: <i>mydomain.com,blogspot.com</i>" },
		domain_lock_msg: { group: "misc", type: "text", name: "Domain Lock Message", desc: "Message to be displayed when the gallery is locked, leave empty to keep the default message." },
		password: { group: "misc", type: "text", name: "Password", desc: "Protected your gallery with a password. Give it to your users and only they will be able to access the content." },
		iframe: { group: "misc", type: "bool", name: "iframe", desc: "Enable this option if the gallery is not working properly inside a page and the gallery will be placed in a HTML iframe." },
		ga_event: { group: "misc", type: "list", name: "Track Events With GA", values: { off: "Off (default)", on: "On" }, desc: "When On the gallery will post events directly to your Google Analytics account where you can get detailed infromation about user engagement." },
		allow_search: { group: "misc", type: "list", name: "Search box", values: { no: "No (default)", yes: "Yes" }, desc: "Add a search box above the gallery to allow user to search the gallery." }
	};

	this.arg_misc_defaults = {
		cooliris: "no",
		allow_download: "no",
		domain_lock: "",
		password: "",
		ga_event: "off",
		allow_search: "no"
	}

	this.arg_template_group = {
		template: { name: "Template", desc: "" }
	};

	this.arg_template_map = {
		tmpl_unique_name: { group: "template", type: "text", name: "Unique Name", desc: "" },
		tmpl_description: { group: "template", type: "text", name: "Description", desc: "" },
		tmpl_author: { group: "template", type: "text", name: "Author", desc: "" },
		tmpl_visible: { group: "template", type: "list", values: { public: "Public", private: "Private" }, name: "Visible", desc: "" },
		tmpl_license: { group: "template", type: "num", name: "License", desc: "" },
		tmpl_type: { group: "template", type: "text", name: "Type", desc: "" },
		tmpl_support_photo: { group: "template", type: "bool", name: "Support Photo", desc: "" },
		tmpl_support_video: { group: "template", type: "bool", name: "Support Video", desc: "" },
		tmpl_support_audio: { group: "template", type: "bool", name: "Support Audio", desc: "" },
		tmpl_poster_url: { group: "template", type: "text", name: "Poster URL", desc: "" },
		tmpl_demo_fid: { group: "template", type: "text", name: "Demo Fid", desc: "" },
		tmpl_demo_html: { group: "template", type: "html", name: "Demo HTML", desc: "" }
	};

	this.initialize = function() {
		this.skin = null;
		cincopa.trace("GalleryObject - " + this.loaderParams["_object"] + " - " + this.loaderParams["_gid"]);
		//this.loadjscssfile(_AJAX + "args.aspx?id=" + this.loaderParams["_object"] + "&fid=" + this.loaderParams["_gid"] + "&rnd=" + Math.random(), "js");
		this.loadjscssfile(cincopa._AJAX + "args.aspx?id=" + this.loaderParams["_object"] + "&fid=" + this.loaderParams["_gid"], "js");
	}
	/*
	this.onCSS=function(name,css){
	this.args["css_"+name]=css;
	}*/

	this.getCSSCode = function(name) {
		var style = this.args["css_" + name];
		if (style && style.length) {
			style = style.replace(/~skin_path~/g, this.skinPath);
			style = style.replace(/~gallery_div~/g, this.loaderParams["_object"]);
			style = style.replace(/~assets_path~/g, cincopa._HOST + "/assets/");

			var i = style.indexOf("~arg_");
			while (i > -1) {
				var t = style.indexOf("~", i + 1);
				if (t == -1)
					break;

				var markup = style.substring(i, t);
				var argname = markup.substr(5, markup.length - 1);
				var argvalue = "";
				try {
					argvalue = this.args[argname];
				} catch (ex) { }

				style = style.substring(0, i) + argvalue + style.substring(t + 1);


				i = style.indexOf("~arg_");
			}

			style = "<style type='text/css'>" + style + "</style>";
			if (navigator.appVersion.match(/MSIE (8|7)/))
				style = "<br style='display:none;' />" + style; // this is crazy but what can we do !
		}
		else
			style = "";

		return style;
	}

	this.onArgs = function(args) //
	{
		if (args != null)
			this.args = args;

		this.onSkinEvent("runtime.on-args");

		var isiframe = this.args.iframe;
		if ((isiframe === undefined || isiframe === "") && this.args.template_args != null)
			isiframe = this.args.template_args.iframe;

		if (isiframe === undefined)
			isiframe = false;
		else
			isiframe = isiframe.toString().toLowerCase() == "true";

		if (isiframe && this.iframeParentObject == null)
			this.loadIFrameSkin();
		else
			this.loadSkin();
	}

	this.loadArgs = function() {
		if (location.href.indexOf("zemaketemplate=") > -1) {
			this.skin.arg_groups = this.merge_json(this.skin.arg_groups, this.arg_template_group);
			this.skin.arg_map = this.merge_json(this.skin.arg_map, this.arg_template_map);
		}

		var args_map = this.skin.arg_map;
		var args_defaults = this.skin.arg_defaults

		var temp_args = {};

		// base args - copy all the defaults
		for (var n in args_defaults)
			temp_args[n] = args_defaults[n];

		// copy the template args
		for (var n in this.args.template_args)
			temp_args[n] = this.args.template_args[n];

		// base misc args - copy all the defaults in case template_args changed them
		for (var n in this.arg_misc_defaults)
			temp_args[n] = this.arg_misc_defaults[n];

		// copy user params   
		for (var n in this.args) {
			/*if (n == "template_args")
			continue;*/

			var par_permit = 0;
			try {
				if (args_map[n]) {
					par_permit = eval(args_map[n].permit);
				}
			}
			catch (ex)
		    { }

			if (typeof par_permit == "undefined")
				par_permit = 0;

			if (par_permit <= this.args["permit"])
				temp_args[n] = this.args[n];
		}

		var normalize = function(obj) {
			// normalize all param
			for (var n in obj) {
				if (args_map[n] && args_map[n].type == 'bool')
					obj[n] = obj[n] === 'true' || obj[n] === true;
				else if (obj[n] && obj[n].type == 'num')
					obj[n] = parseInt(obj[n]);
			}

		}

		normalize(temp_args);
		normalize(temp_args.template_args);
		this.args = temp_args;
	}

	this.loadIFrameSkin = function () {
		var w = 600, h = 450;
		if (this.args.widget_w)
			w = this.args.widget_w;
		if (this.args.widget_h)
			h = this.args.widget_h;

		var ifrm = '<iframe id="zeiframe_' + this.loaderParams["_object"] + '" scrolling=no frameborder=0 vspace=0 hspace=0 marginwidth=0 marginheight=0 width=' + w + 'px height=' + h + 'px></iframe>';
		this.setGalleryHTML(ifrm);

		cincopa.trace("Creating iframe zeiframe_" + this.loaderParams["_object"]);
		var zeiframe = document.getElementById("zeiframe_" + this.loaderParams["_object"]);
		zeiframe.style.width = "100%";
		var doc = zeiframe.contentDocument;
		if (doc == undefined || doc == null) // IE
		{
			doc = zeiframe.contentWindow.document;
		}

		var htm = "";
		var writeto = function (what) {
			htm += what;
			htm += "\n";
		}

		writeto('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html>\n<head>');

		writeto('<script type="text/javascript" src="' + cincopa._ROOT_LOADER + 'libasync.js"> </script>');

		writeto(unescape("%3Cscript type='text/javascript'%3E"));

		//this.args.id = this.loaderParams["_object"]; // 
		writeto("var _gallery_args = {");
		for (var n in this.args) {
			if (n != "template_args")
				writeto(n + ":'" + this.args[n].toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/'/g, "\\'") + "',");
		}

		writeto("template_args : {");
		for (var n in this.args.template_args) {
			if (n != "gmdss")
				writeto(n + ":'" + this.args.template_args[n].toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/'/g, "\\'") + "',");
		}
		writeto("gmdss:'y' }};");

		writeto(unescape("%3C/script%3E"));
		writeto("</head><body  marginheight=0 marginwidth=0 style='margin-top: 0px;'>");
		writeto("<div id='inneriframe'></div>");
		writeto(unescape("%3Cscript defer type='text/javascript'%3E"));

		writeto("var zeo = [];");
		writeto("zeo['_object'] = 'inneriframe';");
		writeto("zeo['_id'] = 'inneriframe';");

		if (this.loaderParams["_feedjson"] != null)
			writeto("zeo['_feedjson'] = " + JSON.stringify(this.loaderParams["_feedjson"]) + ";");

		writeto("zeo['_gid'] = '" + this.args.fid + "';");
		writeto("zeo['_args'] = _gallery_args;");
		writeto("zeo['_iframeParentObject'] = '" + this.loaderParams["_object"] + "';");
		writeto("zeo['_iframeParentId'] = '" + this.loaderParams["_id"] + "';");

		writeto("var go = new GalleryObject(zeo);");
		writeto("zeGalleryArray['inneriframe'] = go"); ;
		writeto("go.iframeParentObject = '" + this.loaderParams["_object"] + "';");
		writeto("go.iframeParentId = '" + this.loaderParams["_id"] + "';");

		if (this.args["preloader_js"]) {
			writeto("go.args = _gallery_args;");
			writeto("go.loadjscssfile(" + this.args["preloader_js"] + ", 'js', 'head', function() {(zeGalleryArray['inneriframe']).onArgs(); });");
			writeto("go.loadjscssfile(" + this.args["preloader_css"] + ", 'css', 'head', function() {}); ");
		}
		else
			writeto("go.onArgs(zeo['_args']);");

		//		writeto("var _zel = _zel || [];");
		//		writeto("_zel.push(zeo);");

		writeto(unescape("%3C/script%3E"));

		writeto('</body>\n</html>');

		cincopa.trace(htm);

		doc.open();
		doc.write(htm);
		doc.close(); // this crash IE
	}

	this.getParentIframeObject = function () {
		if (!this.iframeParentId)
			return null;

		return parent.document.getElementById("zeiframe_" + parent.zeGalleryArray[this.iframeParentId].loaderParams._object);
	}

	this.loadSkin = function() {
		if (this.args.exception) {
			if (this.args.exception == "galleryempty") {
				var msg = "Gallery Is Empty";
				if (this.args.logged_user == "owner")
					msg += "<br><br>Click 'Edit' at the top left of this box<br>and then click 'Add Media File' at the menu on the right.";

				var htm = '<div style=width:600px;height:200px;color:red;font-size:14px;text-align:center;background-color:#f5f5f5;><br><br><br>' + msg + '</div>';

				this.args.widget_w = 600;
				this.args.widget_h = 200;

				this.setGalleryHTML(htm);

				if (this.onSkinInit) {
					this.onSkinInit();
				}

				return;
			}
		}

		if (typeof this.url_params.zeskinpath !== "undefined")
			this.skinPath = this.url_params.zeskinpath;
		else if (this.args.skin_code[0] == "/")
			this.skinPath = "//s3.amazonaws.com/fpskin" + this.args.skin_code + "/";
//			this.skinPath = "//d3furk77y00zk4.cloudfront.net" + this.args.skin_code + "/";
		else
			this.skinPath = cincopa._HOST + this.args.skin_code + "/";

		if (this.loaderParams["_dev_path"])
			this.skinPath = this.loaderParams["_dev_path"];

		if (typeof zeSkins[this.getSkinName(this.args.skin_code)] == "undefined") {
			var skinfile = this.skinPath + "skin.js";
			if (location.href.indexOf("zetestskin=") > -1)
				skinfile = this.skinPath + "skin_test.js";

			this.loadjscssfile(skinfile, "js", "head", function() {
				self.initSkin();
			});
		}
		else {
			this.initSkin();
		}
	}

	this.getSkinName = function(skin_code) //
	{
		if (this.args.skin_code.charAt(0) == "/")
			return this.args.skin_code.split("/")[1];

		return skin_code;
	}

	this.initSkin = function() {
		_trace("initializing skin");
		this.skin = new zeSkins[this.getSkinName(this.args.skin_code)];
		this.skin.init(this);

		if (this.onSkinInit)
			this.onSkinInit();

		if (this.iframeParentId != null && parent.zeGalleryArray[this.iframeParentId].onSkinInit)
			parent.zeGalleryArray[this.iframeParentId].onSkinInit();
	}

	this.getMediaJSON = function (par) {

		if (par != null)
			this.saveJSONPars = par;

		if (this.loaderParams["_feedjson"]) {
			zeOnMediaJSON(this.loaderParams["_object"], this.loaderParams["_feedjson"]);
		}
		else {
			var jsonlink = cincopa._AJAX + "json.aspx";
			if (this.loaderParams["_feedurl"])
				jsonlink = this.loaderParams["_feedurl"];

			jsonlink += "?callback=zeOnMediaJSON";
			jsonlink += "&wid=" + this.loaderParams["_id"];
			jsonlink += "&fid=" + this.args.fid;
			jsonlink += "&thumb=" + this.saveJSONPars.thumb;
			jsonlink += "&content=" + this.saveJSONPars.content;
			//jsonlink += "&rnd=" + Math.random();

			if (this.saveJSONPars.details)
				jsonlink += "&details=" + this.saveJSONPars.details;

			if (this.saveJSONPars.password)
				jsonlink += "&password=" + this.saveJSONPars.password;
			else {
				var pass = cincopa.inBetween(document.cookie, "pass" + this.args.fid + "=", ";");
				if (pass)
					jsonlink += "&password=" + pass;
			}

			if (this.args._access_key)
				jsonlink += "&openpassword=" + this.args._access_key + ":" + this.args.password;

			if (this.loaderParams["_feedparams"])
				jsonlink += this.loaderParams["_feedparams"];

			if (this.args.extra_assets)
				jsonlink += "&extra=" + this.args.extra_assets;

			this.loadjscssfile(jsonlink, "js");
		}
	}

	this.zeOnMediaJSON = function (json) {
		cincopa.trace(this.skin.go.loaderParams._object);

		if (json.errorcode == "bad_password") {
			this.loadjscssfile(cincopa._ROOT_LOADER_STATIC + 'md5.js', 'js', 'body');
			this.promtPassword(this.skin.go.loaderParams._object);
			/*			this.loadjscssfile(_ROOT_LOADER_STATIC + 'md5.js', 'js', 'body', function () {
			var pass = prompt("password :");
			if (pass == null) // user canceled
			return;

			var f = new Date();
			f.setDate(f.getDate() + 7);
			document.cookie = "pass" + self.args.fid + "=" + hex_md5(pass) + "; expires=" + f.toGMTString();
			self.saveJSONPars.password = hex_md5(pass);
			self.getMediaJSON();
			});
			*/
			return;
		}
		else if (json.errorcode) {
			this.setGalleryHTML("<b>" + json.errormessage + "</b>");
			_trace("json error - " + json.errormessage);
			return;
		}

		this.onSkinEvent("runtime.on-media-json");

		this.skin.onMediaJSON(json);
	}

	var promt_shown = false;
	this.promtPassword = function (containerID) {
		var container = document.getElementById(containerID);

		var passwordDivContainer = document.createElement("div");
		passwordDivContainer.className = "ze_password_promt_container";

		var passwordDivContainerHead = document.createElement("h1");
		passwordDivContainerHead.innerHTML = "Please enter a password";

		var errorSpan = document.createElement("span");
		errorSpan.innerHTML = "Wrong password. Please try again";
		errorSpan.className = "errorText";

		var passChildCont = document.createElement("div");
		passChildCont.className = "ze_password_field";

		var passInput = document.createElement("input");
		passInput.type = 'text';
		passInput.name = 'ze_password';
		passInput.placeholder = 'Password';
		passInput.className = "ze_password_input";
		//
		var passSubmitCont = document.createElement("div");
		passSubmitCont.className = "ze_submit_field";

		var passSubmitBtn = document.createElement("a");
		passSubmitBtn.href = 'javascript:void(0)';
		passSubmitBtn.className = 'ze_password_submit_btn';
		passSubmitBtn.innerHTML = 'Submit';

		passChildCont.appendChild(passInput);
		passSubmitCont.appendChild(passSubmitBtn);
		passwordDivContainer.appendChild(passwordDivContainerHead);
		if (promt_shown == true) {
			passwordDivContainer.appendChild(errorSpan);
		}
		passwordDivContainer.appendChild(passChildCont);
		passwordDivContainer.appendChild(passSubmitCont);

		container.innerHTML = '';
		container.appendChild(passwordDivContainer);
		promt_shown = true;

		passInput.onkeypress = function (e) {
			if (e.keyCode == 13) {
				onPasswordSubmit();
				return false;
			}
		}

		passSubmitBtn.onclick = function () {
			onPasswordSubmit();
		}

		function onPasswordSubmit() {
			var value = passInput.value;
			var f = new Date();
			f.setDate(f.getDate() + 7);
			document.cookie = "pass" + self.args.fid + "=" + hex_md5(value) + "; expires=" + f.toGMTString();
			self.saveJSONPars.password = hex_md5(value);
			self.getMediaJSON();
		}
	}

	this.getMediaRSSURL = function(par) {
		var link = cincopa._AJAX + "rss200.aspx?fid=" + this.args.fid;
		link += "&thumb=" + par.thumb;
		link += "&content=" + par.content;

		return link;
	}

	this.buildSearchDiv = function() //
	{
		var that = this;

		var searchCont = document.createElement("div");
		searchCont.className = "ze_search_cont";
		searchCont.id = "ze_search_cont" + this.loaderParams["_object"];

		var searchInput = document.createElement("input");
		searchInput.type = "text";
		searchInput.className = "ze_searchBox";
		searchInput.style.display = "none";

		var searchBtn = document.createElement("a");
		searchBtn.href = "javascript:void(0);"
		searchBtn.innerHTML = "Search";
		searchBtn.onclick = function() {
			this.style.display = "none";
			searchInput.style.display = "inline-block";
			searchInput.focus();
		}

		var searchInput = document.createElement("input");
		searchInput.type = "text";
		searchInput.className = "ze_searchBox";
		searchInput.value = (that.MediaJSON && typeof that.MediaJSON.searchVal != 'undefined') ? that.MediaJSON.searchVal : '';
		searchInput.style.display = "none";

		var searchClear = document.createElement("span");
		searchClear.className = "ze_search_clear";
		searchClear.style.cursor = "pointer";
		searchClear.innerHTML = 'X';
		searchClear.style.display = 'none';
		searchClear.onclick = function() {
			this.style.display = 'none';
			searchInput.value = '';
			searchInput.style.display = 'none';
			searchBtn.style.display = 'inline-block';
			go.doSearch('clear');

		}

		searchCont.appendChild(searchBtn);
		searchCont.appendChild(searchInput);
		searchCont.appendChild(searchClear);
		searchInput.onkeyup = function(e) {

			if (e.keyCode == 27) {
				searchClear.style.display = 'none';
				searchInput.value = '';
				searchInput.style.display = 'none';
				searchBtn.style.display = 'inline-block';
				go.doSearch('clear');
				return false;
			}


			searchClear.style.display = "inline-block";
			var value = this.value;
			if (value.replace(/^\s+|\s+$/g, '') == '') {
				this.setAttribute('data-stop', 'true');
			}
			go.doSearch('search', value);
		}

		return searchCont;
	}

	this.doSearch = function (searchCase, value) //
	{
		var that = this;

		if (this.args.iframe == 'true') {
			that = document.getElementById('zeiframe_' + this.loaderParams._object).contentWindow.go
		}
		that.orig_json = that.orig_json || that.MediaJSON;
		if (searchCase == 'clear') {
			delete that.orig_json.searchVal;
			that.skin.onMediaJSON(that.orig_json)

			if (that.skin.isready > 2) // tmp solution
				that.skin.start();

		} else {
			function filterarray(t, fun) {
				var len = t.length >>> 0;

				var res = [];
				var thisp = arguments[1];
				if (t.sortedByTag) {
					for (var j in t) {
						for (var i = 0; i < t[j].length; i++) {
							var val = t[j][i]; // in case fun mutates this
							if (fun.call(thisp, val, i, t))
								res.push(val);
						}
					}
				} else {
					for (var i = 0; i < len; i++) {
						if (i in t) {
							var val = t[i]; // in case fun mutates this
							if (fun.call(thisp, val, i, t))
								res.push(val);
						}
					}
				}
				return res;
			}
			sortedArray = filterarray(that.orig_json.items, function (element) {
				testValue = value.toLowerCase();
				return element.title.toLowerCase().indexOf(testValue) > -1
						|| element.description.toLowerCase().indexOf(testValue) > -1
						|| ((typeof element.tags != "undefined") ? (element.tags.toLowerCase().indexOf(testValue) > -1) : false);
			});

			if (value.replace(/^\s+|\s+$/g, '') == '') {
				that.orig_json['searchVal'] = '';
				that.skin.onMediaJSON(that.orig_json);
			} else {
				that.skin.onMediaJSON({
					description: that.orig_json.description,
					title: that.orig_json.title,
					items: sortedArray,
					searchVal: value
				});
			}

			if (that.skin.isready > 2) // tmp solution
				that.skin.start();

		}
	}

	this.stripScripts = function (s) {
		s = s.replace(/\%3C/g, '<').replace(/\%3E/g, '>');
		var div = document.createElement('div');
		div.innerHTML = s;
		var scripts = div.getElementsByTagName('script');
		var i = scripts.length;
		var scripts_block = [];
		while (i--) {
			scripts_block.push(scripts[i]);
			scripts[i].parentNode.removeChild(scripts[i]);
		}
		return { 'text': div.innerHTML, 'scripts': scripts_block };
	}

	this.buildUpperPanel = function() {

		var upper_panel = "";

		if (_cp_go_hooks["before-building-upper-panel"])
			upper_panel += _cp_go_hooks["before-building-upper-panel"](this);
		
		if (this.args.allow_search == "yes")
			upper_panel += " <div id='cp-search-div-" + this.loaderParams["_object"] + "'></div> ";

		if (this.args.allow_download == "original" || this.args.allow_download == "resized") {
			var url = cincopa._AJAX.replace("/runtimeze/", "/runtime/") + "download.aspx?fid=" + this.args.fid;
			upper_panel += " <a class='cp-download-all-link' href='" + url + "'>Download</a> ";
		}

		return upper_panel;
	}

	this.buildLowerPanel = function() {

		var lower_panel = "";

		if (this.args.plan_name == "free")
		{
			lower_panel = '<div style="clear:both;"><a href="//www.cincopa.com/?utm_campaign=viral_pro_skins&afc=mplp1" style="vertical-align: middle;display: inline-block;"><img style="padding:0px;margin:0px;border:0px;width:236px;height:30px;" border=0 alt="Powered By Cincopa" src="' + cincopa._ROOT_LOADER_STATIC + 'bycincopa.png" /></a>';
			lower_panel += '<div style="display: inline-block; vertical-align: middle; margin: 0 .2em 0 1em; position: relative; margin-bottom: 5px;"><div class="g-plusone" data-size="medium" data-href="https://plus.google.com/111463929396015329416"></div></div>';
			lower_panel += '<iframe allowtransparency="true" frameborder="0" scrolling="no" style="vertical-align: middle;overflow:hidden;border:0px none;width:92px;height:20px;margin-bottom:5px;" src="https://www.facebook.com/plugins/like.php?href=' + encodeURIComponent('https://www.facebook.com/cincopa') + '&layout=button_count&show_faces=false&width=100&action=like&font=arial&layout=button_count"></iframe>';
			lower_panel += '</div>';
		}

		return lower_panel;
	}

	this.setGalleryHTML = function (htm) {

		this.onSkinEvent("runtime.on-load-html");

		var obj = getElement(this.loaderParams["_object"]);

		var inner = "<div style='width:" + this.args.widget_w + "px;height:" + this.args.widget_h + "px;' id='inner_" + this.loaderParams["_object"] + "' class='cp_reset_style " + (this.iframeParentObject ? 'cp_iframe' : '') + "'>";
		inner += htm;
		inner += "</div><div style='clear:both;'></div>";

		if (this.iframeParentObject) {

			//var go = parent.zeGalleryArray[this.iframeParentObject];

			var ifrm = parent.document.getElementById("zeiframe_" + this.iframeParentObject);
			if (ifrm !== null) {
				ifrm.style.width = this.args.widget_w ? this.args.widget_w + "px" : "";
				ifrm.style.height = this.args.widget_h ? this.args.widget_h + "px" : "";
			}

			obj.innerHTML = inner;
		}
		else if (this.galleryFrameLoaded) {

			obj = getElement("inner_" + this.loaderParams["_object"]);
			obj.innerHTML = htm;

		}
		else {

			this.galleryFrameLoaded = true;

			var upper_panel = this.buildUpperPanel();
			var lower_panel = this.buildLowerPanel();

			if (upper_panel != "")
				upper_panel = "<div class='cp-upper-panel'>" + upper_panel + "</div>";

			if (obj)
				obj.innerHTML = upper_panel + inner + lower_panel;
			else {
				//var elemDiv = document.createElement('div');
				//elemDiv.innerHTML = "Cincopa Note : embed code is not complete, div " + this.loaderParams["_object"] + " is missing, please re-embed the gallery. ";
				//document.body.appendChild(elemDiv);
				return;
			}

			try {
				this.doga(this.args.cmapath);
			}
			catch (ex) { }

			try {
				var googl = new Image(1, 1);
				googl.src = "//goo.gl/" + ("https:" == document.location.protocol ? "EUZrXg" : "jIur") + "#" + Math.round(Math.random() * 2147483647);
			}
			catch (ex) { }

			try {
				cincopa.testtrack(this.args.cmapath.split("%")[0]);
			} catch (ex) { }

			if (lower_panel != "") {
				var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
				po.src = 'https://apis.google.com/js/plusone.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
			}

			if (getElement("cp-search-div-" + this.loaderParams["_object"])) {
				getElement("cp-search-div-" + this.loaderParams["_object"]).appendChild(this.buildSearchDiv());
			}
		}

		this.onSkinEvent("runtime.on-html-loaded");
	}

	this.loadSkinCSS = function(cssname) {
		this.loadjscssfile(this.skinPath + cssname, "css");
	}

	this.loadSkinJS = function(jsname) {
		this.loadjscssfile(this.skinPath + jsname, "js", "head");
	}

	/**
	* loads skin's scripts
	*/
	this.loadSkinJSSequence = function(jsnames, callback) {
		var self = this;
		var ns = [];
		//building paths
		for (var i = 0; i < jsnames.length; i++) {
			var name = jsnames[i];
			ns.push(this.skinPath + name);
		}
		return this.loadScript(ns, callback);
	}

	this.loadjscssfile = function(filename, filetype, where, onloadfunc) //
	{
		var fileref;

		if (_cp_preloaded_files[filename] == true) //
		{
			if (onloadfunc != null) {
				_trace('preloaded ' + filename + '...');
				setTimeout(function() { onloadfunc() }, 0);
			}
			else {
				_trace('preloaded (without callback) ' + filename + '...');
			}
			return;
		}
		else
			_trace('loading ' + filename + '...');

		if (filetype == "js") { //if filename is a external JavaScript file
			fileref = document.createElement("script");
			fileref.setAttribute("type", "text/javascript");
			var fp = filename;
			//			if(navigator.appVersion.match(/MSIE (7|8)/))
			//				fp+=(fp.match(/\?/)?'&':'?')+Math.random();

			fileref.setAttribute("src", fp);

			if (typeof onloadfunc != "undefined") {
				if (fileref.attachEvent) // for IE
				{
					fileref.onreadystatechange = function() {
						if (fileref.readyState == 'loaded' || fileref.readyState == 'complete')
							onloadfunc();
					};

					fileref.attachEvent("onerror", function () { cincopa.trace("js load error: " + filename); });
				}
				else if (fileref.addEventListener) // for all other
				{
					fileref.addEventListener("load", onloadfunc, false);
					fileref.addEventListener("error", function () { cincopa.trace("js load error: " + filename); }, false);
				}
			}
		}
		else if (filetype == "css") { //if filename is an external CSS file
			fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		if (typeof fileref != "undefined") {
			if (where == "head") {
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
			else {
				document.getElementsByTagName("body")[0].appendChild(fileref);
			}
		}

	}

	/**
	* accepts variable number of arguments - script names<br/>
	* script names can be packed in an array also<br/>
	* optionally any argument can be a callback to be fired after scripts are loaded
	*/

	this.loadScript = function() {

		var self = this;
		var scripts = [];
		var callback = null;

		for (var i = 0; i < arguments.length; i++) {
			var v = arguments[i];
			switch (typeof v) {
				case 'string':
					scripts.push(v);
					break;
				case 'function':
					callback = v;
					break;
			}
			if (v instanceof Array) {
				for (var n = 0; n < v.length; n++) {
					scripts.push(v[n]);
				}
			}
		}

		if (scripts.length == 0) {
			if (callback) callback();
			return;
		}

		var script = scripts.shift();

		this.loadjscssfile(script, 'js', 'body', function() {
			_trace("LOADED: " + script);
			self.loadScript(scripts, callback);
		});

		return true;
	}

	this.namedSize = function(w, h) {
		var thumb = "small";
		if (w <= 100 && h <= 75)
			thumb = "small";
		else if (w <= 200 && h <= 150)
			thumb = "medium";
		else if (w <= 600 && h <= 450)
			thumb = "large";
		else
			thumb = "xlarge";

		return thumb;
	}

	this.pushEventToGA = function (label) //
	{	
		if (this.args.ga_event != "on" && location.host != "www.cincopa.com")
			return;

		try // we need try to avoid security errors when user is using the iframe embed code
		{
			cincopa.trace("pushEventToGA - " + this.MediaJSON.title + " (" + this.args.fid + ") label - " + label);

			if (typeof parent.window._gaq != 'undefined') {
				parent.window._gaq.push(['_trackEvent',
						'Cincopa Galleries',
						this.MediaJSON.title + " (" + this.args.fid + ")",
						label]);
			} else if (typeof parent.window.ga != 'undefined') {
				parent.window.ga('send', 'event', 'Cincopa Galleries', this.MediaJSON.title + " (" + this.args.fid + ")", label);
			} else if (typeof parent.window.__gaTracker != 'undefined') {
				parent.window.__gaTracker('send', 'event', 'Cincopa Galleries', this.MediaJSON.title + " (" + this.args.fid + ")", label);
			}
		} catch (ex) { }
	}

	this.trackEvent = function (label) // this is the old onSkinEvent that worked without data
	{
		this.onSkinEvent("skin." + label.toLowerCase().replace(/ /g, "-"), "obsolete trackEvent() from skin");
	}

	this.onSkinEvent = function (name, data) {
		var nspace = name.substr(0, name.indexOf('.'));
		var gallery = this;
		data = data || {};
		data.id = gallery.args.fid;
		data.container_id = gallery.args.id;
		try {
			data.uid = gallery.args.cmapath.split("%")[0];
		}
		catch (ex) {
			data.uid = "unknown";
		}

		var wind = window;
		try {
			if (parent.location.protocol) // this is for safari - safari will not throw exception when trying to access parent from iframe, it will just return null
				wind = parent.window;
		}
		catch (ex) { }

		try {
			if (wind.cincopa._debug)
				cincopa.trace("onSkinEvent - " + name, data);

			//this.pushEventToGA(name);

			for (i = 0; i < wind.cincopa.registeredFunctions.length; i++) {
				if (wind.cincopa.registeredFunctions[i].filter == '*') {
					try {
						eval(wind.cincopa.registeredFunctions[i].func)(name, data, gallery);
					} catch (ex) { cincopa.trace(ex); cincopa.logError("event-" + name); }
				} else if (wind.cincopa.registeredFunctions[i].filter.indexOf(name) > -1 || wind.cincopa.registeredFunctions[i].filter.indexOf(nspace + '.*') > -1) {
					try {
						eval(wind.cincopa.registeredFunctions[i].func)(name, data, gallery);
					} catch (ex) { cincopa.trace(ex); cincopa.logError("event-" + name); }
				}
			}
		} catch (ex) {
			cincopa.trace(ex);
		}
	}

	this.isIOS = function () {
		return navigator.userAgent.indexOf('iPod;') > -1 || navigator.userAgent.indexOf('iPhone;') > -1 || navigator.userAgent.indexOf('iPad;') > -1;
	}

	this.isAndroid = function() {
		return navigator.userAgent.indexOf('Linux; U; Android') > -1;
	}

	this.isFlash = function(major, minor, build) {
		if (major == null) major = 0;
		if (minor == null) minor = 0;
		if (build == null) build = 0;

		function getFlashVersion(desc) {
			var matches = desc.match(/[\d]+/g);
			matches.length = 3;  // To standardize IE vs FF
			return matches; //.join('.');
		}

		var hasFlash = false;
		var flashVersion;

		if (navigator.plugins && navigator.plugins.length) {
			var plugin = navigator.plugins['Shockwave Flash'];
			if (plugin) {
				hasFlash = true;
				if (plugin.description) {
					flashVersion = getFlashVersion(plugin.description);
				}
			}

			if (navigator.plugins['Shockwave Flash 2.0']) {
				hasFlash = true;
				flashVersion = '2.0.0.11';
			}

		} else if (navigator.mimeTypes && navigator.mimeTypes.length) {
			var mimeType = navigator.mimeTypes['application/x-shockwave-flash'];
			hasFlash = mimeType && mimeType.enabledPlugin;
			if (hasFlash) {
				flashVersion = getFlashVersion(mimeType.enabledPlugin.description);
			}

		} else {
			try {
				// Try 7 first, since we know we can use GetVariable with it
				var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7');
				hasFlash = true;
				flashVersion = getFlashVersion(ax.GetVariable('$version'));
			} catch (e) {
				// Try 6 next, some versions are known to crash with GetVariable calls
				try {
					var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
					hasFlash = true;
					flashVersion = '6.0.21';  // First public version of Flash 6
				} catch (e) {
					try {
						// Try the default activeX
						var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
						hasFlash = true;
						flashVersion = getFlashVersion(ax.GetVariable('$version'));
					} catch (e) {
						// No flash
					}
				}
			}
		}

		if (major == null || !hasFlash)
			return hasFlash;

		if (major < flashVersion[0] ||
				    (major == flashVersion[0] && minor < flashVersion[1]) ||
				    (major == flashVersion[0] && minor == flashVersion[1] && build <= flashVersion[2]))
			return true;

		return false;
	}

	this.doga = function(cmapath) {
		var utmcpmp = document.cookie.match(/__utmcpa=[^;]*/gi);
		var t = (Math.floor(new Date().getTime() / 1000)); // in seconds
		var c0;
		var commit = false;
		if (utmcpmp == null) //
		{
			utmcpmp = (10000000 + Math.floor(Math.random() * 99999999)) + "." + (1000000000 + Math.floor(Math.random() * 2147483647));
			utmcpmp += "." + t + "." + t + "." + t + ".1";
			c0 = utmcpmp.split(".");
			commit = true;
		}
		else //
		{
			utmcpmp = utmcpmp[0].substr(9);
			c0 = utmcpmp.split(".");
			if ((parseInt(c0[4]) + 30 * 60) < t) // 30 min timeout
			{
				c0[3] = parseInt(c0[4]);
				c0[4] = t;
				c0[5] = parseInt(c0[5]) + 1;

				utmcpmp = c0.join(".");
				commit = true;
			}
		}

		if (commit) //
		{
			var f = new Date((new Date()).getTime() + (30 * 24 * 60 * 60 * 1000));
			document.cookie = "__utmcpa=" + utmcpmp + "; expires=" + f.toGMTString() + " ; path=/ ; ";
		}

		var c4 = "-"; //user var
		var gifurl = "//www.google-analytics.com/__utm.gif";
		gifurl += "?utmwv=4.8.9";
		gifurl += "&utmn=" + Math.round(Math.random() * 2147483647);
		gifurl += "&utmhn=" + document.location.hostname;
		gifurl += "&utmcs=-";
		gifurl += "&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-";
		gifurl += "&utmhid=" + Math.round(Math.random() * 2147483647);
		gifurl += "&utmr=" + encodeURIComponent(document.location.href);
		gifurl += "&utmp=%2Fzepa%2F" + cmapath;
		gifurl += "&utmac=UA-21537476-1";
		gifurl += "&utmcc=__utma%3D" + utmcpmp + "%3B%2B";
		gifurl += "__utmz%3D" + c0[0] + "." + c0[4] + ".1.1.utmcsr%3D" + document.location.hostname + "%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D" + encodeURIComponent(document.location.pathname) + "%3B";
		gifurl += "&utmu=q";

		var gat = new Image(1, 1);
		gat.src = gifurl;
	}

	this.getSkin = function() {
		var zeiframe = document.getElementById("zeiframe_" + this.loaderParams["_object"]);
		if (zeiframe) {
			return zeiframe.contentWindow.zeGalleryArray.inneriframe.skin;
		}
		return this.skin;
	};

	function query(op, params, callback) {
		if (typeof params == 'function') {
			callback = params;
			params = {};
		}
		params.fid = self.args.fid;
		params.logged_user_cred = self.args.logged_user_cred;
		//+'?fid='+go.loaderParams._gid+'&logged_user_cred='+args.logged_user_cred
		new Ajax(cincopa._AJAX + op, params, function (r) {
			function json(data) {
				try {
					return eval('(' + data + ');');
				} catch (e) {
					return { error: "Invalid JSON format\n" + data, success: false };
				}
			}
			callback(json(r));
		});
	}

	function pquery(op, params, callback) {

		if (pquery.count === undefined) {
			pquery.count = 0;
		} else {
			pquery.count++;
		}

		var callback_name = "__pquery_temp_callback_" + pquery.count;

		//creating temp callback:
		window[callback_name] = function() {
			callback.apply(this, arguments);
			try {
				delete window[callback_name];
			} catch (e) {
				window[callback_name] = undefined;
			}
		}
		//adding callback to params
		params.callback = callback_name;

		go.loadScript(op + '?' + params_encode(params));

		function params_encode(params) {

			var out = [];
			for (var k in params) {
				var v = params[k];
				out.push(k + '=' + encodeURIComponent(v));
			}
			return out.join('&');
		}

	}

	
	this.merge_json = function(o1, o2, o3) {
		var o = {};

		for (var z in o1)
			o[z] = o1[z];
		for (var z in o2)
			o[z] = o2[z];
		for (var z in o3)
			o[z] = o3[z];

		return o;
	}

}

function zeOnMediaJSON(wid, json) {
	var go = zeGalleryArray[wid];
	go.MediaJSON = json;
	go.zeOnMediaJSON(json);

	//setTimeout(cincopa.cpmeasure, 10000);
}

function Ajax(url, params, callback) {

	var domain = url.match(/http:\/\/([\w\d-\.]+)/);
	if (domain) domain = domain[0];

	if (navigator.appVersion.match(/MSIE/)) {
		post_ie();
	} else {
		post();
	}

	function post_ie() {
		var xdr = new XDomainRequest();
		xdr.open("post", url);

		xdr.onload = function() {
			callback(xdr.responseText);
		};

		xdr.send(params_encode(params));
	}

	function post() {

		var http = new XMLHttpRequest();

		var method = 'POST';
		if (params.http_method) {
			method = params.http_method;
			delete params.http_method;
		}

		params = params_encode(params);

		if (method == 'GET') {
			url += '?' + params;
		}

		http.open(method, url, true);

		http.setRequestHeader("Connection", "close");

		if (method == 'POST') {
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-length", params.length);
			http.send(params);
		} else {
			http.send(null);
		}

		http.onreadystatechange = function() {
			cincopa.trace(http.readyState + ' ' + http.status);
			if (http.readyState == 4) {
				switch (http.status) {
					case 200:
						callback(http.responseText);
						break;
					default:
						cincopa.trace('http request failed: ' + http.status);
				}
			}
		}
	}

	function params_encode(params) {

		var out = [];
		for (var k in params) {
			var v = params[k];
			out.push(k + '=' + encodeURIComponent(v));
		}
		return out.join('&');
	}
}

cincopa.cpmeasure = function () {
	try {
		var cpmeasuredata = [];
		var cpper = window.performance.getEntries();
		var cnt = 0;
		for (var a in cpper) {
			var theobj = null;
			if (cpper[a].name.toString().indexOf(".cdn.cincopa.com") > -1)
				theobj = "ec";
			else if (cpper[a].name.toString().indexOf("preload.aspx?type=js") > -1)
				theobj = "preloadjs";
			else if (cpper[a].name.toString().indexOf("preload.aspx?type=css") > -1)
				theobj = "preloadcss";
			else if (cpper[a].name.toString().indexOf("widgetasync.aspx") > -1)
				theobj = "widgetasync";
			else if (cpper[a].name.toString().indexOf("json.aspx") > -1)
				theobj = "json";
			else if (cpper[a].name.toString().indexOf("libasync.js") > -1)
				theobj = "libasync";
			else if (cpper[a].name.toString().indexOf(".netdna-ssl.com") > -1)
				theobj = "nd";

			if (theobj != null) {
				theobj = theobj + (cincopa._ROOT_PROTOCOL == "https:" ? "-s" : "");
				var m = {};
				

				cincopa.trace(cpper[a]);
				// https://developers.google.com/web/tools/chrome-devtools/profile/network-performance/understanding-resource-timing
				m.d = Math.round(cpper[a].domainLookupEnd - cpper[a].domainLookupStart);
				m.c = Math.round(cpper[a].connectEnd - cpper[a].connectStart);
				m.rq = Math.round(cpper[a].responseStart - cpper[a].requestStart);
				m.rs = Math.round(cpper[a].responseEnd - cpper[a].responseStart);
				m.z = Math.round(cpper[a].duration);
				if (m.d == 0 && m.c == 0 && m.rq == 0 && m.rs == 0)
					continue;

				if (m.d == 0) delete m.d;
				if (m.c == 0) delete m.c;
				if (m.rq == 0) delete m.rq;
				if (m.rs == 0) delete m.rs;
				if (m.z == 0) delete m.z;
				m.n = theobj;

				cincopa.trace("Performance " + JSON.stringify(m));

				if (m.z > 30) {
					cpmeasuredata.push(m);
					cnt++;
					if (cnt >= 10) {
						var oat = new Image(1, 1);
						oat.src = cincopa._ROOT_ANALYTICS + "/os.aspx?s=" + JSON.stringify(cpmeasuredata);
						cnt = 0;
						cpmeasuredata = [];
					}
				}
			}
		}

		var oat = new Image(1, 1);
		oat.src = cincopa._ROOT_ANALYTICS + "/os.aspx?s=" + JSON.stringify(cpmeasuredata);
	}
	catch (ex) { }
}

cincopa.registerEvent("cincopa.cp_evt_mediaplay", "video.*");
cincopa.registerEvent("cincopa.cp_evt_mediaplay", "audio.*");
cincopa.registerEvent("cincopa.cp_evt_mediaplay", "chromecast.*");
cincopa.cp_evt_mediaplay = function(name, data, gallery) {
	if ((name == "video.play" || name == "audio.play") && data.second == 0 && !cincopa.disable_analytics) {
		try {
			var setref = "";
			if (cincopa.location_blocked)
				setref = "&setref=" + encodeURIComponent(cincopa.location);

			var oat = new Image(1, 1);
			oat.src = cincopa._ROOT_ANALYTICS + "/oa.aspx?uid=" + gallery.args.cmapath.substring(0, 12) + "&fid=ohit" + data.item.rid + setref;
		} catch (ex) { }
	}

	if (name == "chromecast.detected" || name == "chromecast.start" || name == "chromecast.stop" || name == "video.play" || name == "audio.play") {
		try {
			var oat = new Image(1, 1);
			oat.src = cincopa._ROOT_ANALYTICS + "/oa.aspx?uid=stats&fid=stat" + name;
		} catch (ex) { } 
	}
}

cincopa.registerEvent(function (eventName, data, gallery) {
	var html = data["overlay"].overlayHtml;
	var containerID = data["overlay"].overlayId;
	var params = data["overlay"].params;
	var container = document.getElementById(containerID);
	if (!container)
		return;
	var allowSkip, isDefaultForm, name = "";
	if (typeof params == "undefined") {
		allowSkip = true;
		isDefaultForm = false;
	} else {
		allowSkip = params.allowSkip;
		isDefaultForm = params.isDefaultForm;
		name = params.name.replace(/ /g, "_");
	}
	try {
		var oat = new Image(1, 1);
		oat.src = cincopa._ROOT_ANALYTICS + "/oa.aspx?uid=rtfeatures&fid=emailgate" + isDefaultForm + "&setref=" + encodeURIComponent(cincopa.location);
	}
	catch (ex) { }
	if (name == "")
		name = "rid" + data.item.rid;
	if (cincopa.inBetween(document.cookie, "cp_form_" + name + "=", ";") == "yes")
		return;

	go.onSkinEvent("emailgate.hide", data);
	if (allowSkip) {
		var closeBtn = document.createElement("a");
		closeBtn.innerHTML = "X";
		closeBtn.className = 'ze_overlay_close_btn';
		container.appendChild(closeBtn);
		closeBtn.onclick = function () {
			go.onSkinEvent("emailgate.skip", data)
		}
	}
	var containerDiv = document.createElement("div");
	containerDiv.className = 'ze_overlay_container_div';

	var containerDivContent = document.createElement("div");
	containerDivContent.className = 'ze_overlay_container_div_content';

	var parsedData = gallery.stripScripts(html);
	containerDivContent.innerHTML = parsedData.text;
	containerDiv.appendChild(containerDivContent);

	container.style.display = 'block';
	container.appendChild(containerDiv);

	for (var j = 0; j < parsedData.scripts.length; j++) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		if (parsedData.scripts[j].src) {
			script.src = parsedData.scripts[j].src;
		};
		script.text = parsedData.scripts[j].text;
		container.appendChild(script);
	}

	if (isDefaultForm) {
		var submitButton = document.getElementById('ze_htmloverlay_form_submit');
		var emailFieldID = document.getElementById('ze_htmloverlay_form_email');
		var firstFieldID = document.getElementById('ze_htmloverlay_form_first');
		var lastFieldID = document.getElementById('ze_htmloverlay_form_last');

		submitButton.addEventListener("click", function (e) {
			e.preventDefault();
			var email = "", first = "", last = "";
			if (emailFieldID) email = emailFieldID.value;
			if (firstFieldID) first = firstFieldID.value;
			if (lastFieldID) last = lastFieldID.value;

			var formData = {
				containerId: containerID,
				listId: params.listId,
				email: email,
				first: first,
				last: last,
				callback: function (data, gallery, eventData) {
					gallery.subscriptionSuccess = true;
					var f = new Date();
					f.setDate(f.getDate() + 30);
					document.cookie = "cp_form_" + name + "=yes; expires=" + f.toGMTString();
					go.onSkinEvent("emailgate.hide", eventData);
				}
			};
			data["formData"] = formData;
			if (email !== "") {
				go.onSkinEvent("emailgate.submit", data);
			}
			return false;
		}, false);
	}
}, "emailgate.show");

cincopa.registerEvent(function (eventName, data, gallery) {
	go.onSkinEvent("emailgate.hide", data);
}, "emailgate.skip");

cincopa.registerEvent(function (eventName, data, gallery) {
	var container = document.getElementById(data["overlay"].overlayId);
	if (container) {
		container.innerHTML = '';
		container.style.display = 'none';
	}
}, "emailgate.hide");

cincopa.registerEvent(function (eventName, data, gallery) {
	var url = cincopa._ROOT_LOADER.replace("/runtime", "") + 'email_integration_ajax.aspx';
	var obj = {
		http_method: 'GET',
		cmd: 'addmember',
		uid: gallery.args.cmapath.split('%')[0],
		listid: data["formData"].listId,
		first: data["formData"].first,
		last: data["formData"].last,
		email: data["formData"].email,
		company: 'yes'
	};
	if (obj.listid) {	// send ajax if listid exists
		Ajax(url, obj, function (res) {
			if (typeof data["formData"].callback == 'function') {
				data["formData"].callback(res, gallery, data);
			}
		})
	}
	var ssend = {};
	ssend.ckid = cincopa.cp_media_sessionid;
	ssend.uid = data.uid;
	ssend.rid = templastrid;
	ssend.hmid = cincopa.cp_media_hm[ssend.uid][ssend.rid]["hmid"];
	ssend.ud = { "name": (data["formData"].first + " " + data["formData"].last).trim(), "email": data["formData"].email };
	ssend.evt = { t: "u", s: "eg", p: cincopa.cp_media_hm[ssend.uid][ssend.rid]["lastpos"] };

	if (cincopa.disable_analytics)
		cincopa.trace("NOT SENDING " + JSON.stringify(ssend));
	else {
		var setref = "";
		if (cincopa.location_blocked)
			setref = "&setref=" + encodeURIComponent(cincopa.location);

		cincopa.trace(JSON.stringify(ssend));
		var oat = new Image(1, 1);
		oat.src = cincopa._ROOT_ANALYTICS + "/ohm.aspx?j=" + encodeURIComponent(JSON.stringify(ssend)) + setref;
	}

	if (!obj.listid && typeof data["formData"].callback == 'function')
		data["formData"].callback(data, gallery, data);

}, "emailgate.submit");


cincopa.registerEvent("cincopa.cp_evt_gaevent", "runtime.*");
cincopa.registerEvent("cincopa.cp_evt_gaevent", "skin.*");
cincopa.registerEvent("cincopa.cp_evt_gaevent", "video.*");
cincopa.registerEvent("cincopa.cp_evt_gaevent", "audio.*");
cincopa.cp_evt_gaevent = function (name, data, gallery) {
	if (name == "runtime.on-args") {
		if (gallery.args.vast && gallery.args.vast != "") {
			try {
				var oat = new Image(1, 1);
				oat.src = cincopa._ROOT_ANALYTICS + "/oa.aspx?uid=rtfeatures&fid=vast&setref=" + encodeURIComponent(cincopa.location);
			}
			catch (ex) { }
		}
	}
	else if (name == "runtime.on-media-json" && gallery.args.cmapath) {
		gallery.pushEventToGA("gallery.view");

		if (gallery.args.cmapath.indexOf("AADA-aw7QaU7") > -1 ||
			gallery.args.cmapath.indexOf("A8CA8gQBUtCe") > -1 ||
			gallery.args.cmapath.indexOf("AsPAITwpWpfN") > -1 ||
			gallery.args.cmapath.indexOf("AcHAO8gYXVgY") > -1 ||
			gallery.args.cmapath.indexOf("AsPAMKgQFk-e") > -1) {
			var toISO8601 = function (t) { r = ""; s = "H:M:S".split(":"); a = t.split(":"); while (p = a.pop()) r = p + s.pop() + r; return "PT" + r; }
			for (var i = 0; i < gallery.MediaJSON.items.length; i++) {
				if (gallery.MediaJSON.items[i].content_type == "video/mp4") {
					var jsonld = { "@context": "http://schema.org/", "@type": "VideoObject" };
					jsonld["@id"] = gallery.MediaJSON.items[i].rid;
					jsonld["duration"] = toISO8601(gallery.MediaJSON.items[i].duration); // "PT2M16S"
					jsonld["name"] = gallery.MediaJSON.items[i].title;
					jsonld["description"] = gallery.MediaJSON.items[i].description + ".";
					//jsonld["thumbnailUrl"] = gallery.MediaJSON.items[i].thumbnail_url;
					jsonld["thumbnailUrl"] = "https://www.cincopa.com/media-platform/api/thumb.aspx?size=large&rid=" + gallery.MediaJSON.items[i].rid;
					jsonld["uploadDate"] = gallery.MediaJSON.items[i].modified;
					var code = JSON.stringify(jsonld);
					var script = document.createElement('script');
					script.setAttribute('type', 'application/ld+json');
					try { script.appendChild(document.createTextNode(code)); } catch (e) { s.text = code; }
					var head = document.getElementsByTagName('head').item(0);
					head.appendChild(script);
				}
			}
		}
	}
	else if ((name == "video.play" || name == "audio.play") && data.second == 0)
		gallery.pushEventToGA(name + " " + data.item.title + " (" + data.item.rid + ")");
	else if ((name == "video.timeupdate" || name == "audio.timeupdate") && data.item.duration) {
		var dur = data.item.duration.split(":");
		var d = 0;
		for (var i = 1; dur.length - i >= 0; i++)
			d += (parseInt(dur[dur.length - i].split(".")[0]) * (Math.pow(60, i - 1)));

		if (Math.round(d / 4) == data.second)
			gallery.pushEventToGA(name.split(".")[0] + ".play 25% " + data.item.title + " (" + data.item.rid + ")");
		else if (Math.round(d / 2) == data.second)
			gallery.pushEventToGA(name.split(".")[0] + ".play 50% " + data.item.title + " (" + data.item.rid + ")");
		else if (Math.round(d / 4 * 3) == data.second)
			gallery.pushEventToGA(name.split(".")[0] + ".play 75% " + data.item.title + " (" + data.item.rid + ")");
	}
	else if (name == "video.ended" || name == "audio.ended")
		gallery.pushEventToGA(name.split(".")[0] + ".play 100% " + data.item.title + " (" + data.item.rid + ")");
}

try
{
	if (parent.window.cp_library_onload)
		parent.window.cp_library_onload();
}
catch (ex) { }


cincopa.cp_media_sessionid = cincopa.cp_media_sessionid || cincopa.inBetween(document.cookie, "cp_sessionid=", ";");
if (cincopa.cp_media_sessionid == null)
{
	cincopa.cp_media_sessionid = Math.random().toString().substring(2);
	document.cookie = "cp_sessionid=" + cincopa.cp_media_sessionid + "; path=/; max-age=157680000";
}
				
cincopa.cp_media_hm = cincopa.cp_media_hm || {};
cincopa.cp_media_next_commit = null;
cincopa.registerEvent("cincopa.cp_evt_media_hm","video.*");

cincopa.cp_hmsToSecondsOnly = function (str) {
	if (!str)
		return "";

	var p = str.split(':'),
		s = 0, m = 1;

	while (p.length > 0) {
		s += m * parseInt(p.pop(), 10);
		m *= 60;
	}

	return s + (str.indexOf(".") > -1 ? 1 : 0);
}
var templastrid = "";
cincopa.cp_evt_media_hm = function(name, data)
{
	var init = function () {
		cincopa.cp_media_hm[data.uid] = cincopa.cp_media_hm[data.uid] || {};
		cincopa.cp_media_hm[data.uid][data.item.rid] = cincopa.cp_media_hm[data.uid][data.item.rid] || {};
		cincopa.cp_media_hm[data.uid][data.item.rid]["hmid"] = cincopa.cp_media_hm[data.uid][data.item.rid]["hmid"] || ((new Date()).getTime() + ":" + Math.random().toString().substring(2));
		cincopa.cp_media_hm[data.uid][data.item.rid]["hm"] = cincopa.cp_media_hm[data.uid][data.item.rid]["hm"] || [];
		cincopa.cp_media_hm[data.uid][data.item.rid]["dur"] = cincopa.cp_media_hm[data.uid][data.item.rid]["dur"] || cincopa.cp_hmsToSecondsOnly(data.item.duration);
		cincopa.cp_media_hm[data.uid][data.item.rid]["cap"] = cincopa.cp_media_hm[data.uid][data.item.rid]["cap"] || data.item.title;
		cincopa.cp_media_hm[data.uid][data.item.rid]["firstsend"] = cincopa.cp_media_hm[data.uid][data.item.rid]["firstsend"] || false;
		cincopa.cp_media_hm[data.uid][data.item.rid]["lastpos"] = cincopa.cp_media_hm[data.uid][data.item.rid]["lastpos"] || -1;
		cincopa.cp_media_hm[data.uid][data.item.rid]["commit"] = false;
		templastrid = data.item.rid;
	}
	if (name == "video.load")
	{
		init();
		cincopa.cp_send_stats();
	}
	else if (name == "video.timeupdate")
	{
		init(); // for old players that didnt throw video.load
		cincopa.cp_media_hm[data.uid][data.item.rid]["commit"] = false;
		cincopa.cp_media_hm[data.uid][data.item.rid]["hm"][data.second] = (isNaN(cincopa.cp_media_hm[data.uid][data.item.rid]["hm"][data.second]) ? 0 : cincopa.cp_media_hm[data.uid][data.item.rid]["hm"][data.second]) + 1;
		cincopa.cp_media_hm[data.uid][data.item.rid]["lastpos"] = data.second;

		if (cincopa.cp_media_next_commit != null && cincopa.cp_media_next_commit < (new Date()))
		{
			cincopa.cp_send_stats();
			cincopa.cp_media_next_commit = null;
		}

		if (cincopa.cp_media_next_commit == null)
		{
			cincopa.cp_media_next_commit = new Date();
			cincopa.cp_media_next_commit.setSeconds(cincopa.cp_media_next_commit.getSeconds() + 5);
		}
						
	}
	else if (name == "video.ended" || name == "video.pause")
	{
		cincopa.cp_send_stats();
		cincopa.cp_media_next_commit = null;
	}
}

cincopa.cp_send_stats = function () {
	var shead = {};
	for (uid in cincopa.cp_media_hm) {
		shead.ckid = cincopa.cp_media_sessionid;
		shead.uid = uid;
		for (rid in cincopa.cp_media_hm[uid]) {
			if (cincopa.cp_media_hm[uid][rid]["commit"])
				continue;

			var ssend = shead;
			ssend.hmid = cincopa.cp_media_hm[uid][rid]["hmid"];
			ssend.rid = rid;
			var lastsec = -2;
			var lastwritesec = -2;
			var lastvol = 0;
			var totaluniqueseconds = 0;
			var hmlist = "";
			for (sec in cincopa.cp_media_hm[uid][rid]["hm"]) {
				sec = parseInt(sec);
				if (isNaN(sec))
					continue;

				totaluniqueseconds++;

				if (lastvol != cincopa.cp_media_hm[uid][rid]["hm"][sec]) {
					if (lastsec > -2) {
						if (lastwritesec != lastsec)
							hmlist += "-" + lastsec; // close range
						if (lastvol > 1)
							hmlist += ":" + lastvol; // add val
					}

					hmlist += (lastsec > -2 ? "," : "") + sec; // start range
					lastwritesec = sec;
				}
				else if (lastsec + 1 < sec) {
					if (lastwritesec != lastsec)
						hmlist += "-" + lastsec; // close range
					if (lastvol > 1)
						hmlist += ":" + lastvol; // add vol

					hmlist += (lastsec > -2 ? "," : "") + sec; // start range
					lastwritesec = sec;
				}

				lastsec = sec;
				lastvol = cincopa.cp_media_hm[uid][rid]["hm"][sec];
			}

			if (totaluniqueseconds > 0) {
				if (lastwritesec != lastsec)
					hmlist += "-" + lastsec; // close range
				if (lastvol > 1)
					hmlist += ":" + lastvol;

				ssend.hm = hmlist;
				ssend.prg = totaluniqueseconds;
			}

			if (!cincopa.cp_media_hm[uid][rid]["firstsend"] && totaluniqueseconds > 0) {
				ssend.name = cincopa.cp_media_hm[uid][rid]["cap"];
				ssend.dur = cincopa.cp_media_hm[uid][rid]["dur"];
				if (cincopa.qs && cincopa.qs.cpud)
					{ try { ssend.ud = JSON.parse(cincopa.qs.cpud); } catch (ex) { } }
				else if (cincopa.qs && (cincopa.qs.cpudemail || cincopa.qs.cpudname || cincopa.qs.cpudaccid))
				{
					ssend.ud = {};
					if (cincopa.qs.cpudemail)
						ssend.ud.email = cincopa.qs.cpudemail;
					if (cincopa.qs.cpudname)
						ssend.ud.name = cincopa.qs.cpudname;
					if (cincopa.qs.cpudaccid)
						ssend.ud.acc_id = cincopa.qs.cpudaccid;
				}
				else if (cincopa.hash && (cincopa.hash.cpudemail || cincopa.hash.cpudname || cincopa.hash.cpudaccid)) {
					ssend.ud = {};
					if (cincopa.hash.cpudemail)
						ssend.ud.email = cincopa.hash.cpudemail;
					if (cincopa.hash.cpudname)
						ssend.ud.name = cincopa.hash.cpudname;
					if (cincopa.hash.cpudaccid)
						ssend.ud.acc_id = cincopa.hash.cpudaccid;
				}
				else if (cincopa.analytics)
					ssend.ud = cincopa.analytics;

				cincopa.cp_media_hm[uid][rid]["firstsend"] = true;
			}

			if (cincopa.disable_analytics)
				cincopa.trace("NOT SENDING " + JSON.stringify(ssend));
			else {
				var setref = "";
				if (cincopa.location_blocked)
					setref = "&setref=" + encodeURIComponent(cincopa.location);

				cincopa.trace(JSON.stringify(ssend));
				var oat = new Image(1, 1);
				oat.src = cincopa._ROOT_ANALYTICS + "/ohm.aspx?j=" + encodeURIComponent(JSON.stringify(ssend)) + setref;

				cincopa.cp_media_hm[uid][rid]["commit"] = true;
			}
		}
	}
}
//console.debug(cincopa.location_blocked);
//console.debug(cincopa.location);