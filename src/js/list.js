require(["config"],function(){
	require(["loadHF","jquery","template","cookie"], function(promise,$,template){
	$(".dj").click(function(){
		$.getJSON("/mock/products.json",function(data){
			console.log(data)
			// 使用 artTemplate 渲染
			let html = template("prod_temp", {products : data.res_body.products});
			console.log(html);
			// 显示
			$(".goods").html(html);
		});
	});
			// 使用事件委派
	$(".goods").delegate(".join-basket", "click", function(e){
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
		console.log(img);
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

		var _text = Number($("#ShopCartNum").text());
			_text++;
		$("#ShopCartNum").text(_text);
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