define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

	if(!base.getUserId()){
		location.href="user/login.html"
	}

	var userId = base.getUserId();

	$("#rQ-balance").on('click', function(){
		location.href = "bill.html"
	});

	$("#sbtn").on("click",function(){
		base.getUser().then(function(res){
			if(res.success){
				if(res.data.tradepwdFlag == 1){

					location.href = "./withdraw.html";
				}else{
					//没有设置过交易密码，跳转设置交易密码页
					location.href = "./chargeCode.html";
				}
			}else{
				base.showMsg(res.msg)
			}
		})

	});

//	$.when(
//		Ajax.get("802503",{"userId":userId}),
//		Ajax.get("618053",{"ownerId":userId})
//	).then(function(res1,res2){
//		if (res1.success && res2.success) {

		Ajax.get("802503",{
			"userId":userId
		}).then(function(res1){
			if (res1.success) {

	        	res1.data.forEach(function(v,i){
	        		if(v.currency == "CNY"){
	        			var amount1 = v.amount ;//可结算余额+冻结金额 = 账户金额
	//			    	var amount2 = res2.data + res1.data[0].frozenAmount;//总
	//			        amount1 = amount1/1000;
	//			        amount2 = amount2/1000;
	//			        var amount3 = amount2 - amount1;//已结算=总-可结算余额
	//
	//					if(amount3 == 0){
	//						amount3=0;
	//					}else{
	//						amount3 = amount3.toFixed(2);
	//					}

	//			        $(".rQ-incomeNum").html(amount2);//总
				        $("#rQ-balanceNum").html("￥"+base.formatMoney(amount1));//可结算余额
	//			        $("#rQ-setNum").html(amount3);//已结算
	        		}
	        	})

	        } else {
	            base.showMsg(res1.msg);
	        }

		})

});
