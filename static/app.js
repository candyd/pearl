$(function(){

	var TweetModel = Backbone.Model.extend();
	var TweetCollection = Backbone.Collection.extend(
    {
        model: TweetModel,
        initialize: function() {

        },
        url: function (){
        	return 'http://search.twitter.com/search.json?q=' + this.query + '&page' + this.page + '&callback=?';
        },
        query: window.location.href.split('=')[1],
        page: 1,
        parse: function(resp, xhr) {
        		return resp.results;
        		}
   
    });

	var TweetController = Backbone.View.extend({
		initialize: function() {
			this.render();
		},
		render: function() {
			this.template = _.template($('#tweet-view-pic').html());
            var dict = this.model.toJSON();
            var markup = this.template(dict);
            this.el.innerHtml = markup;
            return this;
		}

	});

	var AppController = Backbone.View.extend({
		events:{
		"click #search-button": "onsubmit"
		},
		
		onsubmit: function () {
		this.tweets.reset();
		$(this.el).find ('ul li').remove();
		var searchVal =  $("#search-text").val();
		this.tweets.query = searchVal;
		this.loadTweets(); 
		},
		
	
	
		initialize: function () {
			
			this.tweets = new TweetCollection();
			this._tweetsView = [];

		
			//set event handlers
			_.bindAll(this, 'onTweetAdd');
			this.tweets.bind('add', this.onTweetAdd);
			/* this.loadTweets(); */
		},

		loadTweets: function () {
			var that = this;
			this.isLoading = true;
			this.tweets.fetch({
				add: that.onTweetAdd,
				success: function (tweets){
					that.isLoading = false;
					}
				});
				
		},

		onTweetAdd: function(model) {
			
			var tweetView = new TweetController({
				model: model
			});

			this._tweetsView.push(tweetView);
			$(this.el).find('ul').append(tweetView.render().el.innerHtml);
		}
	});


	var app = new AppController({
		el: $('.twitter-feed')
	});
});