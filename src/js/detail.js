require(["config"],function(){
	require(["loadHF", "jquery","zoom"], function(promise,$){
		$("img").elevateZoom();
	});
});