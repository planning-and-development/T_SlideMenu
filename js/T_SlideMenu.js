 /*-------------------------------------
 *スライドメニューのクラス
 *要jquery
 *@menu: スライドで出てくる要素のjQueryオブジェクト
 *@btn: フリックする要素のjQueryオブジェクト
 *@end: スライド終了位
 *@type: メニューが出てくる方向 (true:横方向,false:縦方向)
 * ------------------------------------*/

$(function(){

	var SWIPE_OFFSET = 5;
	var SLIDE_OFFSET = 150;
	T_SlideMenu = function(){
		this.animations = new Array;
		this.isTouch = false;
		this.pre_pos;
		this.isShow = false;
	}

	T_SlideMenu.prototype.addAnimation = function(menu,btn,end,type){
		var id = this.animations.length+1;
		var anime = new T_Animation(menu,btn,end,type,id);
		this.animations.push(anime);
		btn.on("touchstart",this,function(e){
			event.preventDefault();
			var own = e.data;
			own.isTouch = true;
			if(own.isShow){
				menu.removeClass("menu_"+anime.name_show);
				btn.removeClass("btn_"+anime.name_show);
				menu.css(anime.oriental,anime.end_menu+"px");
				btn.css(anime.oriental,anime.end_btn+"px");
			}else{
				menu.removeClass("menu_"+anime.name_hide);
				btn.removeClass("btn_"+anime.name_hide);
				menu.css(anime.oriental,anime.org_pos_menu+"px");
				btn.css(anime.oriental,anime.org_pos_btn+"px");
			}
			if(anime.type){
				own.pre_pos = event.touches[0].pageX;
			}else{
				own.pre_pos = event.touches[0].pageY;
			}
		})
		.on("touchmove",this,function(e){
			event.preventDefault();
			var own = e.data;
			if(!own.isTouch) return;
			var pos;
			var now_pos_menu;
			var now_pos_btn;
			var now_pos_dif;
			var dif;
			if(anime.type){
				pos = event.touches[0].pageX;
				now_pos_menu = menu[0].offsetLeft;
				now_pos_btn = btn[0].offsetLeft;
			}else{
				pos = event.touches[0].pageY;
				now_pos_menu = menu[0].offsetTop;
				now_pos_btn = btn[0].offsetTop;
			}
			dif = own.pre_pos - pos;
			menu.css(anime.oriental,(now_pos_menu-dif)+"px");
			btn.css(anime.oriental,(now_pos_btn-dif)+"px");
			own.pre_pos = pos;
			if(dif > SWIPE_OFFSET){
				if(anime.which){
					own.swipe_hide = true;
				}else{
					own.swipe_show = true;
				}
				return;
			}
			if(-1*dif > SWIPE_OFFSET){
				if(anime.which){
					own.swipe_show = true;
					own.swipe_hide = false;
				}else{
					own.swipe_hide = true;
					own.swipe_show = false;
				}
				return;
			}
			if(Math.abs(now_pos_menu - anime.end_menu)<SLIDE_OFFSET){
				own.swipe_show = true;
				own.swipe_hide = false;
				return;
			}else if(Math.abs(now_pos_menu - anime.org_pos_menu)<SLIDE_OFFSET){
				own.swipe_hide = true;
				own.swipe_show = false;
				return;
			}
			own.swipe_show = false;
			own.swipe_hide = false;
		})
		.on("touchend",this,function(e){
			var own = e.data;
			own.isTouch = false;
			if(own.swipe_show){
				anime.show();
				own.isShow = true;
				return;
			}
			if(own.swipe_hide){
				anime.hide();
				own.isShow = false;
				return;
			}
			if(own.isShow){
				anime.show();
			}else{
				anime.hide();
			}
		});
		return anime;
	}
	T_SlideMenu.prototype.getAnimation = function(id){
		return this.animations[id-1];
	}
 
	
 /*-------------------------------------
 *スライドアニメーションのクラス
 *要jquery
 * *@start: スライド開始位 (false: 現在位置から)
 *@end: スライド終了位
 *@type: メニューが出てくる方向 (true:横方向,false:縦方向)
 *@id: アニメーションのID
 * ------------------------------------*/
	T_Animation = function(menu,btn,end,type,id){
			var name_show = "t_show_"+id;
			var name_hide = "t_hide_"+id;
			var oriental,org_pos_menu,org_pos_btn;
			if(type){
				oriental = "left";
				org_pos_menu = menu[0].offsetLeft;
				org_pos_btn = btn[0].offsetLeft;
			}else{
				oriental = "top";
				org_pos_menu = menu[0].offsetTop;
				org_pos_btn = btn[0].offsetTop;
			}
			var dif_btn_menu = org_pos_menu-org_pos_btn;
			var end_menu = end;
			var end_btn = end - dif_btn_menu;;
			var body = "";
			body += "0% {}";
			body += "100% { "+oriental+": "+end_menu+" }";
		  var css = "@-webkit-keyframes menu_"+name_show+" { "+body+"}\n";
		  css += "@keyframes menu_"+name_show+" { "+body+" }\n";
			css += ".menu_"+name_show+" { -webkit-animation-name: menu_"+name_show+";animarion-name: menu_"+name_show+";}\n";
			body = "";
			body += "0% {}";
			body += "100% { "+oriental+": "+end_btn+" }";
		  css += "@-webkit-keyframes btn_"+name_show+" { "+body+"}\n";
		  css += "@keyframes btn_"+name_show+" { "+body+" }\n";
			css += ".btn_"+name_show+" { -webkit-animation-name: btn_"+name_show+";animarion-name: btn_"+name_show+";}\n";
			body = "";
			body += "0% {}";
			body += "100% {"+oriental+":"+org_pos_menu+"}";
		  css += "@-webkit-keyframes menu_"+name_hide+" { "+body+"}\n";
		  css += "@keyframes menu_"+name_hide+" { "+body+" }\n";
			css += ".menu_"+name_hide+" { -webkit-animation-name: menu_"+name_hide+";animarion-name: menu_"+name_hide+";}\n";
			body = "";
			body += "0% {}";
			body += "100% {"+oriental+":"+org_pos_btn+"}";
		  css += "@-webkit-keyframes btn_"+name_hide+" { "+body+"}\n";
		  css += "@keyframes btn_"+name_hide+" { "+body+" }\n";
			css += ".btn_"+name_hide+" { -webkit-animation-name: btn_"+name_hide+";animarion-name: btn_"+name_hide+";}\n";
			this.name_show = name_show;
			this.name_hide = name_hide;
			this.oriental = oriental;
			this.end_menu = end_menu;
			this.end_btn = end_btn;
			this.css = css;
			this.org_pos_menu = org_pos_menu;
			this.org_pos_btn = org_pos_btn;
			this.which = org_pos_menu < end_menu;
			this.type = type;
			this.menu = menu;
			this.btn = btn;
			$("head").append("<style>"+this.css+"</style>");
			css = {"-webkit-animation-duration":" 0.2s","-webkit-animation-delay": "0s","-webkit-animation-iteration-count": "1","-webkit-animation-fill-mode":"forwards","-moz-animation-duration": "0.2s","-moz-animation-delay": "0s","-moz-animation-iteration-count": "1",	"-moz-animation-fill-mode":"forwards"};
			menu.css(css);
			btn.css(css);
  }

	T_Animation.prototype.show = function(){
		this.menu.removeClass("menu_"+this.name_hide);
		this.btn.removeClass("btn_"+this.name_hide);
		this.menu.addClass("menu_"+this.name_show);
		this.btn.addClass("btn_"+this.name_show);
		if(this.type){
			this.menu.css("width",(window.innerWidth-this.end_menu)+"px");
		}else{
			this.menu.css("height",(window.innerHeight-this.end_menu)+"px");
		}
	}
	T_Animation.prototype.hide = function(){
		this.menu.removeClass("menu_"+this.name_show);
		this.btn.removeClass("btn_"+this.name_show);
		this.menu.addClass("menu_"+this.name_hide);
		this.btn.addClass("btn_"+this.name_hide);
	}
});
