function setLang(lang)
{
	if (lang === undefined)
	{
		// try to load from cookie
		lang = $.cookie('lang');
		if (lang === undefined)
			lang = 'zh';
	}

	$.cookie('lang', lang);

	if (lang == 'zh')
	{
		$('.lang_en').removeClass('active');
		$('.lang_zh').addClass('active');
	}
	else
	{
		$('.lang_zh').removeClass('active');
		$('.lang_en').addClass('active');
	}
}

function toggleLang()
{
	var lang = $.cookie('lang');

	if (lang == 'en')
	{
		setLang('zh');
	}
	else
	{
		setLang('en');
	}

}

function initialize() {
	
	
	
}

			/*function positionFooter() {
				var window_height = $(window).height();
				
				var main_height = parseInt($(".main").css("height").replace("px", ""));
				var footer_height = parseInt($(".footer").css("height").replace("px", ""));
				
				var actionbar_height = parseInt($(".actionbar").css("height").replace("px", ""));
				
				
				
				var actionbar_padding = window_height  - footer_height -  main_height - actionbar_height;
				if(actionbar_padding > 0){
				$(".actionbar").css({
						marginTop : actionbar_padding 
					});
				
				}
				else
				{
					$(".actionbar").css({
						marginTop : 84
					});
					
				}
			}*/
				
				
			

			
			//$(window).load(positionFooter);
			// $('.btn-advance').click(function(){
			// 	$(this).blur();
			// 	$(this).parent(".text-center").toggleClass('dropup');
   //             $('html,body').animate({
			// 		scrollTop: $(".btn-advance").offset().top
			// 		}, 800);
                 
			// });
		