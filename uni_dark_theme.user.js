// ==UserScript==
// @name		Universal Dark Theme
// @namespace	uni_dark_theme
// @version		1.0
// @description	Simple Dark Theme style for any website which you can configure per-site
// @downloadURL	https://github.com/Owyn/Universal_Dark_Theme/raw/master/uni_dark_theme.user.js
// @supportURL	https://github.com/Owyn/Universal_Dark_Theme/issues
// @homepage	https://github.com/Owyn/Universal_Dark_Theme
// @icon		https://images2.imgbox.com/b3/67/Aq5XazuW_o.png
// @author		Owyn
// @match		*://*/*
// @grant		GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// @run-at		document-start
// @noframes
// ==/UserScript==

(function() {
	'use strict';

	var el;
	var css;
	var cfg_color;
	var cfg_bgclr;
	var cfg_visclr;
	var cfg_excl;
	var cfg_css;
	var cfg_js;
	var cfg_active = (localStorage.getItem('active') === 'true');
	function load_settings()
	{
		cfg_excl = localStorage.getItem('excl') || "";
		cfg_css = localStorage.getItem('css') || "";
		cfg_js = localStorage.getItem('js') || "";
		if (typeof GM_getValue !== "undefined")
		{
			cfg_color = GM_getValue("Color", "#c0c0c0");
			cfg_bgclr = GM_getValue("bgColor", "#2b2b2b");
			cfg_visclr = GM_getValue("visitedColor", "#a4a4a4");
		}
    }

	function activate(yes, prev_active)
	{
		if(prev_active && el){document.body.removeChild(el);}
		if(yes)
		{
			make_css();
			el = GM_addStyle(css);
			el = document.body.appendChild(el);
			if(cfg_js){eval(cfg_js);}
		}
	}
	function toggleDT()
	{
		load_settings();
		let prev_active = cfg_active;
		cfg_active = !(localStorage.getItem('active') === 'true');
		activate(cfg_active, prev_active);
		if(!cfg_active)
		{
			localStorage.removeItem('active');
		}
		else
		{
			localStorage.setItem('active', "true");
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
		////////////// Main thing, the style!:
		css = `
		*`+exc_txt+` {
			color: `+cfg_color+` !important;
			background: `+cfg_bgclr+` !important;
			border-color: `+cfg_color+` !important;
		}
		a:visited, a:hover`+exc_txt+` {
			color: `+cfg_visclr+` !important;
		}
		`+cfg_css+`
		`;
		//////////////
	}

	if(cfg_active)
	{
		load_settings();
		make_css();
		el = GM_addStyle(css);
		document.addEventListener("DOMContentLoaded", function(){ el = document.body.appendChild(el); if(cfg_js){eval(cfg_js);} });
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
				localStorage.setItem('active', document.getElementById("active").checked);
				// pretty text "saved"
				document.getElementById("cfg_save").value = "SAVED !";
				clearTimeout(t);
				t = setTimeout(function() {document.getElementById("cfg_save").value = "Save configuration";},1500)
				// update active configuration
				cfg_color = document.getElementById("color").value;
				cfg_bgclr = document.getElementById("bgclr").value;
				cfg_visclr = document.getElementById("visitedColor").value;
				cfg_excl = document.getElementById("excl").value;
				cfg_css = document.getElementById("css").value;
				cfg_js = document.getElementById("js").value;
				activate(document.getElementById("active").checked, cfg_active );
				cfg_active = document.getElementById("active").checked;
				// clean up
				if(!document.getElementById("active").checked) { localStorage.removeItem('active'); }
				if(!document.getElementById("excl").value) { localStorage.removeItem('excl'); }
				if(!document.getElementById("css").value) { localStorage.removeItem('css'); }
				if(!document.getElementById("js").value) { localStorage.removeItem('js'); }
			}
			load_settings();
			var div = document.createElement("div");
			div.style.position = "fixed";
			div.style.top = "5%";
			div.style.left = "50%";
			div.style.margin = "5% -222px";
			div.style.width = "444px";
			div.style.border = "solid 1px black";
			div.style.background = "silver";
			div.style.zIndex = 8888888;
			div.innerHTML = "<b><center>Configuration</center></b>"
			+ "<br><br><input id='color' type='text' size='7'> Text color (empty = site default)"
			+ "<br><br><input id='bgclr' type='text' size='7'> Background color"
			+ "<br><br><input id='visitedColor' type='text' size='7'> Visited & hovered links color"
			+ "<br><br><center><b>Per-site settings (stored in browser cookies called LocalStorage):</b>"
			+ "<br><br><input id='active' type='checkbox'> Enabled for this website"
			+ "<br><br>Excluded css elements (e.g. \"#id1,.class2,input\"):<br><textarea id='excl' style='margin: 0px; width: 400px; height: 50px; resize:both;'></textarea>"
			+ "<br><br>Custom CSS style:<br><textarea id='css' style='margin: 0px; width: 400px; height: 50px; resize:both;'></textarea>"
			+ "<br><br>Custom JS Action:<br><textarea id='js' style='margin: 0px; width: 400px; height: 50px; resize:both;'></textarea>"
			+ "<br><input id='cfg_save' type='button' value='Save configuration'> <input id='cfg_close' type='button' value='Close'></center>";
			document.body.appendChild(div);
			document.getElementById("color").value = cfg_color;
			document.getElementById("bgclr").value = cfg_bgclr;
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
