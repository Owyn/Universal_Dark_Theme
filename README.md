<h1>Universal Dark Theme Maker</h1>
Browser userscript (extension) to apply a simple Dark Theme style for any website which you can configure per-site. 
<br>
Or a developer tool to create dark themes for websites using custom css and js in per-site script settings.

<h4>One click to turn one dark theme style for a website - (hotkey `T` while menu is open)
<br>
<img src="https://images2.imgbox.com/2c/dd/QrjeXsVA_o.png">

<h3>Configuration (per-site & global for colors)
<br>
<img src="https://github.com/Owyn/Universal_Dark_Theme/assets/1309656/f5d60f79-74fc-4ecc-9d88-3886cf6075c3">

<h3>Supported browsers:</h3>
<img src=https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/180px-Google_Chrome_icon_%28September_2014%29.svg.png><img src=https://github.com/Owyn/Universal_Dark_Theme/assets/1309656/0d2c7e4a-4038-4c06-96a8-505a36c9d625>

<h3>Supported userscript managers:</h3>
<a href="https://www.tampermonkey.net/"><img src=https://avatars2.githubusercontent.com/u/767504?s=120&v=4></a>

<h3>How to stop flickering:</h3> 
(sometimes it happens when the site loads in white and then it lags and then the script turns it dark)
that is because userscripts are loaded in "lazy mode" asynchroniously by default, to guarantee that they are loaded exactly when expected - go to TamperMonkey's dashboard -> settings -> inject mode: instant
<br>
<img src=https://github.com/user-attachments/assets/3b7e1a9c-45aa-4a5e-b7a4-9f886d67774b>



<h2><b>Important Notes:</b></h2>
Userscript works well on simplemistic website designs with little color gradients and lack of shades used, because it makes all backgrounds into one background color and all text colors into one text color.

Moreover not all website designs are competently done and might (and likely would) contain broken elements which would require hammering them out with your CSS (web style programming) knowledge. Or you could just look for a ready-to-use userstyle for that specific website on userstyles.org or in google with "website.com dark theme script" search and not bother.

There is no such thing as magic<br><img src="https://cdn.discordapp.com/emojis/369683046468681729.png">

However simple one-click dark theme applicator (or a handy tool to craft dark themes - I noticed I was using the same CSS dark style for quite a lot of websites and decided to make this universal one instead) would be enough in many cases.

Is some website broken ? (especially if you use high-contrast windows theme) - no problem, just one click and:<br>

<a href="https://ibb.co/BLwrLLv"><img src="https://i.ibb.co/BLwrLLv/borked.png" alt="borked" border="0"></a><img src="https://i.ibb.co/hs5W3VN/57116-1.png" border="0"><a href="https://ibb.co/YXk58SQ"><img src="https://i.ibb.co/YXk58SQ/unborked.png" alt="unborked" border="0"></a>

<h3>how to bring back original color to an element (exclude css elements): - Click inspect element on it and</h3><br>
<a href="https://ibb.co/1nCS5FD"><img src="https://i.ibb.co/1nCS5FD/how-to-bring-back-color.png" alt="how-to-bring-back-color" border="0"></a>

see, inspected element there has `bell` class, so you just enter it as `.bell` (class "bell") into excludes list of the script config - OR \ AND - you could try enabling "keep background images" option for that website before and see if it'd unhide what you want (or even more than that so it'd look ugly :D - test yourself)

<h3>other tips</h3>

- to use just custom CSS \ JS on a site without changing any colors - just add `*` (asterix) into excludes to exclude literally everything

- to get the green dark theme you have seen on the screen above - just use those color codes shown on the screenshot above :-)

- or use a cool golden one from this old screenshot below:
<img src="https://user-images.githubusercontent.com/1309656/147600205-9088037b-d2b2-4125-a054-85d498dbff3f.png">


Just make sure there is enough contrast between the text and background colors,
it should be at least 7:1 to read normal-sized text comfortably according to WCAG Level AAA standard, use this online checker: https://webaim.org/resources/contrastchecker/ 
<img src="https://github.com/Owyn/Universal_Dark_Theme/assets/1309656/9cf172ab-407f-46a9-ad5a-fc5b731f7407">

