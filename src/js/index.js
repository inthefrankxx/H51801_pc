require(["config"], function(){
	require(["loadHF","jquery","template","un","cookie","fly"], function(promise, $, template){
		//轮播图
		$(document).ready(function(e) {
		    var unslider04 = $('#b04').unslider({
		        dots: true
		    }),
		    data04 = unslider04.data('unslider');
		     
		    $('.unslider-arrow04').click(function() {
		        var fn = this.className.split(' ')[1];
		        data04[fn]();
		    });
		});
		$(document).ready(function(){
			$(".locator").click(function(){
				$(".content").show();
			});
			$(".content").hover(function(){
				$(".content").show();
			},function(){
				$(".content").hide();
			});
		});
		$.getJSON("/mock/products.json",function(data){
			// 使用 artTemplate 渲染
			let html = template("prod_temp", {products : data.res_body.products});
			// 显示
			$(".list").prepend(html);
		});
		$(".qrcode-close").click(function(){
			$(".qrcode-sw").css({"display":"none"});
		});

			// 使用事件委派
	$(".list").delegate(".join-basket", "click", function(e){
		// 阻止默认行为：默认超级链接点击跳转
		e.preventDefault();
		// 将当前选购商品信息获取到
		let prod = {
			pid : $(this).prev().find(".id").text(),
			title : $(this).prev().find("p").text(),
			price : $(this).prev().find(".btn5").text(),
			img : $(this).prev().find("img").attr("src"),
			amount : 1
		};
		// 配置 cookie 插件，自动在JS值与JSON字符串之间转换
		$.cookie.json = true;
		// 获取 cookie 中已保存的 购物车
		let products = $.cookie("products") || [];
		// 判断原购物车中是否已存在选购商品
		let index = exist(prod.pid, products);
		if (index === -1) // 不存在
			// 将当前选购商品添加到数组中保存
			products.push(prod);
		else // 存在
			// 修改数量
			products[index].amount++;
		// 将购物车再保存回 cookie 中
		$.cookie("products", products, {expires:7, path:"/"});
		let _text = Number($("#ShopCartNum").text());
			_text++;
		$("#ShopCartNum").text(_text);
		//加载购物车成功，抛物线
		let end = $(".view").offset(),
			flyer = $(`<img src="${prod.img}" style="z-index:99999; width:100px; height:100px;">`);
		flyer.fly({
			start : {
				left : e.pageX - $(window).scrollLeft(),
				top : e.pageY - $(window).scrollTop()
			},
			end : {
				left : end.left - $(window).scrollLeft(),
				top : end.top - $(window).scrollTop(),
				width: 20,
				height: 20
			}
		});
	});
	// 找出 id 对应商品在 prodcuts 中下标
	function exist(id, products) {
		var existIndex = -1;
		$.each(products, function(index, prod){
			if(prod.pid == id) {
				existIndex = index;
				return false;
			}
		});
		return existIndex;
	}
});
});