var MoorGrit = new Class({
	/*
	urls have optional parameters 

	onTemplateLoadet:function(){}
	*/
	Implements: [Options, Events],
	initialize:function(options){
		this.templates = {};
		this.views = {};
		this.data = {};
		this.args = {};
	},
	registerTemplate:function(id, template, url){
		if(!(id in this.templates)){
			template.moorgie = this;
			template.url = url;
			template.id = id;
			this.templates[id] = template;
		}
		return this;
	},
	registerView:function(id, view, url){
		if(!(id in this.views)){
			view.moorgie = this;
			view.url = url;
			view.id = id;
			this.views[id] = view;
		}
		return this;
	},
	loadView:function(id, target, args){
		var view = this.views[id];
		view.target = target;
		view.beforeRender();
		this._getJSONData(view, args, function(data){
			view.render(data);
		});
	},
	loadTemplate:function(id, target, args){
		var template = this.templates[id];
		template.target = target;
		template.beforeRender();
		this._getTemplate(template, target, args, function(loadetTarget){
			template.render(loadetTarget);
		});
	},
	updateView:function(id, args){
		var view = this.views[id];
		this._deleteViewCache(id);
		this.loadView(id, view.target, args);
	},
	updateTemplate:function(id, args){
		var template = this.template[id];
		this._deleteTemplateCache(id);
		this.loadView(id, template.target, args);
	},
	_deleteViewCache:function(id){
		delete this.views[id].cached_data;
	},
	_deleteTemplateCache:function(id){
		delete this.templates[id].cached_data;
	},
	_getTemplate:function(template, target, args, callback){
		if(this.data[template.id] === undefined || this._compareArgs(this.args[template.id], args)){
			var completeUrl = this._setArgs(template.url, args);
			var self = this;
			target.set('load',{
				onComplete:function(){
					self.templates.cached_data = target;
					template.curent_args = args;
					callback(target);
					self.fireEvent("templateComplete");
					
				}
			});
			target.load(completeUrl);
		}else{
			return template.cached_data;
		}
	},
	_getJSONData:function(view, args, callback, queryString){
		console.log("GET JSON DATA " + view.id);
		if(this.data[view.id] === undefined || this._compareArgs(this.args[view.id], args)){
			var completeUrl = this._setArgs(view.url, args);
			var self = this;
			new Request.JSON({
				url:completeUrl,
				onSuccess:function(response){
						Object.each(response.data,function(viewdata, key){
							self.data[key] = viewdata;
							self.args[view.id] = args[view.id];
						});
						callback(response.data[view.id]);
						self.fireEvent('viewGetDataSuccess');
				},
				onComplete:function(response){
						console.log("complete");
						self.fireEvent('viewGetDataComplete');
				},
				onError:function(){
					console.log("error");
						callback({"status":"server error"});
						self.fireEvent('viewGetDataError');
				}
			}).get();
		}else{
			console.log("Returning cached data");
			callback(this.data[view.id]);
		}
	},
	_setArgs:function(url, args){
		keys = url.match(/\$(.*?)\$/g);
		if(keys !== null){
			if(keys.length !== args.length){
				console.log("wrong number of a");
				return null;
			}
			keys.each(function(key){
				url = url.replace(key, args[key.substring(1,key.length-1)]);
			});
		}
		return url;
	},
	_compareArgs:function(a,b,strict){
		/*
			---
			description: Extends the Object type with a public compare method.

			license: MIT-style license

			authors:
			- Xunnamius

			requires:
			- core/1.3.0.1

			provides: [Object.compare]
			...
		*/
		var self = this;
		if(!a || !b || Object.getLength(a) != Object.getLength(b)) return false;
		return Object.every(a, function(value, key){ return typeof(value) == 'object' ? self._compareArgs(value, b[key], strict) : (strict ? b[key] === value : b[key] == value); }, this);
	}
});