var activeRoute = 'routeHome';

function setActivePage(p)
{
	activeRoute = p;
	$('.page.active').removeClass('active');
	$('#'+p+'.page').addClass('active');

	$('.nav.navbar-nav li.active').removeClass('active');
	$('.nav.navbar-nav li.'+p).addClass('active');
	//$('#'+p+'.page').fadeIn(200);
	
	$('.navbar-toggle:not(.collapsed)').click();

}

function routeTo(hash)
{
	if (hash != 'routeWorkgroup' && hash != 'routeGoal' && hash != 'routePosts' && hash != 'routeWrite' && hash != 'routeHome')
	{
		hash = 'routeHome';
	}
	
	$('#submenu .active').removeClass('active');
	
	if (activeRoute == 'routeHome')
	{
		$('body').removeClass('index');
	} else if (activeRoute == "routePosts")
	{
		// stop getting updates
		fetchUpdatesEnabled = false;
	}



	setActivePage(hash);



	if (hash == 'routeHome')
	{
		$('#submenu').hide();
		$('body').addClass('index');
	}
	else if (hash == 'routeWorkgroup')
	{
		$('#submenu').show();
	}
	else if (hash == 'routeGoal')
	{
		$('#submenu').show();
	}
	else if (hash == 'routePosts')
	{
		$('#submenu').show();

		$('#submenuPost').addClass('active');

		if (loadedMedia.length==0)
		{
			fetchNext();
		}

		if ($dynamicHolder !== undefined)
		{
			$dynamicHolder.masonry("reloadItems");
			$dynamicHolder.masonry();
		}

		fetchUpdatesEnabled = true;

	}
	else if (hash == 'routeWrite')
	{
		$('#submenu').show();
		$('#submenuWrite').addClass('active');
	}
}

function updateRoute()
{
	ga('send', 'pageview', {
	 'page': location.pathname + location.search  + location.hash
	});

	var hash = location.hash.substring(1, location.hash.length);;
				
	console.log('hash: '+hash);

	routeTo(hash);
}