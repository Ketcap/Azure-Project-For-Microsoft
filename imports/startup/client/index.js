// Layouts
import '/imports/ui/layout/layout-full';
// Components
import '/imports/ui/components/navbar';
import '/imports/ui/components/footer';
// Pages
import '/imports/ui/pages/homepage';
import '/imports/ui/pages/dashboard';

// Inside Client
import './router.js';

Template.registerHelper('equals',(arg1,arg2)=>{
	return arg1 == arg2;
});

Template.registerHelper('photo',(arg1)=>{
	return ["JPG","PNG"].indexOf(arg1);
})

Template.registerHelper('contentPhoto',(arg1)=>{
	return "https://drive.google.com/uc?id="+arg1;
})
