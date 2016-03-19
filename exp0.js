Artists = new Mongo.Collection("artists");
Arts = new Mongo.Collection("arts");

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



}//client

if (Meteor.isServer) {

  Meteor.publish("artistSearch", function(query) {
    check(query, String);

    if (_.isEmpty(query))
      return this.ready();

    return Artists.search(query);
  });

        //result =  Artists.find({$or: [ { name:term }, { username:term},{ $elemMatch: { profile: term } } ]}).fetch();

  Meteor.startup(function () {

    if (Artists.find().fetch().length === 0) {
      console.log("Dummy Data is being added");

      for (var i = 0; i < 20; i++) {
        var artist = Fake.user({
          fields: ['name', 'username', 'emails.address', 'profile.name'],
        });
        Artists.insert(artist);
      }

    }//Artists

    if (Arts.find().fetch().length === 0) {
      for (var i = 0; i < 20; i++) {
        Arts.insert({title:Fake.word()});
      }
    }//Arts

  });//startup function

}
