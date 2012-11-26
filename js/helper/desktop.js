define(['helper/app','libs/text!template/desktop.tpl'],function(App,templ){

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(templ),
		didInsertElement: function(){
			//this.get('controller').appendESPN();
		}
	});

	App.DesktopController = Em.Controller.extend({
		appendESPN: function(){
			var header = '\x3cscript src="http://www.espnstar.com/generated_files/pub_module/script/s776.js">\x3c/script>\x3cscript>at_attach("sample_attach_menu_parent", "sample_attach_menu_child", "click", "y", "pointer");$("#global_search_button").click(search);$("#global_search_input").keypress(function(e){if(e.which == 13){search();}});function search(){window.location.href="/search-results/?s="+escape($("#global_search_input")[0].value);}if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var ieversion=new Number(RegExp.$1);if(ieversion < 7){$("li").each(function(){$(this).hover(function(){$(this).addClass("sfhover");},function(){$(this).removeClass("sfhover");})});}}\x3c/script>';
			$('body').append(header);

			var footer = '\x3cscript language="JavaScript" type="text/javascript"><!--var thisPageName ="";var game = "";if(thisPageName==""){section = ":default";gameType = ":super-selector";}else{section = ":"+thisPageName;gameType = ":"+game;}s_omni.pageName="games"+gameType+section;s_omni.server="";s_omni.channel="games";s_omni.pageType="";s_omni.prop1="www.espnstar.com";s_omni.prop2="";s_omni.prop3="";s_omni.prop4="game";s_omni.prop5=gameType;s_omni.prop25="football";s_omni.prop30="n";s_omni.hier1=s_omni.pageName;s_omni.campaign="";s_omni.state="";s_omni.zip="";s_omni.events="";s_omni.products="";s_omni.purchaseID="";s_omni.eVar1="";s_omni.eVar2="";s_omni.eVar3="";s_omni.eVar4="";s_omni.eVar5="";var s_code=s_omni.t();if(s_code)document.write(s_code);//-->\x3c/script>\x3cscript language="JavaScript" type="text/javascript"><!--if(navigator.appVersion.indexOf("MSIE")>=0)document.write(unescape("%3C")+"\!-"+"-");//-->\x3c/script>\x3cscript>var _comscore = _comscore || [];_comscore.push({ c1: "2", c2: "3000005" });(function() {var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";el.parentNode.insertBefore(s, el);})();\x3c/script>\x3cscript type="text/javascript">(function(){var em = document.createElement("script"); em.type = "text/javascript"; em.async = true;em.src = ("https:" == document.location.protocol ? "https://sg-ssl" : "http://sg-cdn") + ".effectivemeasure.net/em.js";var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(em, s);})();\x3c/script>\x3cscript type="text/javascript">_uacct = "UA-4432811-1";urchinTracker();\x3c/script>';
			$('body').append(footer);
			console.log('loaded');
		}
	});

});