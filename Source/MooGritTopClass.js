var MooGritTopClass = new Class({
	/*
	urls have optional parameters 

	onTemplateLoadet:function(){}
	*/
	Implements: [Options, Events],
	initialize:function(options){
		this.subTemplateIds = [];
		this.subViewIds = [];
	},
	beforeRender:function(){

    },
	render:function(data){
		/*	called when data is finished fetching
			it is your own responsibility to make the right data go to the right sub elements
			the sub elements ca have their own urls, so that they can updated independantly,
			you can trigger an update by calling

			this.updateView(id, target, args)
		*/
	},
	registerSubView:function(id){
		if(!(id in this.subViewIds)){
			subViewIds.push(id);
		}
	},
	registerSubTemplate:function(id){
		if(!(id in this.subTemplateIds)){
			subTemplateIds.push(id);
		}
	},
	updateSubTemplate:function(id, target, args){
		this.moorgie.updateTemplate(id, target, args);
	},
	updateSubView:function(id, target, args){
		this.moorgie.updateView(id, target, args)
	}
});