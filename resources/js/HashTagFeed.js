var owner = undefined;
function HashTagFeed() {
	this.intervalID = undefined;
	this.hashTag = undefined;
	owner = this;
}

HashTagFeed.prototype.start = function(hashtag, interval) {
	this.hashTag = hashtag;
	this.updateTweets();
	this.intervalID = setInterval(this.updateTweets, interval);
	console.log('IntervalID', this.intervalID);
}

HashTagFeed.prototype.stop = function(hashtag, interval) {
	clearInterval(this.intervalID);
}

HashTagFeed.prototype.updateTweets = function(hashtag) {
	$.getJSON('http://search.twitter.com/search.json?q=' + encodeURIComponent(owner.hashTag) + '&rpp=3&include_entities=true&with_twitter_user_id=false&result_type=recent&callback=?',
		function(data){
			owner.updateView(data);
		}
	);
}

HashTagFeed.prototype.updateView = function(data) {
	$('#tw').empty(); // Clear the children
	
	// add the children
	for(var i=0;i<data.results.length;i++) {		
	    var tweeter = data.results[i].from_user;
	    var tweetText = data.results[i].text;
	    var tweetText = tweetText.substring(0, 139);
	    
	    tweetText = tweetText.replace(/http:\/\/\S+/g, '<a href="$&" target="_blank">$&</a>');
	    tweetText = tweetText.replace(/(@)(\w+)/g, ' $1<a href="http://twitter.com/$2" target="_blank">$2</a>');
	    tweetText = tweetText.replace(/(#)(\w+)/g, ' $1<a href="http://search.twitter.com/search?q=%23$2" target="_blank">$2</a>');
	    
	    $('#tw').append('<li class="tweet"><div class="tweetImage"><a href="http://twitter.com/' + tweeter + '" target="_blank"><img src="' + data.results[i].profile_image_url + '" width="48" border="0" /></a></div><div class="tweetBody">@' + data.results[i].from_user.toLowerCase() + ': ' + tweetText + '</div></li>');
	}
}