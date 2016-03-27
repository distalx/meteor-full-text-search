Artists = new Mongo.Collection("artists");

RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};


Artists.search = function(query) {
  return Artists.find({
    name: { $regex: RegExp.escape(query), $options: 'i' }
  }, {
    limit: 20
  });
};


if (Meteor.isClient) {


Tracker.autorun(function() {
  if (Session.get('artistSearchQuery'))
    Meteor.subscribe('artistSearch', Session.get('artistSearchQuery'));
});


Template.search.helpers({
  searchResults: function() {
  return Artists.search(Session.get('artistSearchQuery'));
  },
  booksSearchQuery: function() {
    return Session.get('artistSearchQuery');
  }

});

Template.search.events({
  "keyup #foo": function(event, template){
    event.preventDefault();
    //console.log(template.find(".searchTerm").value);
    var term = template.find(".searchTerm").value;
     Session.set('artistSearchQuery', term);
  }
});


Template.artistInfo.helpers({
  artist:function(){
    var artistId = FlowRouter.current().params.id;
    return Artists.find({"_id":artistId});

  }

});




}//client

if (Meteor.isServer) {

  Meteor.publish("artistSearch", function(term) {
    check(term, String);

    if (_.isEmpty(term))
      return this.ready();

    return Artists.search(term);
  });

        //result =  Artists.find({$or: [ { name:term }, { username:term},{ $elemMatch: { profile: term } } ]}).fetch();

  Meteor.startup(function () {

    if (Artists.find().fetch().length === 0) {
      console.log("Dummy Data is being added");

      for (var i = 0; i < 20; i++) {
        var artist = Fake.user({
          fields: ['name', 'username', 'emails.address', 'profile.name'],
        });
        artist.location = fake.fromArray(['Spain', 'France', 'Germany', 'Amsterdam', 'Jordaan','Venice','Italy']);
        Artists.insert(artist);
      }

    }//Artists


  });//startup function
}


/////////
//routes
////////

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("layout", {content: "home"});
  }
});

FlowRouter.route('/artist/:id', {
  action: function(params) {
    BlazeLayout.render("layout", {content: "artistInfo"});
  }
});
