function hideActivePage()
{
	//$('.page.active').hide();
	$('.page.active').removeClass('active');
}

function setActivePage(p)
{
	hideActivePage();
	$('#'+p+'.page').addClass('active');
	//$('#'+p+'.page').fadeIn(200);
}

function routeTo(hash)
{
	if (hash != 'workgroup' && hash != 'goal' && hash != 'posts' && hash != 'write' && hash != 'home')
	{
		hash = 'home';
	}

	setActivePage(hash);
	

	if (hash == 'home')
	{
		$('#submenu').hide();
	}
	else if (hash == 'workgroup')
	{
		$('#submenu').show();
	}
	else if (hash == 'goal')
	{
		$('#submenu').show();
	}
	else if (hash == 'posts')
	{
		$('#submenu').show();
	}
	else if (hash == 'write')
	{
		$('#submenu').show();
	}

}

function updateRoute()
{
	var hash = location.hash.substring(1, location.hash.length);;
				
	console.log('hash: '+hash);

	routeTo(hash);
}