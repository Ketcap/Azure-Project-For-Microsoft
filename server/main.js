import '../imports/api/drive/methods.js'
Meteor.startup(() => {

  ServiceConfiguration.configurations.upsert(
  { service: "google" },
  { $set: { clientId: "741479783069-8a18dgmvj41v4o21n8lucnbpj1hcgte1.apps.googleusercontent.com", secret: "HlFFGgsst_60-LddYSydmN3b","loginStyle" : "popup" } }
);

});
