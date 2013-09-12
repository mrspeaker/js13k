//{"back_main":"#4b5d70","font_main":"#ffffff","tile":{"dirt":"0x5d4837","grass":"0x6aaa40","stone":"0x8f8c8d","water_splash":"0xffffff","water":"0x4b83c3","lava_lines":"0xe12900","lava":"0xfe9b00","vine_leaves":"0x23b908","vine_ladder":"0xdea207"}}

var COLOR = {
	back_main: "#001155",
	font_main: "#ffffff",

	tile: {

		dirt: "0x715137",
		grass: "0x6aaa40",
		stone: "0x7f7f7f",

		water_splash: "0xffffff",
		water: "0x4b83c3",
		lava_lines: "0xe12900",
		lava: "0xfe9b00",

		vine_leaves: "0x50D937",
		vine_ladder: "0xe1c479"
	}

	/*,

	chars: {

		outline:

		player_head:
		player_limbs:
		player_body:

		ghoul_head:
		ghoul_limbs:
		ghoul_body:
		ghoul_shadow:

		spear:

		pickup:
		grail:
	}*/

};
COLOR = {
	"back_main":"#4b5d70",
	"font_main":"#ffffff",
	"tile":{
		"dirt":"0x5d4837",
		"grass":"0x6aaa40",
		"stone":"0x8f8c8d",
		"water_splash":"0xffffff",
		"water":"0x4b83c3",
		"lava_lines":"0xe12900",
		"lava":"0xfe9b00",
		"vine_leaves":"0x23b908",
		"vine_ladder":"0xdea207"
	}
};

var COLORTEST = {
	update: function () {

		document.querySelector("#board").style.backgroundColor = COLOR.back_main;

		// Regen tiles
		game.res.tiles = GEN.tiles(game.tw, game.th);
		// Update map
		if (game.screen && game.screen.map) {
			game.screen.map.sheet = makeSheet(game.res.tiles, game.tw, game.th);
		}

		game.res.font = GEN.font();


		document.querySelector("#tx").innerHTML = JSON.stringify(COLOR)

	},

	ui: function () {

		var curr = null;

		function addInput(data) {
			var o = document.createElement("div"),
				l = document.createElement("span"),
				i = document.createElement("input");
			l.innerHTML = data.name;
			i._data = data;
			i.value = data.val;
			i.style.backgroundColor = i.value;
			o.appendChild(l);
			o.appendChild(i);
			document.querySelector("#txt").appendChild(o);

			i.addEventListener("click", function (e) {
				curr = this;
				console.log(this._data, e)
				cpo.setHex(this._data.val);
			}, false);
		}

		function toHex (cssHex) {
			return "0x" + cssHex.slice(1)
		}

		function toCSSHex (hex) {
			return "#" + hex.slice(2);
		}

		function setFieldValue (value, data) {

			if (curr._data.parent == "tile") {
        		value = "0x" + value.slice(1)
        	}

			if (!data.parent) {
				COLOR[data.field] = value;
			} else {
				COLOR[data.parent][data.field] = value;
			}

			COLORTEST.update();
		}

		var cp = document.querySelector("#col");
		//cp.style.display = "none";

		// Color picker
		(function(s,t,u){
			var v=(s.SVGAngle||t.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML"),picker,slide,hueOffset=15,svgNS='http://www.w3.org/2000/svg';var w=['<div class="picker-wrapper">','<div class="picker"></div>','<div class="picker-indicator"></div>','</div>','<div class="slide-wrapper">','<div class="slide"></div>','<div class="slide-indicator"></div>','</div>'].join('');function mousePosition(a){if(s.event&&s.event.contentOverflow!==u){return{x:s.event.offsetX,y:s.event.offsetY}}if(a.offsetX!==u&&a.offsetY!==u){return{x:a.offsetX,y:a.offsetY}}var b=a.target.parentNode.parentNode;return{x:a.layerX-b.offsetLeft,y:a.layerY-b.offsetTop}}function $(a,b,c){a=t.createElementNS(svgNS,a);for(var d in b)a.setAttribute(d,b[d]);if(Object.prototype.toString.call(c)!='[object Array]')c=[c];var i=0,len=(c[0]&&c.length)||0;for(;i<len;i++)a.appendChild(c[i]);return a}if(v=='SVG'){slide=$('svg',{xmlns:'http://www.w3.org/2000/svg',version:'1.1',width:'100%',height:'100%'},[$('defs',{},$('linearGradient',{id:'gradient-hsv',x1:'0%',y1:'100%',x2:'0%',y2:'0%'},[$('stop',{offset:'0%','stop-color':'#FF0000','stop-opacity':'1'}),$('stop',{offset:'13%','stop-color':'#FF00FF','stop-opacity':'1'}),$('stop',{offset:'25%','stop-color':'#8000FF','stop-opacity':'1'}),$('stop',{offset:'38%','stop-color':'#0040FF','stop-opacity':'1'}),$('stop',{offset:'50%','stop-color':'#00FFFF','stop-opacity':'1'}),$('stop',{offset:'63%','stop-color':'#00FF40','stop-opacity':'1'}),$('stop',{offset:'75%','stop-color':'#0BED00','stop-opacity':'1'}),$('stop',{offset:'88%','stop-color':'#FFFF00','stop-opacity':'1'}),$('stop',{offset:'100%','stop-color':'#FF0000','stop-opacity':'1'})])),$('rect',{x:'0',y:'0',width:'100%',height:'100%',fill:'url(#gradient-hsv)'})]);picker=$('svg',{xmlns:'http://www.w3.org/2000/svg',version:'1.1',width:'100%',height:'100%'},[$('defs',{},[$('linearGradient',{id:'gradient-black',x1:'0%',y1:'100%',x2:'0%',y2:'0%'},[$('stop',{offset:'0%','stop-color':'#000000','stop-opacity':'1'}),$('stop',{offset:'100%','stop-color':'#CC9A81','stop-opacity':'0'})]),$('linearGradient',{id:'gradient-white',x1:'0%',y1:'100%',x2:'100%',y2:'100%'},[$('stop',{offset:'0%','stop-color':'#FFFFFF','stop-opacity':'1'}),$('stop',{offset:'100%','stop-color':'#CC9A81','stop-opacity':'0'})])]),$('rect',{x:'0',y:'0',width:'100%',height:'100%',fill:'url(#gradient-white)'}),$('rect',{x:'0',y:'0',width:'100%',height:'100%',fill:'url(#gradient-black)'})])}else if(v=='VML'){slide=['<DIV style="position: relative; width: 100%; height: 100%">','<v:rect style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" stroked="f" filled="t">','<v:fill type="gradient" method="none" angle="0" color="red" color2="red" colors="8519f fuchsia;.25 #8000ff;24903f #0040ff;.5 aqua;41287f #00ff40;.75 #0bed00;57671f yellow"></v:fill>','</v:rect>','</DIV>'].join('');picker=['<DIV style="position: relative; width: 100%; height: 100%">','<v:rect style="position: absolute; left: -1px; top: -1px; width: 101%; height: 101%" stroked="f" filled="t">','<v:fill type="gradient" method="none" angle="270" color="#FFFFFF" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>','</v:rect>','<v:rect style="position: absolute; left: 0px; top: 0px; width: 100%; height: 101%" stroked="f" filled="t">','<v:fill type="gradient" method="none" angle="0" color="#000000" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>','</v:rect>','</DIV>'].join('');if(!t.namespaces['v'])t.namespaces.add('v','urn:schemas-microsoft-com:vml','#default#VML')}function hsv2rgb(a){var R,G,B,X,C;var h=(a.h%360)/60;C=a.v*a.s;X=C*(1-Math.abs(h%2-1));R=G=B=a.v-C;h=~~h;R+=[C,X,0,0,X,C][h];G+=[X,C,C,X,0,0][h];B+=[0,0,X,C,C,X][h];var r=Math.floor(R*255);var g=Math.floor(G*255);var b=Math.floor(B*255);return{r:r,g:g,b:b,hex:"#"+(16777216|b|(g<<8)|(r<<16)).toString(16).slice(1)}}function rgb2hsv(a){var r=a.r;var g=a.g;var b=a.b;if(a.r>1||a.g>1||a.b>1){r/=255;g/=255;b/=255}var H,S,V,C;V=Math.max(r,g,b);C=V-Math.min(r,g,b);H=(C==0?null:V==r?(g-b)/C+(g<b?6:0):V==g?(b-r)/C+2:(r-g)/C+4);H=(H%6)*60;S=C==0?0:C/V;return{h:H,s:S,v:V}}function slideListener(d,e,f){return function(a){a=a||s.event;var b=mousePosition(a);d.h=b.y/e.offsetHeight*360+hueOffset;d.s=d.v=1;var c=hsv2rgb({h:d.h,s:1,v:1});f.style.backgroundColor=c.hex;d.callback&&d.callback(c.hex,{h:d.h-hueOffset,s:d.s,v:d.v},{r:c.r,g:c.g,b:c.b},u,b)}};function pickerListener(d,e){return function(a){a=a||s.event;var b=mousePosition(a),width=e.offsetWidth,height=e.offsetHeight;d.s=b.x/width;d.v=(height-b.y)/height;var c=hsv2rgb(d);d.callback&&d.callback(c.hex,{h:d.h-hueOffset,s:d.s,v:d.v},{r:c.r,g:c.g,b:c.b},b)}};var x=0;function ColorPicker(f,g,h){if(!(this instanceof ColorPicker))return new ColorPicker(f,g,h);this.h=0;this.s=1;this.v=1;if(!h){var i=f;i.innerHTML=w;this.slideElement=i.getElementsByClassName('slide')[0];this.pickerElement=i.getElementsByClassName('picker')[0];var j=i.getElementsByClassName('slide-indicator')[0];var k=i.getElementsByClassName('picker-indicator')[0];ColorPicker.fixIndicators(j,k);this.callback=function(a,b,c,d,e){ColorPicker.positionIndicators(j,k,e,d);g(a,b,c)}}else{this.callback=h;this.pickerElement=g;this.slideElement=f}if(v=='SVG'){var l=slide.cloneNode(true);var m=picker.cloneNode(true);var n=l.getElementById('gradient-hsv');var o=l.getElementsByTagName('rect')[0];n.id='gradient-hsv-'+x;o.setAttribute('fill','url(#'+n.id+')');var p=[m.getElementById('gradient-black'),m.getElementById('gradient-white')];var q=m.getElementsByTagName('rect');p[0].id='gradient-black-'+x;p[1].id='gradient-white-'+x;q[0].setAttribute('fill','url(#'+p[1].id+')');q[1].setAttribute('fill','url(#'+p[0].id+')');this.slideElement.appendChild(l);this.pickerElement.appendChild(m);x++}else{this.slideElement.innerHTML=slide;this.pickerElement.innerHTML=picker}addEventListener(this.slideElement,'click',slideListener(this,this.slideElement,this.pickerElement));addEventListener(this.pickerElement,'click',pickerListener(this,this.pickerElement));enableDragging(this,this.slideElement,slideListener(this,this.slideElement,this.pickerElement));enableDragging(this,this.pickerElement,pickerListener(this,this.pickerElement))};function addEventListener(a,b,c){if(a.attachEvent){a.attachEvent('on'+b,c)}else if(a.addEventListener){a.addEventListener(b,c,false)}}function enableDragging(b,c,d){var e=false;addEventListener(c,'mousedown',function(a){e=true});addEventListener(c,'mouseup',function(a){e=false});addEventListener(c,'mouseout',function(a){e=false});addEventListener(c,'mousemove',function(a){if(e){d(a)}})}ColorPicker.hsv2rgb=function(a){var b=hsv2rgb(a);delete b.hex;return b};ColorPicker.hsv2hex=function(a){return hsv2rgb(a).hex};ColorPicker.rgb2hsv=rgb2hsv;ColorPicker.rgb2hex=function(a){return hsv2rgb(rgb2hsv(a)).hex};ColorPicker.hex2hsv=function(a){return rgb2hsv(ColorPicker.hex2rgb(a))};ColorPicker.hex2rgb=function(a){return{r:parseInt(a.substr(1,2),16),g:parseInt(a.substr(3,2),16),b:parseInt(a.substr(5,2),16)}};function setColor(a,b,d,e){a.h=b.h%360;a.s=b.s;a.v=b.v;var c=hsv2rgb(a);var f={y:(a.h*a.slideElement.offsetHeight)/360,x:0};var g=a.pickerElement.offsetHeight;var h={x:a.s*a.pickerElement.offsetWidth,y:g-a.v*g};a.pickerElement.style.backgroundColor=hsv2rgb({h:a.h,s:1,v:1}).hex;a.callback&&a.callback(e||c.hex,{h:a.h,s:a.s,v:a.v},d||{r:c.r,g:c.g,b:c.b},h,f);return a};ColorPicker.prototype.setHsv=function(a){return setColor(this,a)};ColorPicker.prototype.setRgb=function(a){return setColor(this,rgb2hsv(a),a)};ColorPicker.prototype.setHex=function(a){return setColor(this,ColorPicker.hex2hsv(a),u,a)};ColorPicker.positionIndicators=function(a,b,c,d){if(c){b.style.left='auto';b.style.right='0px';b.style.top='0px';a.style.top=(c.y-a.offsetHeight/2)+'px'}if(d){b.style.top=(d.y-b.offsetHeight/2)+'px';b.style.left=(d.x-b.offsetWidth/2)+'px'}};ColorPicker.fixIndicators=function(a,b){b.style.pointerEvents='none';a.style.pointerEvents='none'};s.ColorPicker=ColorPicker
		})(window,window.document);

 		ColorPicker.fixIndicators(
			document.getElementById('slider-indicator'),
			document.getElementById('picker-indicator'));

		var cpo = ColorPicker(

	       	document.getElementById('slider'),
            document.getElementById('picker'),

	        function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {

                ColorPicker.positionIndicators(
                    document.getElementById('slider-indicator'),
                    document.getElementById('picker-indicator'),
                    sliderCoordinate, pickerCoordinate
                );
	            if (curr) {
	            	curr.value = hex;
	            	curr._data.val = hex;
	            	curr.style.backgroundColor = hex;
	            	setFieldValue(hex, curr._data);
	            }
		});

		var f, sf;
		for (f in COLOR) {
			if (typeof COLOR[f] === "string") {
				addInput({name: f, parent: null, field: f, val: COLOR[f]});

			} else {
				for (sf in COLOR[f]) {
					val = COLOR[f][sf];
					if (f === "tile") {
						val = toCSSHex(val);
					}
					addInput({name: f + "-" + sf, parent: f, field: sf, val: val});
				}
			}
		}

		var tx = document.createElement("textarea");
		tx.setAttribute("id", "tx");
		document.querySelector("#txt").appendChild(tx);


	}
};

