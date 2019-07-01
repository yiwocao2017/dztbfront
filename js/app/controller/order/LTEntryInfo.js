define([
    'app/controller/base', 'app/util/ajax', 'app/module/loading/loading', 'js/app/module/validate/validate'
], function(base, Ajax, loading, Validate) {
    var ids = [
        "1-1",
        "1-3",
        "1-4",
        "1-5",
        "1-6",
        "1-7",
        "1-8",
        "1-9",
        "1-10",
        "1-11",
        "2-19",
        "3-5",
        "3-6",
        "3-7",
        "3-8",
        '4-1',
        "4-2",
        "4-3",
        "4-4",
        "4-5",
        "5-2",
        "5-3",
        "5-4",
        '4-6',
        '4-7',
        '4-8'
    ];
    var ids1 = [
        {
            id: "1-2-1",
            type: "80支棉"
        }, {
            id: "1-2-2",
            type: "100支棉"
        }, {
            id: "1-2-3",
            type: "棉真丝"
        }, {
            id: "1-2-4",
            type: "棉弹力"
        }
    ];
    var code = base.getUrlParam("code");
    var modelCode,
        productSpecsList;
    var param = {};
    var allData = {};
    var flag = 0; 
    init();
    function init() {
        getInitData().then(getInfo);
    }
    // 根据订单code获取信息
    function getInitData() {
        return Ajax.get("620221", {code: code}).then(function(res) {
            if (res.success) {
                var data = res.data;
                if (data.productList && data.productList.length) {
                    modelCode = data.productList[0].modelCode;
                    if (data.productList[0].productSpecsList && data.productList[0].productSpecsList.length) {
                        productSpecsList = data.productList[0].productSpecsList;
                    }
                } else {
                    base.showMsg("参数列表获取失败");
                }
            } else {
                base.showMsg(res.msg);
            }
        });
    }
    // 根据getInitData返回的数据的modelCode获取参数列表
    function getInfo() {
        Ajax.get("620057", {modelCode: modelCode}).then(function(res) {
            if (res.success) {
                getData(res.data);
            } else {
                base.showMsg(res.msg);
            }
        });
        addListeners();
    }
    // 生成初始化页面
    function getData(arr) {
        for (var i = 0; i < arr.length; i++) {
            var parentCode = arr[i].parentCode;
            if (parentCode == "1-2") {
                parentCode = arr[i].type;
            }
            if (!allData[parentCode]) {
                allData[parentCode] = [];
            }

            allData[parentCode].push(arr[i]);
        }
        createPage1();
        caretePage2();
        // 如果已经录入，则显示录入的数据
        if (productSpecsList) {
            initData();
        }
    }
    // 如果已经录入过数据，则显示录入的数据
    function initData() {
        $.each(productSpecsList, function(index, spec) {
            if (spec.parentCode == "1-2") {
                $("#modal-chose").find(".header-item[data-name=" + spec.type + "]").click().end().find(".entry-img-item[data-code=" + spec.code + "]").click();
            } else if (spec.name) {
                $("#" + spec.parentCode).find(".param[data-code=" + spec.code + "]").click();
            } else {
                $("#" + spec.parentCode).val(spec.code);
            }
        });
        productSpecsList.forEach(function(v, i) {
            if (v.parentCode == "5-1") {
                flag = 1;
            }
        });
        if(flag){
            $("#form-tab4 .styleChose").removeClass("hidden")
        }else{
            $("#form-tab4 .styleChose").addClass("hidden").find(".active").removeClass("active");
            $("#5-1").val("");
            $("#5-5").find("[data-code='004']").click();
        }
    }
    // 创建5个tab页的初始化内容
    function createPage1() {
        for (var i = 0; i < ids.length; i++) {
            createHtml(ids[i]);
        }
    }
    // 创建modal的初始化内容
    function caretePage2() {
        for (var i = 0; i < ids1.length; i++) {
            createModelHtml(ids1[i]);
        }
    }
    // 生成modal的html
    function createModelHtml(option) {
        var data = allData[option.type];
        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += '<div data-code="' + data[i].code + '" data-name="' + data[i].name + '" data-type="' + data[i].type + '" class="entry-img-item">' + '<div class="entry-img-wrap">' + '<img src="' + base.getImg1(data[i].pic) + '"/>' +'<div class = "cover"></div>' + '</div>' + data[i].name + '</div>';
        }
        $("#" + option.id).html(html);
    }
    // 生成5个tab页的html
    function createHtml(id) {
        var data = allData[id];
        if (data) {
            if (data[0].pic) {
                createImgHtmls(id, data);
            } else if(id == "1-8"){
                if (data[0].code > data[1].code) {
                    var temp = data[0];
                    data[0] = data[1];
                    data[1] = temp;
                }
                createCheckHtml(id, data);
            }else{
                createCheckHtml(id, data);
            }
        }
    }
    // 生成5个tab页的图片html
    function createImgHtmls(id, data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var cls = "entry-img-item param";
            var cls0 = "cover"
            if (i == 0) {
                cls += " active ";
                cls0 += " show"
                param[id] = data[i].code;
            }
            html += '<div class="' + cls + '" data-code="' + data[i].code + '">' + '<div class="entry-img-wrap">' + '<img src="' + base.getImg1(data[i].pic) + '"/>'+'<div class = "'+ cls0 +'"></div>' + '</div>' + data[i].name + '</div>';

        }
        $("#" + id).html(html);
    }
    // 生成5个tab页的checkbox的html
    function createCheckHtml(id, data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var cls = "entry-check-item param";
            if (i == 0) {
                cls += " active";
                param[id] = data[i].code;
            }
            html += '<div class="' + cls + '" data-code="' + data[i].code + '">' + data[i].name + '</div>';
        }
        $("#" + id).html(html);
    }
    function addListeners() {
        // 页面参数按钮点击
        $("#entry-content").on("click", ".param", function(e) {
            var self = $(this);
            self.addClass("active").find(".entry-img-wrap .cover").addClass("show")
                .parents(".param").siblings(".active").removeClass("active")
                .find(".entry-img-wrap .cover").removeClass("show");
            self.addClass("active").siblings(".active").removeClass("active");
               
            id = self.closest(".am-flexbox").attr("id");
            param[id] = self.attr("data-code");
            versionChose();
            embroideryChose()
        });
        // 点击选择面料按钮，弹出面料选择框
       $("#choseML").click(function(e) {
           $("#modal-chose").addClass("active");
           e.stopPropagation();
           var self = $(this);
           self.addClass("active").siblings("div").removeClass("active");
           $("#entry-ml-main-cont")
                .find(".entry-ml-main-cont" + 0).addClass("active")
                .siblings(".active").removeClass("active");
       });
       // 面料tab切换
       $("#modal-chose").on("click", ".header-item", function(e) {
           e.stopPropagation();
           var self = $(this);
           var v_idx = self.index();
           self.addClass("active").siblings(".active").removeClass("active");
           $("#entry-ml-main-cont")
                .find(".entry-ml-main-cont" + v_idx).addClass("active").siblings(".active").removeClass("active");
       });
       // 面料选择
       $("#modal-chose").on("click", ".entry-img-item", function(e) {
           e.stopPropagation();
           var self = $(this);
           var code = self.attr('data-code');
           var name = self.attr('data-name');
           var type = self.attr('data-type');

           $("#modal-chose").find(".entry-img-item.active").removeClass("active").find(".entry-img-wrap .cover").removeClass("show");;
           self.addClass("active").find(".entry-img-wrap .cover").addClass("show");
                

           $("#select_fab_img").attr("src", self.find("img").attr("src"));
           $("#selected_fab_info_title").html(name);
           $("#selected_fab_info_type").html(type);

           $(".modalbg,.more-condition,.modal-chose").removeClass("open");
           $("#1-2").attr("data-code", code).attr("data-name", name);
       });
       // 点击背景隐藏面料弹出框
       $("#modal-chose").click(function() {
           $("#modal-chose").removeClass("active");
       });

       $("#goNextStep1").on("click", function() {
            if (validatePage1()) {
                goPage(1);
                // versionChose();
            }
        });
        $("#goNextStep2").on("click", function() {
            if (validatePage2()) {
                goPage(2);
            }
        });
        $("#goPrevStep0").on("click", function() {
            goPage(0);
        });
        $("#goNextStep3").on("click", function() {
            if (validatePage3()) {
                goPage(3);
            }
        });
        $("#goPrevStep1").on("click", function() {
            goPage(1);
        });
        $("#goNextStep4").on("click", function() {
            if (validatePage4()) {
                goPage(4);
            }
        });
        $("#goPrevStep2").on("click", function() {
            goPage(2);
        });
        $("#goPrevStep3").on("click", function() {
            goPage(3);
        });
        $("#save").on("click", function() {
            if (validatePage5()) {
                var data = {};
                var data2 = $('#form-tab2').serializeObject();
                var data3 = $('#form-tab3').serializeObject();
                var data4 = $('#form-tab4').serializeObject();
                var data5 = $('#form-tab5').serializeObject();

                param = $.extend(param, data2, data3, data4, data5);
                data['orderCode'] = code;
                data['map'] = param;
                data['updaterId'] = base.getUserId();
                data['updater'] = base.getUserId();
                saveData(data);
            }
        });
        $("#createSize").on("click",function () {
            versionChose()
            if (validatePage2()) {
                return false;
            }
        });
        function changeListener(obj){
           var value = $(obj.dom).val();               
           obj.dom? value:$(obj.dom).val("");
           obj.dom0? $(obj.dom0).val(value) : $(obj.dom0).val("");
           obj.dom1 && value ? $(obj.dom1).val(Number(value*0.1)+Number(value)) : $(obj.dom1).val("");
           obj.dom2 && value ? $(obj.dom2).val(Number(value)-2):$(obj.dom2).val("");
           obj.dom3 && value ? $(obj.dom3).val(Number(value)+9):$(obj.dom3).val("");
           obj.dom4 && value ? $(obj.dom4).val(Number(value)+6):$(obj.dom4).val("");
           obj.dom5 && value ? $(obj.dom5).val(Number(value*0.08)+Number(value)):$(obj.dom5).val("");
           obj.dom6 && value ? $(obj.dom6).val(Number(value*0.07)+Number(value)):$(obj.dom6).val("");
           obj.dom7 && value ? $(obj.dom7).val(Number(value)-4):$(obj.dom7).val("");
           obj.dom8 && value ? $(obj.dom8).val(Number(value)+7):$(obj.dom8).val("");
           obj.dom9 && value ? $(obj.dom9).val(Number(value)+5):$(obj.dom9).val(""); 
        }

        function versionChose(){
            var datacode = 001;
            datacode = $("#2-19").find('.active').attr("data-code");
            if (datacode == 001) {
                changeListener({
                    dom: "#2-1",
                    dom0: "#2-10"
                });
                changeListener({
                    dom: "#2-2",
                    dom1: "#2-11"
                });
                changeListener({
                    dom: "#2-3",
                    dom1: "#2-12"
                });

                changeListener({
                    dom: "#2-11",
                    dom2: "#2-13"
                });
                // $("#2-4").on("blur",function () {
                //   $("#2-13").val(Number($("#2-11").val()) -2);
                // })

                changeListener({
                    dom: "#2-5",
                    dom0: "#2-14"
                });
                changeListener({
                    dom: "#2-6",
                    dom0: "#2-15"
                });
                changeListener({
                    dom: "#2-7",
                    dom0: "#2-16"
                });
                changeListener({
                    dom: "#2-8",
                    dom3: "#2-17"
                });
                changeListener({
                    dom: "#2-9",
                    dom4: "#2-18"
                });
            }else if (datacode == 002) {
                changeListener({
                    dom: "#2-1",
                    dom0: "#2-10"
                });
                changeListener({
                    dom: "#2-2",
                    dom5: "#2-11"
                });
                changeListener({
                    dom: "#2-3",
                    dom6: "#2-12"
                });

                changeListener({
                    dom: "#2-11",
                    dom7: "#2-13"
                });
                // $("#2-4").on("blur",function () {
                //   $("#2-13").val(Number($("#2-11").val()) -4);
                // })
                changeListener({
                    dom: "#2-5",
                    dom0: "#2-14"
                });
                changeListener({
                    dom: "#2-6",
                    dom0: "#2-15"
                });
                changeListener({
                    dom: "#2-7",
                    dom0: "#2-16"
                });
                changeListener({
                    dom: "#2-8",
                    dom8: "#2-17"
                });
                changeListener({
                    dom: "#2-9",
                    dom9: "#2-18"
                });
            }
        }
        function embroideryChose(){
                var datacode = $("#5-5").find('.active').attr("data-code");
            if (datacode == "003") {
                $("#form-tab4 .styleChose").removeClass("hidden")
                $("#form-tab4").validate({
                    'rules': {
                        '5-1': {
                            requnbired: true,
                            maxlength: 60,
                            isNotFace: true
                        }
                    }
                });
            }else if(datacode == "004"){
                $("#form-tab4 .styleChose").addClass("hidden");
                // .find(".active").removeClass("active");
                $("#5-1").val("");
                $("#form-tab4").validate({
                    'rules': {
                        '5-1': {
                            // required: true,
                            maxlength: 60,
                            isNotFace: true
                        }
                    }
                });
            }
        }     
        
        $("#form-tab2").validate({
            'rules': {
                '2-1': {
                    required: true,
                    max: 60,
                    min: 30
                },
                '2-11': {
                    required: true
                },
                '2-2': {
                    required: true,
                    max: 180,
                    min: 60
                },
                '2-12': {
                    required: true
                },
                '2-3': {
                    required: true,
                    max: 170,
                    min: 50
                },
                '2-13': {
                    required: true
                },
                '2-4': {
                    required: true,
                    max: 170,
                    min: 50
                },
                '2-14': {
                    required: true
                },
                '2-5': {
                    required: true,
                    max: 70,
                    min: 35
                },
                '2-15': {
                    required: true
                },
                '2-6': {
                    required: true,
                    max: 90,
                    min: 50
                },
                '2-16': {
                    required: true
                },
                '2-7': {
                    required: true,
                    max: 80,
                    min: 15
                },
                '2-17': {
                    required: true
                },
                '2-8': {
                    required: true,
                    max: 65,
                    min: 20
                },
                '2-18': {
                    required: true
                },
                '2-9': {
                    required: true,
                    max: 30,
                    min: 15
                },
                '2-10': {
                    required: true
                },
            }
        });
        $("#form-tab3").validate({
            'rules': {
                '4-2': {
                    // required: true,
                    min: 10,
                    max: 100
                    // number: true
                },
                '4-3': {
                    // required: true,
                    min: 10,
                    max: 100
                    // number: true
                },
                '4-4': {
                    // required: true,
                    min: 15,
                    max: 70
                    // number: true
                }
                ,
                '4-5': {
                    required: true,
                    isNotFace: true
                }
            }
        });
        $("#form-tab4").validate({
            'rules': {
                '5-1': {
                    required: true,
                    maxlength: 60,
                    isNotFace: true
                }
            }
        });
        $("#form-tab5").validate({
            'rules': {
                '6-1': {
                    required: true,
                    maxlength: 60,
                    number: true
                },
                '6-2': {
                    required: true,
                    maxlength: 60,
                    number: true
                },
                '6-3': {
                    required: true,
                    maxlength: 60,
                    number: true
                },
                '6-4': {
                    required: true,
                    maxlength: 255,
                    isNotFace: true
                },
                '6-5': {
                    required: true,
                    maxlength: 255,
                    isNotFace: true
                }
            }
        });
    }
    function saveData(param){
        Ajax.post("620205", {
            json: param
        }).then(function(res){
            if(res.success){
                base.showMsg("保存成功");
                setTimeout(function(){
                    history.back();
                }, 1000);
            }else{
                base.showMsg(res.msg);
            }
        });
    }
    function goPage(index) {
        $("#scroller").find(".header-item:eq(" + index + ")").addClass("active")
            .siblings(".active").removeClass("active")
            .end()[0].scrollIntoView();
        $("#entry-content").find(".entry-content" + index).addClass("active")
            .siblings(".active").removeClass("active");
        var id = "1-1"
        if(index == 1){
            id = "2-1";
        }else if(index == 2){
            id = "4-1";
        }else if(index == 3){
            id = "5-1";
        }else if(index == 4){
            id = "6-1";
        }
        $("#"+id)[0].scrollIntoView();
    }

    function validatePage1() {
        var ele = $("#1-2");
        var code = ele.attr("data-code");
        if (!code) {
            base.showMsg("衬衫面料不能为空");
            return false;
        }
        param['1-2'] = code;
        return true;
    }

    function validatePage2() {
        return $('#form-tab2').valid();
    }

    function validatePage3() {
        return $('#form-tab3').valid();
    }

    function validatePage4() {
        return $('#form-tab4').valid() && $("#4-5").find(".active").attr("data-code");
    }

    function validatePage5() {
        return $('#form-tab5').valid();
    }

});
