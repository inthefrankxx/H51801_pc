require(["config"],function(){
	require(["loadHF", "jquery"],function(promise,$){
		promise.then(function{
			$("header").html(data.header);
			$("footer").html(data.footer);
		});
	});
});