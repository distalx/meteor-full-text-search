Artists = new Mongo.Collection("artists");
Arts = new Mongo.Collection("arts");

if (Meteor.isClient) {


}

if (Meteor.isServer) {
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
