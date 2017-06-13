import './index.html';

Template.dashboard.onCreated(function(){
	self = this;
	self.folders = new ReactiveVar(null);
	let breadcrumb = [{
		name:"Root",
		id:"root"
	}]
	self.breadcrumb = new ReactiveVar(breadcrumb);
	self.page = new ReactiveVar('root');
	self.faceArray = new ReactiveVar();
	self.similiarFaces = new ReactiveVar();
	Meteor.call('drive.me.folders',function(err,resp){
		self.folders.set(resp);
	})

});



Template.dashboard.helpers({
	folders(){
		return Template.instance().folders.get();
	},
	breadcrumb(){
		return Template.instance().breadcrumb.get();
	},
	page(){
		return Template.instance().page.get();
	},
	similiarFaces(){
		return Template.instance().similiarFaces.get();
	}

})

Template.dashboard.events({
	'submit form#firstForm':function(event,Template){
		event.preventDefault();
		const folderId = $('input[name="folders"]:checked').attr('id');
		Meteor.call('drive.me.folder.get.faces',folderId,function(err,resp){
			if(!err){
				self.page.set('photo');
				self.faceArray.set(resp);
			}
		})
	},
	'submit form#lastForm':function(event,Template){
		event.preventDefault();
		const faceUrl = event.target.image_link.value;
		const faces = self.faceArray.get();
		if(!faces){
			Materialize.toast("İşlemleriniz sürüyor birazdan tekrar deneyin",2500,'red darken-2')
			return false;
		}
		Meteor.call('azure.get.faceid',faceUrl,function(err,resp){
			if(!err){
				Meteor.call('azure.get.similiars',{face:resp,facelist:faces},function(err,resp){
					self.similiarFaces.set(resp);
					self.page.set('finish');
				})
			}
		})

	},
	'click a[href="#children"]':function(event,Template){
		event.preventDefault();
		self.folders.set(null)
		const folderId = this.id;
		const folderName = this.title;
		let breadcrumb = self.breadcrumb.get();

		if(folderId == 'root'){
			Meteor.call('drive.me.folders',function(err,resp){
				self.folders.set(resp);
				breadcrumb.length = 1;
			})
		}else{
			Meteor.call('drive.me.folders.children',folderId,function(err,resp){
				self.folders.set(resp);
				const index = breadcrumb.findIndex(x => x.title == folderName);

				if(index == -1){
					breadcrumb.push({'name':folderName,"id":folderId});
				}else{
					breadcrumb.length = index + 1;
				}

			})
		}

	}

});

Template.dashboard.onRendered(()=>{
})
