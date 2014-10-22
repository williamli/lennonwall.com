var api = '//umbrellarevolution.happenings.io/api/fetch';
var limit = 60;
var pulseLimit = 60;
var paging = 0;
var latest = 0;
var threshold = 200;


var updateTimer;
var updateInterval = 60;
var timeToUpdate = updateInterval;

var searchTerm = "";

var $dynamicHolder;

var options = {
	autoResize : true, // This will auto-update the layout when the browser window is resized.
	container : $('#post'), // Optional, used for some extra CSS styling
	offset : 10, // Optional, the distance between grid items
	itemWidth : 210, // Optional, the width of a grid item
	fillEmptySpace : false // Optional, fill the bottom of each column with widths of flexible height
};

var loadedMedia = [];

$( document ).ready(function() {

	//setUpdateInterval();

	$dynamicHolder = $('#dynamicHolder').masonry({
		columnWidth: 0,
		itemSelector: '.post',
		isAnimated: !Modernizr.csstransitions
	})

	$('.fancybox').fancybox({
        padding : 0,
        openEffect  : 'elastic',
        helpers: {
    		title : {
        		type : 'inside'
    		}
    	}	
    });

	//fetchNext();
	startTimer();

	$dynamicHolder = $('#tiles');

	

});


function moreHandler()
{
	fetchNext();
}

function setUpdateInterval()
{
	//console.log($('#updateSlider').val());

	// updateInterval = $('#updateSlider').val();
	// timeToUpdate = updateInterval;
	// pulseLimit = updateInterval;
}

function startTimer()
{
	if (isSearch)
		return;

	if (updateInterval == 0)
		return;
	
	updateTimer = setInterval(function () {
		if (updateInterval == 0)
		{
			return;
		}
		

		timeToUpdate--;

		//$('#updateIndicator .time').html(timeToUpdate);

		if (timeToUpdate == 0)
		{
			timeToUpdate = updateInterval;
			fetchUpdates();
		}
		
	}, 1000);
}

function fetchUpdates()
{
	//var endpoint = api + '/updates/' + latest;
	var endpoint = api + '/pulse/' + latest + '/' + pulseLimit + '/1';
	

	$.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: endpoint,
        dataType: "json",
        beforeSend: function(jqXHR, settings)
        {
         	console.log('fetching data from endpoint: '+ endpoint);
         	clearInterval(updateTimer);
            showLoader();
        },
        success: function(data)
        {
            hideLoader();
            
            //console.log(data);
            var postCount = data.length;
            console.log('postCount: '+postCount);

            $.each(data, function(index, value) {
				addPost(value, true);
				if (latest < value.id)
				{
					latest = value.id;
				}
			});
			startTimer();

        },
        error: function(xhr, ajaxOptions, thrownError)
        {
            //console.log(xhr.responseText);
            hideLoader();	
            startTimer();	            
        }
    });
}

function fetchNext()
{
	var endpoint = api + '/post/' + limit + '/' + paging + '/1';
	

	$.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: endpoint,
        dataType: "json",
        beforeSend: function(jqXHR, settings)
        {
         	console.log('fetching data from endpoint: '+ endpoint);
            showLoader();
            hideMore();   
        },
        success: function(data)
        {
            hideLoader();
            
            //console.log(data);
            var postCount = data.length;
            console.log('postCount: '+postCount);

            if (postCount < limit) {
            	// no more post
            	console.log('server returned '+postCount+' results when asked for '+limit+'...');
            	console.log('there is no more results.');
            	hideMore();
            }
            else
            {
            	console.log('there might be more posts...');
            	showMore();
            }

            $.each(data, function(index, value) {
				addPost(value);
				paging = value.id;
				if (latest < value.id)
				{
					latest = value.id;
				}
			});

        },
        error: function(xhr, ajaxOptions, thrownError)
        {
            //console.log(xhr.responseText);
            hideLoader();

            //hideMore();
            
        }
    });
}

var isSearch = false;
function doSearch()
{
	isSearch = true;
	searchTerm = $('#searchInput').val();
	$('#updateIndicator').fadeTo(100,0);
	clearPosts();
	search(searchTerm);
}

function clearSearch()
{
	isSearch = false;
	$('#searchInput').val('');
	searchTerm = $('#searchInput').val();
	$('#searchIndicatorBar .query').html(searchTerm);
	$('#searchIndicatorBar').hide();
	$('#updateIndicator').fadeTo(100,1);
	clearPosts();
	fetchNext();
	startTimer();
}

function clearPosts()
{

	clearInterval(updateTimer);
	timeToUpdate = updateInterval;
	paging = 0;
	latest = 0;
	loadedMedia = [];

	$dynamicHolder.html('');
	$dynamicHolder.masonry("reloadItems");
	$dynamicHolder.masonry();

	hideLoader();

    hideMore();
	
}



function search(s)
{
	var endpoint = api + '/search/'+ s + '/' + limit + '/' + paging + '/1';
	
	$('#searchTerm').val(searchTerm);
	$('#searchIndicatorBar .query').html(searchTerm);
	$('#searchIndicatorBar').show();

	$.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: endpoint,
        dataType: "json",
        beforeSend: function(jqXHR, settings)
        {
         	console.log('fetching data from endpoint: '+ endpoint);
            showLoader();
            hideMore();   
        },
        success: function(data)
        {
            hideLoader();
            
            //console.log(data);
            var postCount = data.length;
            console.log('postCount: '+postCount);

            if (postCount < limit) {
            	// no more post
            	console.log('server returned '+postCount+' results when asked for '+limit+'...');
            	console.log('there is no more results.');
            	hideMore();
            }
            else
            {
            	console.log('there might be more posts...');
            	paging++;
            	showMore();
            }

            $.each(data, function(index, value) {
				addPost(value);
				
			});

        },
        error: function(xhr, ajaxOptions, thrownError)
        {
            //console.log(xhr.responseText);
            hideLoader();

            //hideMore();
            
        }
    });
}

function addPost(data, prepend) {
	if (prepend === undefined) prepend = false;
	//console.log(data);
	var html = "";

	// do not add duplicates
	if (loadedMedia.indexOf(data.media_id) != -1)
		return;

	if (data.posted_time == null)
	{
		// use created_at
		var date = moment(data.created_at+"+0800");
	}
	else
	{
		var date = moment.unix(data.posted_time);	
	}

	if (data.media == 'instagram')
	{
		var message = data.message;
		var url = data.post_url;
		var image_src = data.photo_standard_url;
		var username = data.username;
		var id = 'post_'+data.id;
		var media_id = data.media_id;


		html = html + '<div class="datetime"><img class="calendar" src="/assets/lennon/img/calendar@2x.png" alt="calendar"/><a target="_blank" href="'+url+'">'+date.format('MMM Do, YYYY HH:mm:ss')+'</a></div>';
		html = html + '<div class="photo"><a class="fancybox" href="'+image_src+'" rel="gallery" title="'+removeTags(message)+'"><img src="'+image_src+'"/></a></div>';
		html = html + '<div class="content">'+message+'</div>';



		html = html + '<div class="title-bar"><div class="name"><a target"_blank" href="https://instagram.com/'+username+'">@'+username+'</a></div><div class="medium"><a target="_blank" href="'+url+'"><img src="/assets/lennon/img/instagram_badge_alt@2x.png" alt="instagram" width="15"/></a></div></div>';
		

		html = '<div class="col-xs-6 col-sm-4 col-md-3 post" data-media="'+media_id+'" id="'+id+'"><div class="frame instagram" onclick="toggleSelected()">'+html+'</div></div>';

		// html = '<div class="post-content"><img src="'+image_src+'"/><p class="text-left">'+message+'<div class="username">@'+username+'</div></p></div><img class="social-icon" src="assets/lennon/img/icons/ig.png"/>';


		// html = '<li><div onclick="viewPost(\''+id+'\')">'+html+'</div></li>';
	}


	if (data.media == 'twitter')
	{
		var message = data.message;
		var url = data.post_url;
		var image_src = data.photo_standard_url;
		var username = data.username;
		var id = 'post_'+data.id;
		var media_id = data.media_id;

		// ignore retweets
		if (removeTags(message).substr(0, 3) == 'RT ')
			return;

		html = html + '<div class="datetime"><img class="calendar" src="/assets/lennon/img/calendar@2x.png" alt="calendar"/><a target="_blank" href="'+url+'">'+date.format('MMM Do, YYYY HH:mm:ss')+'</a></div>';
		
		html = html + '<div class="content">'+message+'</div>';



		html = html + '<div class="title-bar"><div class="name"><a target="_blank" href="https://twitter.com/'+username+'">@'+username+'</a></div><div class="medium"><a target="_blank" href="'+url+'"><img src="/assets/lennon/img/twitter_badge_alt@2x.png" alt="twitter" width="15"/></a></div></div>';

		html = '<div class="col-xs-6 col-sm-4 col-md-3 post" id="'+id+'" data-media="'+media_id+'"><div class="frame twitter" onclick="toggleSelected(this)">'+html+'</div></div>';

		// html = '<div class="post-content text-left">'+message+'<div class="username">@'+username+'</div></div><img class="social-icon" src="assets/lennon/img/icons/fb.png"/>';


		// html = '<li><div onclick="viewPost(\''+id+'\')">'+html+'</div></li>';
	}

	
	loadedMedia.push(data.media_id);


	if (!prepend)
	{
		$dynamicHolder.append(html);

	} else
	{
		// if prepend photo above threshold, remove one from bottom

		$dynamicHolder.prepend(html);				

		var posts = $('#dynamicHolder .post');
		if (posts.length > threshold)
		{
			console.log('threshold '+threshold+' reached, reallocating memory by releasing older post...');

			var post = posts[posts.length-1];
			paging = parseInt((posts[posts.length-2].id).replace("post_", ""));
			loadedMedia.splice(loadedMedia.indexOf($("#"+post.id).data('media')),1);
			
			$("#"+post.id).remove();

			
		}	
	}

	$('#post_'+data.id).imagesLoaded(function() {
		$dynamicHolder.masonry("reloadItems");
			$dynamicHolder.masonry();
	});

}

function toggleSelected(v)
{
	if ($(v).hasClass('selected'))
	{
		$(v).removeClass('selected');
	}
	else
	{
		$(v).addClass('selected');	
	}
	
}

function showLoader() {
	$('#routePosts .loader').show();
}

function hideLoader() {
	$('#routePosts .loader').hide();
}

function showMore() {
	$('#moreBar').show();
}

function hideMore() {
	$('#moreBar').hide();
}

function removeTags(s){
    
    var rex = /(<([^>]+)>)/ig;
    return s.replace(rex , "");

}


function addslashes(str) {
  return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0');
}