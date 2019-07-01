define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/validate/validate',
    'app/module/loading/loading'
    // 'app/module/foot/foot'
], function(base, Ajax, Validate, loading) {
    var returnUrl;

    init();

    function init() {
        // Foot.addFoot(3);
        addListeners();
        returnUrl = base.getReturnParam();

    }

    function addListeners() {
        $.validator.setDefaults({
            errorPlacement: function(error, element) {
                error
                    .css({
                        position: "absolute",
                        "white-space": "nowrap",
                        color: "#f55555",
                        "font-size": "12px",
                        display: "block",
                        top: "5px",
                        right: "10px"
                    })
                    .insertAfter(element);
            }
        });
        
        $("#loginForm").validate({
            'rules': {
                mobile: {
                    required: true,
//                  mobile: true
                },
                password: {
                    required: true,
                    maxlength: 16,
                    minlength: 6,
                    isNotFace: true
                }
            },
            onkeyup: false
        });

        $("#loginBtn").on('click', loginAction);
    }

    function loginAction() {
        if ($("#loginForm").valid()) {
            // $("#loginBtn").attr("disabled", "disabled").val("登录中...");
            loading.createLoading("登录中...");
            var param = {
                "loginName": $("#mobile").val(),
                "loginPwd": $("#password").val(),
                "kind": "f2"
            };

            Ajax.post("805043", { json: param })
                .then(function(res) {
                    // console.log(res);
                    loading.hideLoading();
                    if (res.success) {
                        base.setSessionUser(res);
                        console.log(res)
                        base.goBackUrl("../index.html");
                    } else {
                        base.clearSessionUser();
                        // $("#loginBtn").removeAttr("disabled").val("登录");
                        base.showMsg(res.msg);
                    }
                }, function() {
                    loading.hideLoading();
                    base.clearSessionUser();
                    // $("#loginBtn").removeAttr("disabled").val("登录");
                    base.showMsg("登录失败");
                });
        }
    }
});