define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	if(!base.getUserId()){
		location.href="user/login.html"
	}

	var userId = base.getUserId();


	var codeTimeNum=60;

	Ajax.get("805056",{"userId":userId})
		.then(function(res) {
            if (res.success) {
                $(".revise-Tel").attr("tel",res.data.mobile)

            } else {
                base.showMsg(res.msg);
          }
        })

//交易密码提交

	$("#reviseSub").on("click",function(){
		var newCode = $(".newTelCode").val();
		var tradePwd = $(".tradePwd").val();
		var tradePwdStrength = base.calculateSecurityLevel(tradePwd);

		if(tradePwd==null || newTelCode==""){
			base.showMsg("请输入交易密码");
		}else if(newCode==null || newCode==""){
			base.showMsg("请输入手机验证码");
		}else if(newCode.length!=4){
			base.showMsg("手机验证码不正确");
		}
		else {
			var parem={
				"userId": userId,
			    "smsCaptcha": newCode,
			    "tradePwdStrength":tradePwdStrength,
			    "tradePwd":tradePwd
				}

			Ajax.post("805045",{json:parem})
				.then(function(res) {
	                if (res.success) {
	                	if(res.data.isSuccess){
											location.href="withdraw.html"
	                	}
	                } else {
	                	base.showMsg("验证失败");
	                }
	            }, function() {
	                base.showMsg("验证失败");
	            });

		}
	});



// 获取验证码
$("#newTelCode").on("click",function(){
		var tradePwd = $(".revise-Tel").val();
		var tel = $(".revise-Tel").attr("tel");
		if(tradePwd==null || tradePwd=="" ){
				base.showMsg("请输入交易密码");
			}else{

				if(codeTimeNum==60){

					timer = setInterval(function(){
						codeTimeNum--;

						$("#newTelCode").css({"color":"#999","text-align":"center"})
						$("#newTelCode").html(""+codeTimeNum+"s");

						if(codeTimeNum<0){
							clearInterval(timer);
							codeTimeNum=60;
							$("#newTelCode").css({"color":"#595959"});
							$("#newTelCode").html("获取验证码");
						}
					},1000);

					var parem={
						"mobile":tel,
						"bizType":"805045",
	          "kind": "f2"
					}

					Ajax.post("805904",{json:parem})
						.then(function(res) {
			                if (res.success) {
			                } else {
			                }
			            }, function() {
			                base.showMsg("验证失败");
			            });
				}
			}
	})

});