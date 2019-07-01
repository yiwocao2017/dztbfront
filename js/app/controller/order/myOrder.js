define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading',
    'app/module/scroll/scroll'
], function(base, Ajax, loading, scroll) {

	if(!base.getUserId()){
		location.href="user/login.html"
	}

	var userId = base.getUserId();
  var param = {userId: userId,ltUser:userId,start:1,limit: 100}, isEnd = false;
  var code;

  getOrderInfo();
  initIScroll();

  $("#allOrder").on('click', function(){
    isEnd = false;
    base.showPullUp();
  $(this).addClass("choose").siblings().removeClass("choose")
  $("#content").empty();
    param.status = "";
      getOrderInfo(param,true);
  });
  $("#stayLt").on('click', function(){
    isEnd = false;
    base.showPullUp();
  $(this).addClass("choose").siblings().removeClass("choose")
    param.status = "1";
      getOrderInfo(param,true);
  });
  $("#stayEntry").on('click', function(){
    isEnd = false;
    base.showPullUp();
  $(this).addClass("choose").siblings().removeClass("choose");
    param.status = "3";
      getOrderInfo(param,true);
  });
  $("#stayReview").on('click', function(){
    isEnd = false;
    base.showPullUp();
  $(this).addClass("choose").siblings().removeClass("choose");
    param.status = "4";
      getOrderInfo(param,true);
  });

  $("#content").on('click','.contenBtnW .btn-l', function(){

    location.href = "orderDetail.html?code="+$(this).attr("code");
  });

 $("#content").on('click',".detail ",function(){

    location.href = "orderDetail.html?code="+$(this).attr("code");
  });

  $("#content").on('click','.contenBtnW .btn-2', function(){

    location.href = "liangTiConfirm.html?code="+$(this).attr("code")+"&ltUser="+$(this).attr("ltUser");
  });

  $("#content").on('click','.contenBtnW .btn-3', function(){

    location.href = "ltEntryInfo.html?code="+$(this).attr("code");
  });

  $("#content").on('click','.contenBtnW .btn-4', function(){

    var code = $(this).attr("code");
    var time = $(this).attr("updateDatetime")
    var updater = $(this).attr("updater");

    base.confirm("确认提交订单").then(function(){
      Ajax.get("620206",{"orderCode":code,"updater":updater,"updateDatetime":time})
        .then(function(res) {
                if (res.success) {
                   location.href="myOrder.html"
                }else{
                  base.showMsg(res.msg);
                }
        })

    },function(){})

  });



    function getOrderInfo(refresh){
      if(isEnd) {
        myScroll.refresh();
        return;
      }
      param.start = refresh && 1 || param.start;
      $.when(
       Ajax.get("620220", param, !refresh ),
            base.getDictList1("807706","order_status")
      ).then(function(res, res1){
            loading.hideLoading();
            if (res.success && res1.success) {

              var dictData = res1.data;
              if (res.data.list.length) {
                var html = "";
                var item = res.data.list;
                var code = item.code;
                if(res.data.list.length < param.limit){
                  isEnd = true;
                  base.hidePullUp();
                }else{
                  param.start++;
                }
                for (var i = 0; i < res.data.list.length; i++) {
                  item = res.data.list[i]
                  html += '<div class=" wp100 p-r mb50 ">'+
                  '<div class="  wp100 p-r bg_fff border-b pb10 detail"code="'+item.code+'">'+
                              '<div class=" ba lh100  plr15  p-r pt10"><img src="/static/images/订单号@2x.png" class="img-order"><p class="co9 inline_block  p-a ml20 fs13">订单号：' + item.code + '</p><span class="p-a font fs12">' + base.getDictListValue(item.status,dictData) + '</span></div>'+
                              '<div class="ba lh100  plr15  p-r mt10"><img src="/static/images/图层-6@2x.png" class="img-order"><p class="co9 inline_block  p-a ml20 fs13">客户姓名：' + item.applyName + '</p></div>'+
                              '<div class="ba lh100  plr15  p-r mt10"><img src="/static/images/电话@2x.png" class="img-order"><p class="co9 inline_block  p-a ml20 fs13">联系电话：' + item.applyMobile + '</p></div>'+
                              '<div class="ba lh100  plr15  p-r mt10"><img src="/static/images/地址@2x.png" class="img-order p-a"><p class="co9 inline_block  p-r ml35 fs13">地址：' + item.ltProvince + item.ltCity + item.ltArea + item.ltAddress +'</p></div>'+
                              '<div class="ba lh100  plr15  p-r mt10 pb12"><img src="/static/images/时间@2x.png" class="img-order"><p class="co9 inline_block  p-a ml20 fs13">预约时间：' + base.formatDate(item.ltDatetime,"yyyy-MM-dd") + '</p></div>'+
                            '</div>'+
                            '<div class="hig300  wp100 p-r bg_fff border-b contenBtnW fr pb10">';
                  if (item.status == 1 ) {
                    html +='<div class="inline_block p-r btn-vaild btn-order btn-l fs13 pr10 fr mr90" code="'+item.code+'">查看</div><div class="inline_block p-a pr10  btn-vaild btn-order btn-2 fs13 pl14 " code="'+item.code+'"ltUser="' +item.ltUser+'" >确认量体</div>';
                  }else if(item.status == 3){
                    html +='<div class="inline_block p-r btn-vaild btn-order btn-l fs13 pr10 fr mr180" code="'+item.code+'">查看</div><div class="inline_block p-a pr10  btn-vaild btn-order btn-3  fs13 pl14  mr90" code="'+item.code+'" >数据录入</div><div class="inline_block p-a pr10  btn-vaild btn-order btn-4  fs13 pl14 "code="'+item.code+'"updater="' +item.updater+'" updateDatetime="'+item.updateDatetime+'">提交复核</div>';
                  }else {
                    html +='<div class="inline_block p-r btn-vaild btn-order btn-l fs13 pr10 fr" code="'+item.code+'">查看</div>';
                  }

                  html += '</div></div>';
                  $("#content").html(html);
                  // console.log(item.status)
                }
              }else{
                $("#content").empty().html('<div class="wp100 p-r bg_fff border-b ptb10 tc fs15">暂无订单</div>');
                base.hidePullUp();
                // base.showMsg("暂无订单");
              }
             myScroll.refresh();
            }else{
                base.showMsg(res.msg);
              }

          })
    }

    function initIScroll() {
        myScroll = scroll.getInstance().getNormalScroll(
        {
            loadMore: function() {
                getOrderInfo();
            },
            refresh: function() {
                isEnd = false;
                getOrderInfo(true);
            }
        }
        );
    }




})
