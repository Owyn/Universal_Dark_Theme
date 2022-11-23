// ==UserScript==
// @name		Universal Dark Theme Maker
// @namespace	uni_dark_theme
// @version		1.17
// @description	Simple Dark Theme style for any website which you can configure per-site
// @downloadURL	https://github.com/Owyn/Universal_Dark_Theme/raw/master/uni_dark_theme.user.js
// @updateURL	https://github.com/Owyn/Universal_Dark_Theme/raw/master/uni_dark_theme.user.js
// @supportURL	https://github.com/Owyn/Universal_Dark_Theme/issues
// @homepage	https://github.com/Owyn/Universal_Dark_Theme
// @icon		https://images2.imgbox.com/b3/67/Aq5XazuW_o.png
// @author		Owyn
// @match		*://*/*
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// @grant		unsafeWindow
// @sandbox		JavaScript
// @run-at		document-start
// ==/UserScript==

(function() {
	'use strict';

	var el;
	var css;
	var cfg_color;
	var cfg_bgclr;
	var cfg_bgimg;
	var cfg_visclr;
	var cfg_excl;
	var cfg_css;
	var cfg_js;
	var cfg_active;
	switch(localStorage.getItem('active'))
	{
		case "true": // back-compatibility
		case "1":
			cfg_active = true;
			break;
		default:
			cfg_active = false;
			break;
	}
	function load_settings()
	{
		cfg_excl = localStorage.getItem('excl') || "";
		cfg_css = localStorage.getItem('css') || "";
		cfg_js = localStorage.getItem('js') || "";
		cfg_bgimg = (localStorage.getItem('bgimg') === '1');
		if (typeof GM_getValue !== "undefined")
		{
			cfg_color = GM_getValue("Color", "#c0c0c0");
			cfg_bgclr = GM_getValue("bgColor", "#2e2e2e");
			cfg_visclr = GM_getValue("visitedColor", "#a4a4a4");
		}
    }

	function activate(yes, prev_active)
	{
		if(prev_active && el){document.documentElement.removeChild(el);}
		if(yes)
		{
			make_css();
			el = addStyle(css);
			if(cfg_js){eval(cfg_js);}
		}
	}
	function toggleDT()
	{
		load_settings();
		cfg_active = !cfg_active;
		activate(cfg_active, !cfg_active);
		if(!cfg_active)
		{
			localStorage.removeItem('active');
		}
		else
		{
			localStorage.setItem('active', "1");
		}
	}

	if (typeof GM_registerMenuCommand !== "undefined")
	{
		GM_registerMenuCommand("Dark Theme Configuration", cfg, "D");
		GM_registerMenuCommand("Toggle Dark Theme", toggleDT, "T");
	}

	function make_css()
	{
		let exclusions;
		let exc_txt = ""
		if(cfg_excl !== "")
		{
			exclusions = cfg_excl.split(",");
			for (var i = 0, len = exclusions.length; i < len; i++)
			{
				exc_txt += ":not("+exclusions[i]+")";
			}
		}
		let bgimg_txt = cfg_bgimg ? "-color" : "";
		////////////// Main thing, the style!:
		css = `
		*`+exc_txt+` {
			color: `+cfg_color+` !important;
			background`+bgimg_txt+`: `+cfg_bgclr+` !important;
			border-color: `+cfg_color+` !important;
			color-scheme: dark;
		}
		:visited`+exc_txt+`, a:hover`+exc_txt+` {
			color: `+cfg_visclr+` !important;
		}
		:focus`+exc_txt+`{
			outline: 1px solid `+cfg_visclr+` !important;
		}
		`+cfg_css+`
		`;
		//////////////
	}

	function addStyle (aCss)
	{
		let style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.textContent = aCss;
		document.documentElement.appendChild(style);
		return style;
	};

	if(cfg_active)
	{
		console.info("adding dark style...");
		load_settings();
		make_css();
		el = addStyle(css);
		console.info(unsafeWindow);
        console.info(el);
		window.addEventListener("DOMContentLoaded", function(){ el = document.documentElement.appendChild(el); if(cfg_js){eval(cfg_js);} }); // make sure style element is at the bottom & execute custom JS
	}

	var t;
	function cfg()
	{
		if (typeof GM_setValue !== "undefined")
		{
			function saveCfg()
			{
				GM_setValue("Color", document.getElementById("color").value);
				GM_setValue("bgColor", document.getElementById("bgclr").value);
				GM_setValue("visitedColor", document.getElementById("visitedColor").value);
				localStorage.setItem('excl', document.getElementById("excl").value);
				localStorage.setItem('css', document.getElementById("css").value);
				localStorage.setItem('js', document.getElementById("js").value);
				localStorage.setItem('active', document.getElementById("active").checked ? "1" : "0");
				localStorage.setItem('bgimg', document.getElementById("bgimg").checked ? "1" : "0");
				// pretty text "saved"
				document.getElementById("cfg_save").value = "SAVED !";
				clearTimeout(t);
				t = setTimeout(function() {document.getElementById("cfg_save").value = "Save configuration";},1500)
				// update active configuration
				cfg_color = document.getElementById("color").value;
				cfg_bgclr = document.getElementById("bgclr").value;
				cfg_bgimg = document.getElementById("bgimg").checked;
				cfg_visclr = document.getElementById("visitedColor").value;
				cfg_excl = document.getElementById("excl").value;
				cfg_css = document.getElementById("css").value;
				cfg_js = document.getElementById("js").value;
				activate(document.getElementById("active").checked, cfg_active );
				cfg_active = document.getElementById("active").checked;
				// clean up
				if(!document.getElementById("active").checked) { localStorage.removeItem('active'); }
				if(!document.getElementById("bgimg").checked) { localStorage.removeItem('bgimg'); }
				if(!document.getElementById("excl").value) { localStorage.removeItem('excl'); }
				if(!document.getElementById("css").value) { localStorage.removeItem('css'); }
				if(!document.getElementById("js").value) { localStorage.removeItem('js'); }
			}
			load_settings();
			var div = document.createElement("div");
			div.style = "margin: auto; width: fit-content; height: fit-content; border: 1px solid black; color: "+cfg_color+"; background: "+cfg_bgclr+"; position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 8888888; line-height: 1;";
			div.innerHTML = "<b><br><center>Configuration</center></b>"
			+ "<div style='margin: auto; display: table;'><br><input id='color' type='text' size='7' style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial; margin: initial;'> Text color (empty = site default)"
			+ "<br><br><input id='bgclr' type='text' size='7' style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial; margin: initial;'> Background color"
			+ "<br><br><input id='visitedColor' type='text' size='7' style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial; margin: initial;'> <span style=\"color: "+cfg_visclr+" !important\">Visited & hovered links color</span>"
			+ "<br><br></div><center><b>Per-site settings (stored in browser cookies called LocalStorage):</b>"
			+ "<br><br><input id='active' type='checkbox' style='display:inline; width:initial; padding: initial; margin: initial;'> Enabled for this website"
			+ "<br><br><input id='bgimg' type='checkbox' style='display:inline; width:initial; padding: initial; margin: initial;'> Keep background-images"
			+ "<br><br>Excluded css elements (e.g. \"#id1,.class2,input\"):<br><textarea id='excl' style='margin: 0px; width: 400px; height: 50px; resize:both; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; display:inline; padding: initial; margin: initial;'></textarea>"
			+ "<br><br>Custom CSS style:<br><textarea id='css' style='margin: 0px; width: 400px; height: 50px; resize:both; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; display:inline; padding: initial; margin: initial;'></textarea>"
			+ "<br><br>Custom JS Action:<br><textarea id='js' style='margin: 0px; width: 400px; height: 50px; resize:both; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; display:inline; padding: initial; margin: initial;'></textarea>"
			+ "<br><input id='cfg_save' type='button' value='Save configuration'  style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial; margin: initial;'> <input id='cfg_close' type='button' value='Close'  style='display:inline; color: "+cfg_color+"; background-color: "+cfg_bgclr+"; width:initial; padding: initial; margin: initial;'></center>";
			document.body.appendChild(div);
			document.getElementById("color").value = cfg_color;
			document.getElementById("bgclr").value = cfg_bgclr;
			document.getElementById("bgimg").checked = cfg_bgimg;
			document.getElementById("visitedColor").value = cfg_visclr;
			//
			document.getElementById("active").checked = cfg_active;
			document.getElementById("excl").value = cfg_excl;
			document.getElementById("css").value = cfg_css;
			document.getElementById("js").value = cfg_js;
			document.getElementById("cfg_save").addEventListener("click", saveCfg, true);
			document.getElementById("cfg_close").addEventListener("click", function(){div.remove();clearTimeout(t);}, true);
		}
		else
		{
			alert("Sorry, Chrome userscripts in native mode can't have configurations! Install TamperMonkey userscript-manager extension");
		}
	}

})();
