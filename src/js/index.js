require(["config"], function(){
	require(["loadHF","jquery","template"], function(promise, $, template){
		promise.then(function(data){
			$("header").html(data.header);
			$("footer").html(data.footer);
		});
	});
});