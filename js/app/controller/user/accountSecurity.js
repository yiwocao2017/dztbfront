define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

	if(!base.getUserId()){
		location.href="user/login.html"
	}
	var userId = base.getUserId();
	var userName;//用户名
	var token;
	var mobile


	Ajax.get("805056",{"userId":userId})
		.then(function(res) {
            if (res.success) {
            	token = res.data.token;
                userName = res.data.realName;
                mobile = res.data.mobile;
                idNo = res.data.idNo;

                $("#realName").html(userName);
                $("#mobile").html(mobile);
                $("#idNo").html(idNo);
        }
	});

    $("#bank").on("click",function(){
        Ajax.get("802016",{"userId":userId})
        .then(function(res) {
            if (res.success) {
                if(res.data.length){
                    location.href = "./bankcard.html";
                }else{
                     // location.href = "./bankcard.html";
                    location.href = "./add_bankcard.html";
                }
            }
        })
    })

    $("#charge-code").on("click",function(){
      location.href="../account/chargeCode.html";
  })

    $("#logOut").on("click",function(){
        base.logout();
        location.href="login.html";
    })


})