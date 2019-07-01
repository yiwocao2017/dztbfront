define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/util/dict'
], function(base, Ajax, loading, Dict) {

    var code = base.getUrlParam("code");
    var orderStatus = Dict.get("orderStatus");

    init();

    function init() {
        if(!code){
            base.showMsg("未传入订单编号");
            return;
        }
        loading.createLoading();
        getOrder();
    }
    function getOrder(){
        Ajax.get("620221", {
            code: code
        }).then(function(res){
            loading.hideLoading();
	            if(res.success){
	                var data = res.data;
	                $("#code").html(data.code);
	                $("#applyName").html(data.applyName);
	                $("#applyMobile").html(data.applyMobile);
	                $("#address").html(getAddress(data));
                $("#ltDatetime").html(base.formatDate(data.ltDatetime, "yyyy-MM-dd"));
                $("#applyNote").html(data.applyNote || "无");
                $("#createDatetime").html(base.formatDate(data.createDatetime, "yyyy-MM-dd hh:mm"));
                $("#status").html(orderStatus[data.status]);
                $(".ltBtn").attr('data-ltuser',data.ltUser);
                if(data.ltUserDO){
                    $("#ltMobileWrap, #ltRealNameWrap").removeClass("hidden");
                    $("#ltRealName").html(data.ltUserDO.realName);
                    $("#ltMobile").html(data.ltUserDO.mobile).attr("href","tel://"+data.ltUserDO.mobile);
                }
            }else{
                base.showMsg(res.msg);
            }
        }, function(){
            loading.hideLoading();
            base.showMsg("订单信息加载失败");
        });
    }
    function getAddress(addr){
        if(addr.ltProvince == addr.ltCity){
            addr.ltProvince = "";
        }
        return addr.ltProvince + addr.ltCity + addr.ltArea + addr.ltAddress;
    }


    function isbtn(){
        if (status == 1) {
            $('.ltBtn').html('<input type="button" value="确认量体" class="but wp100 fs16" id="ltSub">');

            $('.ltBtn').on('click',function(){
                location.href = "liangTiConfirm.html?code="+ code +"&ltUser="+$(this).attr("data-ltuser");
            })

        }
    }

});