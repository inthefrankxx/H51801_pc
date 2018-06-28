require(["config"],function(){
	require(["loadHF", "jquery","zoom"], function(promise,$){
		$(".zoom").elevateZoom({
			gallery:'gallery_01', 
			cursor: 'pointer', 
			galleryActiveClass: "active"
		});
	});
});