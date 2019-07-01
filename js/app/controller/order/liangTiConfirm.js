define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	if(!base.getUserId()){
		location.href="user/login.html"
	}
	var order = base.getUrlParam("code");
	var ltUser = base.getUrlParam("ltUser");
	var param = {};
	var code;



	Ajax.get("620007")
		.then(function(res) {
            if (res.success){
            	$("#price0").html(res.data[0].price/1000).closest(".param").attr({"data-price":res.data[0].price,"data-code":res.data[0].code});
            	$("#price1").html(res.data[1].price/1000).closest(".param").attr({"data-price":res.data[1].price,"data-code":res.data[1].code});
            } else {
                base.showMsg(res.msg);
            }
        })



		$("#confirm_btn").on("click", ".param", function(e) {
            var self = $(this), index = self.index();
            param["price"] = self.attr("data-price");
            param["code"] = self.attr("data-code");
            self.find("img").attr("src", '/static/images/选中蓝.png')
            	.end().siblings(".param").find("img").attr("src", '/static/images/未选中.png');

        });


		$("#confirmSub").on('click', function(){
			code=$('#firstCode').attr("data-code");

			Ajax.get("620203",{orderCode:order,modelCode:param["code"]?param["code"] :code,quantity:1,updater:ltUser})
				.then(function(res) {
		            if (res.success){

		            	location.href = "myOrder.html";
		            } else {
		                base.showMsg(res.msg);
		            }
		        })

			});

});