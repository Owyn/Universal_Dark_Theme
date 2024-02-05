// ==UserScript==
// @name		Universal Dark Theme Maker
// @namespace	uni_dark_theme
// @version		1.33
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
// @grant		GM_addElement
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
	var cfg_bgtrans;
	var cfg_visclr;
	var cfg_excl;
	var cfg_css;
	var cfg_js;
	var cfg_match_pseudo;
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
		cfg_bgtrans = (localStorage.getItem('bgtrans') === '1');
		cfg_match_pseudo = (localStorage.getItem('match_pseudo') === '1');
		if (typeof GM_getValue !== "undefined")
		{
			cfg_color = GM_getValue("Color", "#c0c0c0");
			cfg_bgclr = GM_getValue("bgColor", "#2e2e2e");
			cfg_visclr = GM_getValue("visitedColor", "#a4a4a4");
		}
    }

	function activate(yes, prev_active)
	{
		if(prev_active && el){console.debug("Removing dark style..."); el.remove();}
		if(yes)
		{
			make_css();
			console.debug("adding dark style...");
			el = GM_addElement(document.documentElement, 'style', {textContent: css});
			console.debug(el);
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
        let match_pseudo = cfg_match_pseudo ? (",*"+exc_txt+"::before"+",*"+exc_txt+"::after") : "";
		////////////// Main thing, the style!:
		css = (cfg_excl !== "*" ?(cfg_bgtrans ?`
		:root`+exc_txt+` {
			color: `+cfg_color+` !important;
			background`+bgimg_txt+`: `+cfg_bgclr+` !important;
			border-color: `+cfg_color+` !important;
			color-scheme: dark;
		}
		:root `:``)+`*`+exc_txt+match_pseudo+` {
			color: `+(cfg_bgtrans ? `unset` : cfg_color)+` !important;
			background`+bgimg_txt+`: `+(cfg_bgtrans ? `unset` : cfg_bgclr)+` !important;
			border-color: `+cfg_color+` !important;
			color-scheme: dark;
		}
		:visited`+exc_txt+`, a:hover`+exc_txt+` {
			color: `+cfg_visclr+` !important;
		}
		input:focus`+exc_txt+`,textarea:focus`+exc_txt+`,select:focus`+exc_txt+`{
			outline: 1px solid `+cfg_visclr+` !important;
		}
		`:"")+cfg_css;
		//////////////
	}

	if(cfg_active)
	{
		console.debug("Adding dark style...");
		load_settings();
		make_css();
		el = GM_addElement(document.documentElement, 'style', {textContent: css});
		console.debug(unsafeWindow);
        console.debug(el);
		window.addEventListener("DOMContentLoaded", function(){
			if (document.documentElement.firstElementChild === el) // very fast browser
			{
				while (document.documentElement.lastElementChild !== el)
				{
					document.documentElement.prepend(document.documentElement.lastElementChild);
				}
				console.debug("moved dark style to the bottom"); // actually not, cuz security restrictions
			}
			if (cfg_js)
			{
				eval(cfg_js); // execute custom JS when the page fully loads
			}
			});
	}

	if (typeof GM_registerMenuCommand !== "undefined")
	{
		GM_registerMenuCommand("Dark Theme Configuration", ((typeof GM_addElement !== "undefined") ? cfg : tell_users_they_are_wrong), "D");
		GM_registerMenuCommand("Toggle Dark Theme",  ((typeof GM_addElement !== "undefined") ? toggleDT : tell_users_they_are_wrong), "T");
	}
	else
	{
		tell_users_they_are_wrong();
	}

	function tell_users_they_are_wrong()
	{
		let txt = "Sorry, your userscript manager is missing functionality needed for Universal Dark Theme script to work! Install TamperMonkey userscript-manager extension (the №1 most popular userscript-manager extension - how did you miss it?...)"
		console.error(txt);
		alert(txt);
	}

	var t;
	var div;
	function cfg()
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
			localStorage.setItem('match_pseudo', document.getElementById("match_pseudo").checked ? "1" : "0");
			localStorage.setItem('bgimg', document.getElementById("bgimg").checked ? "1" : "0");
			localStorage.setItem('bgtrans', document.getElementById("bgtrans").checked ? "1" : "0");
			// pretty text "saved"
			document.getElementById("cfg_save").value = "SAVED OK";
			clearTimeout(t);
			t = setTimeout(function() {document.getElementById("cfg_save").value = "Save config";},1500)
			// update active configuration
			cfg_color = document.getElementById("color").value;
			cfg_bgclr = document.getElementById("bgclr").value;
			cfg_bgimg = document.getElementById("bgimg").checked;
			cfg_bgtrans = document.getElementById("bgtrans").checked;
			cfg_match_pseudo = document.getElementById("match_pseudo").checked;
			cfg_visclr = document.getElementById("visitedColor").value;
			cfg_excl = document.getElementById("excl").value;
			cfg_css = document.getElementById("css").value;
			cfg_js = document.getElementById("js").value;
			activate(document.getElementById("active").checked, cfg_active );
			cfg_active = document.getElementById("active").checked;
			// clean up
			if(!document.getElementById("active").checked) { localStorage.removeItem('active'); }
			if(!document.getElementById("match_pseudo").checked) { localStorage.removeItem('match_pseudo'); }
			if(!document.getElementById("bgimg").checked) { localStorage.removeItem('bgimg'); }
			if(!document.getElementById("bgtrans").checked) { localStorage.removeItem('bgtrans'); }
			if(!document.getElementById("excl").value) { localStorage.removeItem('excl'); }
			if(!document.getElementById("css").value) { localStorage.removeItem('css'); }
			if(!document.getElementById("js").value) { localStorage.removeItem('js'); }
		}
		if(div)
		{
			if(!div.isConnected) document.body.appendChild(div);
			return;
		}
		load_settings();
		div = document.createElement("div");
		div.style = "all:revert; margin: auto !important; width: fit-content !important; height: fit-content !important; border: 1px solid "+cfg_color+"; color: "+cfg_color+"; !important; background: "+cfg_bgclr+" !important; position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 2147483647; line-height: 1 !important;";
		div.innerHTML = "<b><br><center>Configuration</center></b>"
		+ "<div style='margin: auto; display: table;'>"
		+ "<br><input id='color' type='text' size='7' style='all:revert; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important; padding:initial !important; margin:2px !important;'> Text color (empty = site default)"
		+ "<br><input id='bgclr' type='text' size='7' style='all:revert; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important; padding:initial !important; margin:2px !important;'> Background color"
		+ "<br><input id='visitedColor' type='text' size='7' style='all:revert; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important; padding:initial !important; margin:2px !important;'> <a href='' onclick='return false;'>Visited & hovered links color</a>"
		+ "<br><br></div><center><b>Per-site settings (stored in browser cookies called LocalStorage):</b>"
		+ "<table style='all:revert;'><tr style='all:revert; padding:1px !important;'><td style='all:revert; padding:1px !important;'><input id='active' type='checkbox' style='all:revert; margin:initial !important;'> Enabled for this website"
		+ "</td><td style='all:revert; padding:1px !important;'><input id='match_pseudo' type='checkbox' style='all:revert; margin:initial !important;'> Also color pseudo-elements"
		+ "</td></tr><br><br><tr style='all:revert; padding:1px !important;'><td style='all:revert; padding:1px !important;'><input id='bgimg' type='checkbox' style='all:revert; margin:initial !important;'> Keep background-images"
		+ "</td><td style='all:revert; padding:1px !important;'><input id='bgtrans' type='checkbox' style='all:revert; margin:initial !important;'> Make background transparent </td></tr></table>"
		+ "<br>Excluded css elements (e.g. \"#id1,.class2,input\"):<br><textarea id='excl' style='all:revert; margin: 0px; min-width: 400px; height: 50px; resize:both !important; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important; padding:initial !important;'></textarea>"
		+ "<br><br>Custom CSS style:<br><textarea id='css' style='all:revert; margin: 0px; min-width: 400px; height: 50px; resize:both !important; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important; padding:initial !important;'></textarea>"
		+ "<br><br>Custom JS Action:<br><textarea id='js' style='all:revert; margin: 0px; min-width: 400px; height: 50px; resize:both !important; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important; padding:initial !important;'></textarea>"
		+ "<br><input id='cfg_save' type='button' value='Save config'  style='all:revert; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important;'> <input id='cfg_close' type='button' value='Close'  style='all:revert; color: "+cfg_color+" !important; background-color: "+cfg_bgclr+" !important; padding:initial !important;'></center>";
		document.body.appendChild(div);
		document.getElementById("color").value = cfg_color;
		document.getElementById("bgclr").value = cfg_bgclr;
		document.getElementById("bgimg").checked = cfg_bgimg;
		document.getElementById("bgtrans").checked = cfg_bgtrans;
		document.getElementById("visitedColor").value = cfg_visclr;
		//
		document.getElementById("active").checked = cfg_active;
		document.getElementById("match_pseudo").checked = cfg_match_pseudo;
		document.getElementById("excl").value = cfg_excl;
		document.getElementById("css").value = cfg_css;
		document.getElementById("js").value = cfg_js;
		document.getElementById("cfg_save").addEventListener("click", saveCfg, true);
		document.getElementById("cfg_close").addEventListener("click", function(){div.remove();clearTimeout(t);}, true);
	}

})();
