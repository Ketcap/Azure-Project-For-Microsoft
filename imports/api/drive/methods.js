var Future = Npm.require('fibers/future');

new ValidatedMethod({
  name: 'drive.me.folders',
  validate(){},
  run() {
		let answer = new Future();
		const access = Meteor.user().services.google.accessToken;
		HTTP.get("https://www.googleapis.com/drive/v2/files?corpus=DOMAIN&/root",{
			headers: {
	      Authorization: "Bearer " + access,
	    },
			params:{
				"orderBy":"folder",
				"spaces":"drive"
			}
		},function(err,resp){
			console.log(err);
			answer.return(resp.data)
		})

    return answer.wait();
  }
});

new ValidatedMethod({
  name: 'drive.me.folders.children',
  validate(){},
  run(folderId) {
		let answer = new Future();
		const access = Meteor.user().services.google.accessToken;
		HTTP.get("https://www.googleapis.com/drive/v2/files/"+folderId+"/children",{
			headers: {
	      Authorization: "Bearer " + access,
	    },
			params:{
				q:"mimeType contains 'image/'"
			}
		},function(err,resp){
			answer.return(resp.data)
		})
    return answer.wait();
  }
});

new ValidatedMethod({
  name: 'drive.me.folder.get.faces',
  validate(){},
  run(folderId) {
		let answer = new Future();
		const access = Meteor.settings.private.azure_key;
		let photos = Meteor.call('drive.me.folders.children',folderId);
		photos = photos.items.map((e)=>{ return "https://drive.google.com/uc?id="+e.id});
		let faceIds = [];
		let photosLength = photos.length;
		photos.forEach(function(item,index){
			HTTP.post('https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true',{
				headers:{
					"Ocp-Apim-Subscription-Key": access,
					"Content-Type":"application/json"
				},
				data:{
						"url":item
				}
			},function(err,resp){
				resp.data.map((e)=>{
					faceIds.push({face:e.faceId,url:item});
				});
				--photosLength;
				if(photosLength <= 0){
					answer.return(faceIds);
				};

			});
		});
    return answer.wait();
  }
});

new ValidatedMethod({
  name: 'azure.get.faceid',
  validate(){},
  run(url) {
		let answer = new Future();
		const access = Meteor.settings.private.azure_key;
		HTTP.post('https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true',{
			headers:{
				"Ocp-Apim-Subscription-Key": access,
				"Content-Type":"application/json"
			},
			data:{
					"url":url
			}
		},function(err,resp){

			answer.return(resp.data[0].faceId);
		});
    return answer.wait();
  }
});

new ValidatedMethod({
  name: 'azure.get.similiars',
  validate(){},
  run(obj) {
		let answer = new Future();
		const access = Meteor.settings.private.azure_key;
		const faces = obj.facelist.map((item)=>{return item.face});
		HTTP.post('https://westus.api.cognitive.microsoft.com/face/v1.0/findsimilars',{
			headers:{
				"Ocp-Apim-Subscription-Key": access,
				"Content-Type":"application/json"
			},
			data:{
				"mode":"matchFace",
				"faceId":obj.face,
				"faceIds":faces
			}
		},function(err,resp){
			let response = [];
			resp.data.map((payload)=>{
				// payload.faceId , payload.confidence
				if(payload.confidence > 0.50){
					console.log('confidence is above 50');
					const index = obj.facelist.findIndex((item)=>{
						return item.face == payload.faceId;
					});
				 	response.push(obj.facelist[index]);
				}
			})
			return answer.return(response);
		});
    return answer.wait();
  }
});
