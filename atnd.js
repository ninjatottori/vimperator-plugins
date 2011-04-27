/*
 * atnd.js
 * http://atnd.org/
 * API Reffernce : http://api.atnd.org/
 *
 */


commands.addUserCommand(['atnd','atend'],	'atnd.org', 
	function(args){

		Atnd.get_events(args);

	},
	{
		options : [],
	},
	true
);

let Atnd = { //{{{

	base_url : "http://api.atnd.org/",
	get_events : function(args){ //{{{

		let keyword = args.join(",");
		if(!keyword) return;
		let count = (liberator.globalVariables.atnd_get_count) ? liberator.globalVariables.atnd_get_count : 10 ;

		let req = new libly.Request(
			this.base_url + "events/?keyword=" + keyword + "&format=json&count=" + count , //url
			null, //headers
			{ // options
				asynchronous:true,
			}
		);

		req.addEventListener("onSuccess",function(data){
			let res = libly.$U.evalJson(data.responseText);
			if(res.results_returned == 0){
				liberator.echo("keyword: " + keyword + " was no result");
				return;
			}

			let res_events = res.events.filter(isEnded,new Date())
			let html,div = "";
			html = <style type="text/css"><![CDATA[
					div.head{font:medium Arial;font-weight:bold;text-decoration:underline;color:#EA1F00;padding-left:0.3em;padding-bottom:0.3em;}
					div.result{padding:0.3em 2em;}
					.result a{color:#7fff00;}
					.result a:hover{color:#ff1493;}
				]]></style> + 
				<div class="head" >
					{res_events.length + "/" + res.results_available + " events matched(include ended events)"}
				</div>;
			for (let i = 0 ; i < res_events.length ; i++) {
				let r = res_events[i]
				div += <div class="result">
						<a href={r.event_url} >
							{r.title} 
							{" - " + r.started_at} 
						</a>
							{" - " + r.catch} 
							{" - " + r.address} 
					</div>;
			};
			liberator.echo(html + div)

			function isEnded(elements,index,array){
				return ((this - new Date(elements.started_at)) < 0)
			}
		});

		req.addEventListener("onFailure",function(data){
			liberator.echoerr(data.statusText);
		});
		
		req.get();
	
	}, //}}}


} // }}}









// for debug
function e(v,c){ // {{{
	if(c) util.copyToClipboard(v);
	liberator.log(v,-1)
} // }}}

