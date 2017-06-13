import './index.html';
OneDriveAuth = require('onedrive-auth');


Template.homepage.onRendered(function(){
})

Template.homepage.events({
	'click a.google':function(){
		Meteor.loginWithGoogle(
			{
				requestPermissions:['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.appdata','https://www.googleapis.com/auth/drive.apps.readonly','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/drive.metadata','https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive.photos.readonly','https://www.googleapis.com/auth/drive.readonly']
			},
			function(error){
				console.log(error);
		})
	}
})
