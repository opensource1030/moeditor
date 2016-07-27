

var delSureObj = {};
var objColor = {};

/************ image upload in SEO & Social and preview ***********/

if(selectedSeo){
    selectedSeo = true;
}else{
    var selectedSeo = false;
}

function handleFileSelectSeo(evt) {

    var files = $(evt.target).prop('files')[0]; // FileList object
    if (!files.type.match('image.*')) {
        bootbox.alert('You should select image file');
        return false;
    }
    if($.campaign_id > 0) {
        var formdata = new FormData();
        formdata.append('image', files);
        formdata.append('campaign_id', $.campaign_id);
        // Closure to capture the file information.

        uploadFile('/v2/campaigns/seo-image', function(success){
            // console.log(success);
            var src = '/v2/images/uploads/'+success.filename;
            if($('.imageContainerSeo').length === 0) {
                var content = '<span class="glyphicon glyphicon-remove" id="remove-seo-image"></span><span class="imageContainerSeo"><img class="thumb" width="170" src="' + src + '" title="3.gif"></span>'
                $('.SelectedSeo').html(content);
            } else {
                $('.imageContainerSeo img').attr('src', src)
            }
            // bootbox.alert('Seo image was uploaded');
        }, function(error){
            bootbox.alert(error.responseJSON.message);
        }, formdata)        
    } else {
        var reader = new FileReader(files);
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                // var img = '<img class="thumb" width="170" src="' + e.target.result + '" title="' + escape(theFile.name) + '"/>';

                // if(!selectedSeo){
                //     var span = document.createElement('span');
                //     span.className = 'imageContainerSeo';
                //     span.innerHTML = img;
                //     document.getElementById('listSeo').insertBefore(span, null);
                // }else{
                //     $('.imageContainerSeo').html(img);

                //     $('body').find('img.SelectedSeo').removeClass('SelectedSeo');
                // }
                // selectedSeo = true;
                var src = e.target.result;
                if($('.imageContainerSeo').length === 0) {
                    var content = '<span class="glyphicon glyphicon-remove" id="remove-seo-image"></span><span class="imageContainerSeo"><img class="thumb" width="170" src="' + src + '" title="3.gif"></span>'
                    $('.SelectedSeo').html(content);
                } else {
                    $('.imageContainerSeo img').attr('src', src)
                }
                $.seoFile = files;
            };
        })(files);
        // Read in the image file as a data URL.
        reader.readAsDataURL(files);
    }
    
    
}
document.getElementById('fileSeo').addEventListener('change', handleFileSelectSeo, false);



$('body').on('click', '.uploadImgBtn', function () {

    $("#fileSeo").click();

});

/************ image upload in image block and preview ***********/

    if(selected){
        selected = true;
    }else{
        var selected = false;
    }

function handleFileSelect(evt) {
    var files = evt.target.files[0]; // FileList object
    if (!files.type.match('image.*')) {
        return true;
    }
    var formdata = new FormData();
    formdata.append('image', files);
    // Closure to capture the file information.

    uploadFile('/v2/upload-image', function(success){
        var strClass = $("#imageModal #list").attr('class');
            $("#"+ strClass).css('background-color', 'transparent').css({
                'background-image': 'url(/v2/images/uploads/' + success.filename + ')',
                'background-size':'contain',
                'background-position': 'center center',
                'background-repeat': 'no-repeat'
            });
    }, function(error){
        bootbox.alert(error.responseJSON.message);
    }, formdata)
    // return false;
    // var reader = new FileReader();
    // // Closure to capture the file information.
    // reader.onload = (function(theFile) {
    //     return function(e) {
    //         // Render thumbnail.
    //         var img = '<img class="thumb repoImg" width="200" src="' + e.target.result + '" title="' + escape(theFile.name) + '"/>';
    //         if(!selected){
    //             var span = document.createElement('span');
    //             span.className = 'imageContainer';
    //             span.innerHTML = img;
    //             document.getElementById('list').insertBefore(span, null);
    //         }else{
    //             $('.imageContainer').html(img);

    //             $('body').find('img.imgSelected').removeClass('imgSelected');
    //         }
    //         selected = true;
    //     };
    // })(files);
    // // Read in the image file as a data URL.
    // reader.readAsDataURL(files);
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);

/************ image upload in container block and preview ***********/

if(selectedCont){
    selectedCont = true;
}else{
    var selectedCont = false;
}

function handleFileSelectCont(evt) {
    var files = evt.target.files[0]; // FileList object
    if (!files.type.match('image.*')) {
        return true;
    }
    var formdata = new FormData();
    formdata.append('image', files);
    // Closure to capture the file information.

    uploadFile('/v2/upload-image', function(success){
        var strClass = $('#containerModal #listCont').attr('class');
            $("#"+ strClass).css('background-color', 'transparent').css({
                'background-image': 'url(/v2/images/uploads/' + success.filename + ')',
                'background-size':'contain',
                'background-position': 'center center',
                'background-repeat': 'no-repeat'
            });
    }, function(error){
        bootbox.alert(error.responseJSON.message);
    }, formdata)
    return false;
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            // Render thumbnail.
            var img = '<img class="thumb repoIconCont" width="200" src="' + e.target.result + '" title="' + escape(theFile.name) + '"/>';
            if(!selectedCont){
                var span = document.createElement('span');
                span.className = 'imageContainerCont';
                span.innerHTML = img;
                document.getElementById('listCont').insertBefore(span, null);
            }else{
                $('.imageContainerCont').html(img);

                $('body').find('img.imgContSelected').removeClass('imgContSelected');
            }
            selectedCont = true;
        };
    })(files);
    // Read in the image file as a data URL.
    reader.readAsDataURL(files);
}
document.getElementById('filesCont').addEventListener('change', handleFileSelectCont, false);


/************ remove variation string ***********/
delVariation = function(e) {
    if($('.campaign-variations').length === 1) {
        bootbox.alert('Minimum count of variations is 1');
        return false;
    }
    bootbox.confirm("Are you sure?", function(bool) {
        if(bool) {
            id = $(e).prev().attr('data-id');
            if(id) {
                deleteTemplate(id, e);
                // $(e).parent().remove();        
            } else {
                updateTrafficAllocations(null);
                $(e).parent().remove();
                $('.campaign-variations').removeClass('active');
                $("#mdprt1").addClass('hidden');
            }
        }
    });
};

function deleteTemplate(id, e) {
    var data = {
        template_id:id,
        campaign_id:$.campaign_id
    };
    postCall('/v2/campaigns/deleteVariation', function(data){
        $(e).parent().remove();
        if(data.resource.length < 2) {
            $('#enable_optimization').val(0);
            $('.probeProbe2').bootstrapSwitch('state',false);
            $(".returnClickors_div").hide();
        }
        updateTrafficAllocations(data.resource);
        $('.campaign-variations').removeClass('active');
        $("#mdprt1").addClass('hidden');
        $("#main-save").fadeOut(300);
        setCustomTemplate();
        $.current_variation_id = 0;
    }, function(errorData){
        bootbox.alert(errorData.responseJSON.message);
    }, data)
}

function updateTrafficAllocations(data) {
    var traffic_allocations = $('.TrafficAllocation');
    if(!data) {
        getCall('/v2/campaigns/'+$.campaign_id+'/variations', function(successData){
            var data = successData.resource;
            traffic_allocations.each(function(e){
                for(var i in data) {
                    if(data[i].id == $(this).attr('data-id')) {
                        $(this).val(data[i].affect_percentile+'%');
                    }
                }
            });
        }, function(errorData){
            alert('error on get allocation');

        });
    } else {
        traffic_allocations.each(function(e){
            for(var i in data) {
                if(data[i].id == $(this).attr('data-id')) {
                    $(this).val(data[i].affect_percentile);
                }
            }
        });
    }
}

/************ remove droped elements ***********/
delDropedElem = function(e) {
    delSureObj.elemCnt = e;
    delSureObj.elemClass = $(e).parent()[0];
    delSureObj.elemType = $(e).parent()[0].className;
    delSureObj.elemEditable = $(delSureObj.elemClass).find('.editable').find(">:first-child").attr('id');

    if($(delSureObj.elemClass).hasClass('containerBlockStyle')){

        $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Container Block</span> ?');

    }else if($(delSureObj.elemClass).hasClass('imgBlockStyle')){

        $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Image Block</span> ?');

    }else if($(delSureObj.elemClass).hasClass('hdBlck')){

        $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Headline Block</span> ?');

    }else if($(delSureObj.elemClass).hasClass('txtBlck')){

        $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Text Block</span> ?');

    }else if($(delSureObj.elemClass).hasClass('mtbBlck')){

        $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Mail To Box Block</span> ?');

    }else if($(delSureObj.elemClass).hasClass('videoBlockStyle')){

        $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Video Block</span> ?');

    }
};

delSureElem = function(e) {

    if(e === 'YES'){

        $(delSureObj.elemCnt).parent().remove();
        $('#cke_' + delSureObj.elemEditable).remove();
        if($("#droppable").html().trim().length === 0) {
            setCustomTemplate();
            $("#droppable").removeClass("highlight");
        }

    }else if(e === 'NO') {

        event.preventDefault();
    }
    $(".imgDraggable").sortable({disabled : false});
    $("#droppable").sortable({disabled : false});
};

/************ catch container Block element ***********/
catchContBlock = function(e) {
    objColor.containerBg = false;

    $('#colorpickerHolderContainer').ColorPicker( {flat: true, onChange:function () {
        objColor.containerBg = true;
    }} );

    $('#containerModal #listCont').removeClass();
    $('#containerModal #listCont').addClass(e.parentNode.id);
};

/************ catch image Block element ***********/
catchImgBlock = function(e) {
    objColor.imageBg = false;

    $('#colorpickerHolder').ColorPicker( {flat: true, onChange:function () {
        objColor.imageBg = true;
    }} );

    $('#imageModal #list').removeClass();
    $('#imageModal #list').addClass(e.parentNode.id);
};

/************ catch video Block element ***********/
catchVdBlock = function(e) {

    //console.log(e);
    //console.log(e.parentNode.id);
    $('#videoModal #uploadedVideo').removeClass();
    $('#videoModal #uploadedVideo').addClass(e.parentNode.id);
};

/************ catch Mail Box Block element ***********/
catchMailBxBlock = function(e) {
    objColor.text = false;
    objColor.bg = false;

    $('#colorpickerHolderMailText').ColorPicker( {flat: true, onChange:function () {
        objColor.text = true;
    }} );
    $('#colorpickerHolderMailBg').ColorPicker( {flat: true, onChange:function () {
        objColor.bg = true;
    }} );

    $('#mailModal #emailBoxInput').removeClass();
    $('#mailModal #emailBoxInput').addClass("form-control input-lg " + e.parentNode.id);
};

/************ change Container from modal ***********/

selectContElem = function(e) {

    var tabValid = $('#containerModal #home-v0').hasClass('active');
    var strClass = $('#containerModal #listCont').attr('class');

    if(tabValid){
        var strImg = $("img.imgContSelected");
        var imgName = strImg[0].src;
        var res = imgName.split("/");
        var titleName = res[res.length - 1];

        if(titleName){
            $('#'+ strClass).css('background-color', 'transparent').css({
                'background-image': 'url(/v2/img/' + titleName + ')',
                'background-size':'contain',
                'background-position': 'center center',
                'background-repeat': 'no-repeat'
            });
        }
    }else{
        if(objColor.containerBg) {
            var colorBg = $('#colorpickerHolderContainer .colorpicker_hex input').val();
            var strColorBg = $('#containerModal #listCont').attr('class');
            //var kindBlockBg = strColorBg.replace(/\D/g,'');
            $('#' + strClass).css('background-image', 'none').css({'background-color': '#' + colorBg});
            objColor.containerBg = false;
        }
    }

    $("img.imgContSelected").removeClass('imgContSelected');
};

/************ change Image from modal ***********/

selectImgElem = function(e) {

    var tabValid = $('#imageModal #home-v1').hasClass('active');
    var strClass = $("#imageModal #list").attr('class');

    if(tabValid){
        var strImg = $("img.imgSelected");
        var imgName = strImg[0].src;
        var res = imgName.split("/");
        var titleName = res[res.length - 1];

        if(titleName){

            $("#"+ strClass).css('background-color', 'transparent').css({
                'width':'510px',
                'margin':'0 auto',
                'background-image': 'url(/v2/img/' + titleName + ')',
                'background-size':'contain',
                'background-position': 'center center',
                'background-repeat': 'no-repeat'
            });
        }
    }else{
        if(objColor.imageBg) {
            var colorBg = $('#colorpickerHolder .colorpicker_hex input').val();
            var strColorBg = $('#imageModal #listCont').attr('class');
            //var kindBlockBg = strColorBg.replace(/\D/g,'');
            $("#" + strClass).css('background-image', 'none').css({'width':'510px','margin':'0 auto','background-color': '#' + colorBg});
            objColor.imageBg = false;
        }
    }
    $("img.imgSelected").removeClass('imgSelected');
};

/************ change Video from modal ***********/

selectVideoElem = function(e) {

    var str = $("#uploadedVideo").attr("class");
    var kindBlock = str.replace(/\D/g, '');
    var iframe = $('#uploadedVideo').val().trim();
    var subStr = "<iframe";
    var res = iframe.substring(0, 7);

    if(res === subStr){
        $('#' + str).find('iframe').remove();
        $('#' + str).addClass('embed-responsive embed-responsive-16by9');
        $('#' + str).css({'height': 'auto','width':'510px','margin':'0 auto'});

        $('#' + str).prepend(iframe);
    }
};
     
/************ change Email Box from modal ***********/

selectMailBoxElem = function(e) {

    var str = $("#mailModal #emailBoxInput").attr("class");
    var kindBlock = str.replace(/\D/g, '');

    if(objColor.text){
        
        var colorBgMailText = $('#colorpickerHolderMailText .colorpicker_hex input').val();
        
        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock + " a.mailto").css('color', '#' + colorBgMailText);
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock + " a.mailto").css('color', '#' + colorBgMailText);
        }
        objColor.text = false;
    }

    if(objColor.bg){

        var colorBgMailBg = $('#colorpickerHolderMailBg .colorpicker_hex input').val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock + " a.mailto").css('background-image', 'none').css('background-color', '#' + colorBgMailBg);
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock + " a.mailto").css('background-image', 'none').css('background-color', '#' + colorBgMailBg);
        }
        objColor.bg = false;
    }

    if(objColor.emailBoxBtnText){

        var textBtn = $("#mailModal #emailBoxBtnText").val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock + " a.mailto").text(textBtn);
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock + " a.mailto").text(textBtn);
        }
        objColor.emailBoxBtnText = false;
    }

    if(objColor.emailBoxBtnSize){

        var sizeTextBtn = $("#mailModal #emailBoxBtnFont").val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock + " a.mailto").css('font-size',sizeTextBtn+'px');
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock + " a.mailto").css('font-size',sizeTextBtn+'px');
        }
        objColor.emailBoxBtnSize = false;
    }

    if(objColor.emailBoxBtnPaddingW){

        var btnPaddW = $("#mailModal #emailBoxBtnStyle .btnStyleW").val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock + " a.mailto").css('padding-left',btnPaddW +'px').css('padding-right',btnPaddW +'px');
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock + " a.mailto").css('padding-left',btnPaddW +'px').css('padding-right',btnPaddW +'px');
        }
        objColor.emailBoxBtnPaddingW = false;
    }

    if(objColor.emailBoxBtnPaddingH){

        var btnPaddH = $("#mailModal #emailBoxBtnStyle .btnStyleH").val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock + " a.mailto").css('padding-top',btnPaddH +'px').css('padding-bottom',btnPaddH +'px');
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock + " a.mailto").css('padding-top',btnPaddH +'px').css('padding-bottom',btnPaddH +'px');
        }
        objColor.emailBoxBtnPaddingH = false;
    }

    /**************/
    if(objColor.emailBoxTxtPaddingW){

        var txtPaddW = $("#mailModal #emailBoxTxtStyle .txtStyleW").val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock).css('padding-left',txtPaddW +'px').css('padding-right',txtPaddW +'px');
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock).css('padding-left',txtPaddW +'px').css('padding-right',txtPaddW +'px');
        }
        objColor.emailBoxTxtPaddingW = false;
    }

    if(objColor.emailBoxTxtPaddingH){

        var txtPaddH = $("#mailModal #emailBoxTxtStyle .txtStyleH").val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock).css('padding-top',txtPaddH +'px').css('padding-bottom',txtPaddH +'px');
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock).css('padding-top',txtPaddH +'px').css('padding-bottom',txtPaddH +'px');
        }
        objColor.emailBoxTxtPaddingH = false;
    }
    /******************/

    if(objColor.emailBoxBtnRadius){

        var btnRadius = $("#mailModal #emailBoxBtnStyle .btnStyleR").val();

        if(str.includes("mailBoxBlock")){

            switch(btnRadius) {
                case "rounded":
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'none'
                    });
                    break;
                case "square":
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '0px',
                        'border-style': 'none'
                    });
                    break;
                case "pill":
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '500px',
                        'border-style': 'none'
                    });
                    break;
                case "dotted":
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'dotted'
                    });
                    break;
                case "dashed":
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'dashed'
                    });
                    break;
                case "double":
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'double'
                    });
                    break;
                case "groove":
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'groove'
                    });
                    break;
                default:
                    $("#mailBoxBlock" + kindBlock + " a.mailto").css({
                        'border-radius': '0px',
                        'border-style': 'none'
                    });
            }
        }else if(str.includes("mailBoxCmpnt")){

            switch(btnRadius) {
                case "rounded":
                    $("#mailBoxCmpnt" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'solid'
                    });
                    break;
                case "square":
                    $("#mailBoxCmpnt" + kindBlock + " a.mailto").css({
                        'border-radius': '0px',
                        'border-style': 'solid'
                    });
                    break;
                case "pill":
                    $("#mailBoxCmpnt" + kindBlock + " a.mailto").css({
                        'border-radius': '500px',
                        'border-style': 'solid'
                    });
                    break;
                case "dotted":
                    $("#mailBoxCmpnt" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'dotted'
                    });
                    break;
                case "dashed":
                    $("#mailBoxCmpnt" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'dashed'
                    });
                    break;
                case "double":
                    $("#mailBoxCmpnt" + kindBlock + " a.mailto").css({
                        'border-radius': '3px',
                        'border-style': 'double'
                    });
                    break;
                default:
                    $("#mailBoxCmpnt" + kindBlock + " a.mailto").css({
                        'border-radius': '0px',
                        'border-style': 'none'
                    });
            }
        }
        objColor.emailBoxBtnRadius = false;
    }

    if(objColor.emailBoxBtnPosition){

        var btnPosition = $("#mailModal #emailBoxBtnStyle .btnStyleP").val();

        if(str.includes("mailBoxBlock")){
            $("#mailBoxBlock" + kindBlock + " div.emailMailto").css('text-align', btnPosition);
        }else if(str.includes("mailBoxCmpnt")){
            $("#mailBoxCmpnt" + kindBlock + " div.emailMailto").css('text-align', btnPosition);
        }
        objColor.emailBoxBtnPosition = false;
    }

    if(objColor.emailBoxBtnIcon){

        var btnIcon = $("#mailModal #emailBoxBtnIcon img.iconSelected");
        var iconName = btnIcon[0].src;
        var resIcon = iconName.split("/");
        var urlIconName = resIcon[resIcon.length - 1];

        if(str.includes("mailBoxBlock")){
            if(urlIconName){
                $("#mailBoxBlock" + kindBlock + " a.mailto").css('background-color', 'transparent').css({
                    'background-image': 'url(/v2/img/' + urlIconName + ')',
                    'background-size':'cover',
                    'background-position': 'center center',
                    'background-repeat': 'no-repeat'
                });
            }

        }else if(str.includes("mailBoxCmpnt")){

            if(urlIconName){
                $("#mailBoxCmpnt" + kindBlock + " a.mailto").css('background-color', 'transparent').css({
                    'background-image': 'url(/v2/img/' + urlIconName + ')',
                    'background-size':'cover',
                    'background-position': 'center center',
                    'background-repeat': 'no-repeat'
                });
            }
        }
        objColor.emailBoxBtnIcon = false;
    }
};


/********************************* START OF document.ready ***********************************************************/
$( document ).ready(function() {

/********** detected changes in Email Box modal for text of button **********/
$('body').on('change','#mailModal #emailBoxBtnText',function () {
    if($(this).val() != ''){
        objColor.emailBoxBtnText = true;
    }else{
        objColor.emailBoxBtnText = false;
    }
});
/********** detected changes in Email Box modal for text size of button **********/
$('body').on('change','#mailModal #emailBoxBtnFont',function () {
    if($(this).val() != ''){
        objColor.emailBoxBtnSize = true;
    }else{
        objColor.emailBoxBtnSize = false;
    }
});
/********** detected changes in Email Box modal for button of padding width**********/
$('body').on('change','#mailModal #emailBoxBtnStyle .btnStyleW',function () {
    if($(this).val() != ''){
        objColor.emailBoxBtnPaddingW = true;
    }else{
        objColor.emailBoxBtnPaddingW = false;
    }
});
/********** detected changes in Email Box modal for button of padding height**********/
$('body').on('change','#mailModal #emailBoxBtnStyle .btnStyleH',function () {
    if($(this).val() != ''){
        objColor.emailBoxBtnPaddingH = true;
    }else {
        objColor.emailBoxBtnPaddingH = false;
    }
});
/********** detected changes in Email Box modal for text of padding width**********/
    $('body').on('change','#mailModal #emailBoxTxtStyle .txtStyleW',function () {
        if($(this).val() != ''){
            objColor.emailBoxTxtPaddingW = true;
        }else{
            objColor.emailBoxTxtPaddingW = false;
        }
    });
    /********** detected changes in Email Box modal for text of padding height**********/
    $('body').on('change','#mailModal #emailBoxTxtStyle .txtStyleH',function () {
        if($(this).val() != ''){
            objColor.emailBoxTxtPaddingH = true;
        }else {
            objColor.emailBoxTxtPaddingH = false;
        }
    });

/********** detected changes in Email Box modal for radius of button **********/
$('body').on('change','#mailModal #emailBoxBtnStyle .btnStyleR',function () {
    objColor.emailBoxBtnRadius = true;
});
/********** detected changes in Email Box modal for position of button **********/
$('body').on('change','#mailModal #emailBoxBtnStyle .btnStyleP',function () {
    objColor.emailBoxBtnPosition = true;
});
/********** detected changes in Email Box modal for icons of button **********/
$('body').on('click','#mailModal #emailBoxBtnIcon img.repoIcon',function () {

    $('body').find('img.iconSelected').removeClass('iconSelected');
    $(this).addClass('iconSelected');

    objColor.emailBoxBtnIcon = true;
});


/******************** selected images in modal *************************/

$('body').on('click','.repoImg', function () {

    $('body').find('img.imgSelected').removeClass('imgSelected');
    $(this).addClass('imgSelected');
});

/******************** selected images in modal *************************/

$('body').on('click','.repoIconCont', function () {

    $('body').find('img.imgContSelected').removeClass('imgContSelected');
    $(this).addClass('imgContSelected');
});

/******************** selected mail boxes in modal *************************/

$('body').on('click','.repoMailBox', function () {

    $('body').find('img.mBoxSelected').removeClass('mBoxSelected');
    $(this).addClass('mBoxSelected');
});

/******************** switch buttons ON-OFF *************************/

$('.probeProbe1').bootstrapSwitch('state');
$('.probeProbe2').bootstrapSwitch('state');
$('.probeProbe3').bootstrapSwitch('state');

$('.probeProbe1').on('switchChange.bootstrapSwitch', function (event, state) {

    //alert(this);
    //alert(event);
    //alert(state); // true or false
    $(".analitAndRetarget_div").fadeToggle("slow", "linear");
});

$('.probeProbe2').on('switchChange.bootstrapSwitch', function (event, state) {
    // return false;
    // console.log()
    // event.preventDefault()
    //alert(this);
    //alert(event);
    //alert(state); // true or false
    if($.campaign_id == 0) {
        $('.optimization_alert').show();
        // $('.probeProbe2').bootstrapSwitch('disabled',true);
        // $('.probeProbe2').bootstrapSwitch('toggleDisabled',false,false);
        $('.probeProbe2').bootstrapSwitch('state',false);
    } else {
        getCall('/v2/campaigns/'+$.campaign_id+'/canUseOptimisation', function(success){
            if(success == 'true') {
                $(".returnClickors_div").fadeToggle("slow", "linear");
                $('.optimization_alert').hide();
            } else {
                $('.optimization_alert').show();
                $(".returnClickors_div").hide();
                $('.probeProbe2').bootstrapSwitch('state',false);
            }
        }, function(){});
    }
});

$('.probeProbe3').on('switchChange.bootstrapSwitch', function (event, state) {

    //alert(this);
    //alert(event);
    //alert(state); // true or false
    $(".returnVisitors_div").fadeToggle("slow", "linear");
});

/******************** tooltip *************************/

$("[rel=tooltip1]").tooltip({ placement: 'right'});
$("[rel=tooltip2]").tooltip({ placement: 'top'});
$("[rel=tooltip3]").tooltip({ placement: 'bottom'});
$("[rel=tooltip4]").tooltip({ placement: 'right'});
$("[rel=tooltip5]").tooltip({ placement: 'right'});
$("[rel=tooltip6]").tooltip({ placement: 'left'});
$("[rel=tooltip7]").tooltip({ placement: 'left'});
$("[rel=tooltip8]").tooltip({ placement: 'left'});
$("[rel=tooltip9]").tooltip({ placement: 'bottom'});
$("[rel=tooltip10]").tooltip({ placement: 'top'});

/******************** show-hide buttons *************************/

$('body').on('click', '.varEvent a.campaign-variations', function () {
    $('#mdprt1').removeClass('hidden');
    $("#mdprt2").addClass('hidden');
    $("#mdprt3").addClass('hidden');
    $('.campaign-variations').removeClass('active');
    $('.cmpSet').removeClass('active');
    $('.cmnts').removeClass('active');
    $(this).addClass('active');
    
    // var numVar = $(this).children('a')[0].className.replace(/\D/g,'');

    // $(".rightPart .rightView").toggleClass('variation' + numVar);
});

$('body').on('click', '.cmpSet', function () {
    $('#main-save').fadeIn(300);
    if($('#CampaignSettings').parent().hasClass('active')) {
        $.active_window = 'campaign';
    } else if($('#SeoSocial').hasClass('active')) {
        $.active_window = 'seo';
    } else {
        $.active_window = 'campaign';
    }
    $('#mdprt2').removeClass('hidden');
    $("#mdprt1").addClass('hidden');
    $("#mdprt3").addClass('hidden');
    $('.campaign-variations').removeClass('active');
    $('.cmnts').removeClass('active');
    $(this).addClass('active');
    //$("#mdprt1").removeClass('hidden');
});

$('body').on('click', '.cmnts', function () {
    $('#mdprt3').removeClass('hidden');
    $("#mdprt1").addClass('hidden');
    $("#mdprt2").addClass('hidden');
    $('.campaign-variations').removeClass('active');
    $('.cmpSet').removeClass('active');
    $(this).addClass('active');
    //$("#mdprt1").removeClass('hidden');
});
$('body').on('click', '.close-window', function () {
    $('#main-save').fadeOut(300);
    $(this).parent().addClass('hidden');
    $('.campaign-variations').removeClass('active');
    $('.cmpSet').removeClass('active');
    $('.cmnts').removeClass('active');
    //$("#mdprt1").removeClass('hidden');
});
    
/********************* nice scroll ************************/

$("#mdprt3").niceScroll({
    cursorcolor:"#a6a6a6",
    cursorwidth: "8px",
    autohidemode: "leave",
    cursorminheight: 10,
    cursorborder: 'none',
    horizrailenabled: true,
    railpadding: { top: 0, right: 3, left: 0, bottom: 0 }
});

$("#mdprt1").niceScroll({
    cursorcolor:"#a6a6a6",
    cursorwidth: "8px",
    autohidemode: "leave",
    cursorminheight: 10,
    cursorborder: 'none',
    railpadding: { top: 0, right: 3, left: 0, bottom: 0 }
});

$("#mdprt2").niceScroll({
    cursorcolor:"#a6a6a6",
    cursorwidth: "8px",
    autohidemode: "leave",
    cursorminheight: 10,
    cursorborder: 'none',
    railpadding: { top: 0, right: 3, left: 0, bottom: 0 }
});



$(".leftMenuItem").niceScroll({
    cursorcolor:"#a6a6a6",
    cursorwidth: "8px",
    autohidemode: "leave",
    cursorminheight: 10,
    cursorborder: 'none',
    railpadding: { top: 0, right: 2, left: 0, bottom: 0 }
});


/******************* add variation option **************************/

$('body').on('click', '.circleIcon', function () {
    var variations = $('.campaign-variations');
    var canAdd = true;
    variations.each(function(item){
        if(!$(this).attr('data-id')) {
            canAdd = false;
        }
    });
    if(!canAdd) {
        errorDialog('You need to save current template')
        return false;
    }

    // var str = $('.leftMenuItem .subSecVar dt').text().trim();
    // console.log(str);
    // return false;
    // var num = parseInt(str.slice(-1));

    if($('.campaign-variations').length === 1) {
        $('.TrafficAllocation').parent().removeClass('hidden');
    }

    $('.campaign-variations').removeClass('active');
    $('.leftMenuItem .subSecVar dl').append(
        '<dt class="varEvent">' +
            '<a class="var campaign-variations active">' +
                '<i class="glyphicon glyphicon-cog"></i>Variation ' +
            '</a>' +
            '<a onclick="delVariation(this)" class="delVar">' +
                '<i class="glyphicon glyphicon-trash"></i>' +
            '</a>' +
            '<div class="form-group">' +
                '<div class="input-group">' +
                    '<input type="text" class="form-control TrafficAllocation" value="0%"/>' +
                '</div>' +
            '</div>' +
        '</dt>'
    );
    setTimeout(function(){
        setCustomTemplate();
        fillVariationFields(null);
        $.current_variation_id = 0;
        initGotElements();
    }, 2000)
    $('.leftMenuItem').scrollTop( $('.leftMenuItem')[0].scrollHeight );

});

/******************* detected changes on variation percent option **************************/
$('body').on('change','.leftMenuItem .subSecVar dl dt.varEvent input[type=text]',function(){

    var arrtemp = arrVarCnt = [];
    var allOptions = $('.leftMenuItem .subSecVar dl dt.varEvent');

    if(allOptions.length === 0){

    }else{

        arrtemp = $.map(allOptions, function(value, index) {
            return [value];
        });

        arrtemp.forEach(function(e){

            var str = $(e).find(">:last-child input[type=text]").attr('class');
            var idOfBlock = str.replace(/\D/g, '');
            var isBlock = str.substring(str.lastIndexOf('TrafficAllocation'),str.lastIndexOf(idOfBlock));
            var tempVar = parseInt( $('.' + isBlock + idOfBlock).val().trim().replace(/\D/g, '') );

            if( Number.isInteger(tempVar) ){
                arrVarCnt.push(tempVar);
            }
        });

        sum = arrVarCnt.reduce( (a, b) => a + b, 0 );

        if(sum > 100){
            var valueOf = "";
            // alert("The sum of all variations must be 100%");
        }else{
            // valueOf = $(this).val().replace(/\D/g, '');
        }
    }
    // $(this).val(valueOf+'%')
});

/*********************************************/

/*************** END OF PAGE *****************/
});

/*************** Integration part *****************/

/*campaign settings button*/
$(document).ready(function(){
    $('#CampaignSettings button[type="submit"]').on('click',function(e){
        // e.preventDefault();
        // console.log($(this).serialize());
    })
    $("#preview button").on('click', function(){
        
        // // console.log(myWindow);
        // return false;
        var template_content = getVariationContent();
        var data = {
            template_content : template_content
        };
        postCall('/v2/previewTemplate', function(success){
            // var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=200, top="+(screen.height-400)+", left="+(screen.width-840));
            // win.document.body.innerHTML = success.body;
            // myWindow = window.open("/v2/preview", "myWindow", );
            if($.preview) {
                $.preview.close();
            }
            myWindow = window.open("/v2/preview",'_blank');
            $.preview = myWindow;
            setTimeout(function(){ 
                myWindow.document.body.innerHTML = success.body;
            },3000)

        }, function(error){

        }, data);
    });
    $('#main-save button').on('click', function(){
        if(!$.save) {
            return false;
        }
        switch($.active_window) {
            case 'campaign':
                if($('#CampaignSettings form').valid()) {
                    createCampaign(); 
                }
                break;
            case 'seo':
                saveSeo();
                break;
            case 'variation':
            if($('#variation-form').valid()){
                var template_content = getVariationContent();
                var traffic_allocation = getTrafficAllocation();
                // return false;
                // console.log(template_content);
                // return false;
                if($.campaign_id == 0) {
                    createCampaign();
                } else if($('.mngView').length > 0) {
                    errorDialog('Template content was empty');
                } else {
                    var variationAttributes = getVariationAttributes();
                    if(variationAttributes === null) {
                        errorDialog('Please fill variation fields.');
                        return false;
                    }
                    var data = { 
                                 campaign_id:$.campaign_id,
                                 template_content:template_content,
                                 variation_id:$.current_variation_id,
                                 attributes:variationAttributes,
                                 traffic_allocation:traffic_allocation
                               };
                    postCall('/v2/campaigns/saveVariation', function(data){
                        if($.current_variation_id == 0) {
                            setVariationId(data.resource.id, data.resource.name);
                            setTrafficAllocationId(data.resource.id);
                            $.current_variation_id = data.resource.id;
                            bootbox.alert('Variation created.');
                        } else {
                            changeVariationName(data.resource.id, data.resource.name);
                            bootbox.alert('Variation updated.');
                        }
                    },function(errorData){
                        if(errorData.status != 401) {
                            bootbox.alert(errorData.responseJSON.message);
                        }
                    }, data)
                }
            }
                break;
        }
    });
    $('.setAndSeo ul li a').on('click', function(){
        if($(this).attr('href') == '#CampaignSettings') {
            $.active_window = 'campaign';
        } else if($(this).attr('href') == '#SeoSocial') {
            $.active_window = 'seo';
        }
    });
});

function disableSave() {
    $.save = false;
    $("#main-save button").addClass('disabled');
}

function enableSave() {
    $("#main-save button").removeClass('disabled');
    $.save = true;
}

function createCampaign() {
    var form = $('#CampaignSettings form').serialize();
        var seoForm = getSeoAttributes();
        var variationAttributes = getVariationAttributes();
        var template_content = getVariationContent();
        variationAttributes.body = template_content

        // console.log(seoForm);
        // return false;

        // console.log(form);
        data = {
            variation:variationAttributes,
            seo:seoForm,
            id:$.campaign_id
        };
        disableSave();
        postCall('/v2/campaigns/create?'+form, function(data){
            if($.campaign_id == 0) {
                // console.log()
                if($.seoFile) {
                    var formdata = new FormData();
                    formdata.append('image', $.seoFile);
                    formdata.append('campaign_id', data.resource.campaign.id);
                    // Closure to capture the file information.

                    uploadFile('/v2/campaigns/seo-image', function(success){
                        bootbox.confirm('Campaign was saved, stay on this page?', function(res){
                        if(res) {
                            window.location.replace('/v2/campaigns/'+data.resource.campaign.id+'/edit');
                            // $.current_variation_id = data.resource.template.id;
                            // $.campaign_id = data.resource.campaign.id;
                            // // console.log(data.resource);
                            // setVariationId(data.resource.template.id, data.resource.template.name);
                            // setTrafficAllocationId(data.resource.template.id);
                        } else { 
                            window.location.replace('/campaigns');
                        }
                    })
                        // bootbox.alert('Seo image was uploaded');
                    }, function(error){
                        bootbox.confirm('Campaign was saved, stay on this page?', function(res){
                        if(res) {
                            window.location.replace('/v2/campaigns/'+data.resource.campaign.id+'/edit');
                            // $.current_variation_id = data.resource.template.id;
                            // $.campaign_id = data.resource.campaign.id;
                            // // console.log(data.resource);
                            // setVariationId(data.resource.template.id, data.resource.template.name);
                            // setTrafficAllocationId(data.resource.template.id);
                        } else { 
                            window.location.replace('/campaigns');
                        }
                    })
                    }, formdata)
                } else {
                    bootbox.confirm('Campaign was saved, stay on this page?', function(res){
                        if(res) {
                            window.location.replace('/v2/campaigns/'+data.resource.campaign.id+'/edit');
                            // $.current_variation_id = data.resource.template.id;
                            // $.campaign_id = data.resource.campaign.id;
                            // // console.log(data.resource);
                            // setVariationId(data.resource.template.id, data.resource.template.name);
                            // setTrafficAllocationId(data.resource.template.id);
                        } else { 
                            window.location.replace('/campaigns');
                        }
                    }) 
                }
            } else {
                enableSave();
                bootbox.alert('Campaign was updated');
            }

        },function (errorData) {
            if(errorData.status === 422) {
                error = errorData.responseJSON;
                switch(error.type) {
                  case 'campaign':  // if (x === 'value1')
                        errorDialog('Please fill campaign fields.')
                    break;
                  case 'variation':  // if (x === 'value2')
                        errorDialog('Please fill variation fields.')
                    break;
                case 'template':  // if (x === 'value2')
                        errorDialog('The template was empty')
                break;

                  default:
                    
                    break;
                }
                // errorDialog('Please fill all fields')
            }
            enableSave();
            // console.log('error', errordata.responseJSON);
        }, data);

}

/*campaign settings button*/
$(document).ready(function(){
    $('#SeoSocial button[type="submit"]').on('click',function(e){
        e.preventDefault();
        if($.campaign_id == 0) {
            createCampaign();
            return false;
        }
        var attributes = getSeoAttributes();
        var data = {
            seo:attributes,
            campaign_id:$.campaign_id
        };
        postCall('/v2/campaigns/saveSeo',function (data) {
            bootbox.alert('Seo was saved.');
        }, function(errorData){

        }, data )
        
    })
});

function saveSeo() {
    if($.campaign_id == 0) {
        createCampaign();
        
    } else {
        var attributes = getSeoAttributes();
        var data = {
            seo:attributes,
            campaign_id:$.campaign_id
        };
        postCall('/v2/campaigns/saveSeo',function (data) {
            bootbox.alert('Seo was saved.');
        }, function(errorData){

        }, data )
    }
}



$(document).ready(function(){
    $(function () {
        $(document).ajaxError(function (e, xhr, settings) {
            if (xhr.status == 401) {
                bootbox.alert('Your session was expired!');
            } else if(xhr.status === 500) {
                bootbox.alert('Internal server error.please contact to administrator!');
            }
        });
    });
    $(document).on('click', '#remove-seo-image', function(e){
        var self = $(this);
        bootbox.confirm('Are you sure ?', function(bool){
            if(bool) {
                if($.campaign_id > 0) {
                    getCall('/v2/campaigns/'+$.campaign_id+'/delete-seo-image',function(success){
                        self.parent().html('');
                    }, function(error){
                        bootbox.alert('Something went wrong.');
                    }); 
                } else {
                    self.parent().html('');
                    $.seoFile = null;
                }
                
            }
        })
    });

    $(document).on('click', '#varaaiation-save',function(e){
        e.preventDefault();
        var template_content = getVariationContent();
        var traffic_allocation = getTrafficAllocation();
        // return false;
        // console.log(template_content);
        // return false;
        if($.campaign_id == 0) {
            createCampaign();
        } else if($('.mngView').length > 0) {
            errorDialog('Template content was empty');
        } else {
            var variationAttributes = getVariationAttributes();
            if(variationAttributes === null) {
                errorDialog('Please fill variation fields.');
                return false;
            }
            var data = { 
                         campaign_id:$.campaign_id,
                         template_content:template_content,
                         variation_id:$.current_variation_id,
                         attributes:variationAttributes,
                         traffic_allocation:traffic_allocation
                       };
            postCall('/v2/campaigns/saveVariation', function(data){
                if($.current_variation_id == 0) {
                    setVariationId(data.resource.id, data.resource.name);
                    setTrafficAllocationId(data.resource.id);
                    $.current_variation_id = data.resource.id;
                    bootbox.alert('Variation created.');
                } else {
                    changeVariationName(data.resource.id, data.resource.name);
                    bootbox.alert('Variation updated.');
                }
            },function(errorData){
                bootbox.alert(errorData.responseJSON.message);
            }, data)
        }
    });

    $(document).on('click', '.campaign-variations', function(e){
        $('#main-save').fadeIn(300);
        $.active_window = 'variation';
        if($.current_variation_id == $(this).attr('data-id') || ( $.current_variation_id == 0  && !$(this).attr('data-id') )) {
            return false;
        }
        var variations = $('.campaign-variations');
        var elem = $(this);
        if(variations.length > 1) {
            variations.each(function(item){
                if(elem.attr('data-id') && !$(this).attr('data-id')) {
                    $(this).parent().remove();        
                }
            });
        }
        var id = $(this).attr('data-id');
        // if( $.current_variation_id != 0 &&  $.current_variation_id == id) {
        //     return false;
        // }
        if(id) {
            // $.current
            $.current_variation_id = id;
            getCall('/v2/campaigns/'+$.campaign_id+'/variations/'+$.current_variation_id,function(data){
                fillVariationFields(data.resource);
                setPulledTemplate(data.resource.body);
                setCorrectIntegrations(data.resource.integrations, data.resource.contact_type, data.resource.integration_id);
            }, function(errorData){});
        } else {
            $.current_variation_id = 0;
        }
        updateTrafficAllocations(null);
    });
    $(document).on('change', '#fileSeo', function(e){
        // console.log(e.target.files)
    });
});

function setCorrectIntegrations(integrations, contact_type, integration_id) {

    var options = $('#contact_type option');
    $('#contact_type').html('');
    options.each(function(){
        if($(this).attr('value') == contact_type) {
            $('#contact_type').append('<option value="' + $(this).attr('value') + '" selected="selected" data-type-id="' + $(this).attr('data-id') + '">' + $(this).text() + '</option>');
        } else {
            $('#contact_type').append('<option value="' + $(this).attr('value') + '" data-type-id="' + $(this).attr('data-id') + '">' + $(this).text() + '</option>');
        }
    });
    if(integrations) {
        $('#NotificationEmail').parent().hide();
        $('#integration_id').parent().show();
        $('#integration_id').html('');
        $.each(integrations, function(id, name){
            if(id == integration_id) {
                $('#integration_id').append('<option selected="selected" value="'+id+'">'+name+'</option>');
            } else {
                $('#integration_id').append('<option value="'+id+'">'+name+'</option>');
            }
        });
    } else {
        $('#integration_id').parent().hide();
        $('#NotificationEmail').parent().show();
    }
}

function getTrafficAllocation() {
    var traffic_allocations = $('.TrafficAllocation');
    result = {};
    traffic_allocations.each(function(e){
        if($(this).attr('data-id')){
            result[$(this).attr('data-id')] = $(this).val();
        } else {
            result[0] = $(this).val();
        }
        // console.log($(this));
    });
    return result;
}

function fillVariationFields(fields) {
    if(fields) {
        $('#VariationName').val(fields.name);
        $('#TermsOfServiceURL').val(fields.terms);
        $('#PrivacyPolicyURL').val(fields.privacy);
        $('#ContactUsURL').val(fields.contact_us);
        $('#RedirectAfterOptin').val(fields.redirect_after);
        $('#ReturnEmailSubject').val(fields.email_subject);
        $('#ReturnEmailBody').val(fields.email_message);
    } else {
        $('#VariationName').val('');
        $('#TermsOfServiceURL').val('');
        $('#PrivacyPolicyURL').val('');
        $('#ContactUsURL').val('');
        $('#RedirectAfterOptin').val('');
        $('#ReturnEmailSubject').val('');
        $('#ReturnEmailBody').val('');
    }
}

function setCustomTemplate() {
    var content = '<div class="mngView">'+
                    '<div class="mntitl">'+
                        'Drag & Drop Elements here'+
                    '</div>'+

                    '<div class="col-xs-12 col-md-8 col-md-offset-4 mnatr">'+
                        '<dl>'+
                            '<dt><img src="/v2/img/icon-dash.png" alt="" width="18"><a>Components</a></dt>'+
                            '<dt class="padicon"><img src="/v2/img/icon-h.png" alt="" height="15"><a>Headline</a></dt>'+
                            '<dt><img src="/v2/img/icon-line.png" alt="" width="18"><a>Text</a></dt>'+
                            '<dt><img src="/v2/img/icon-mount.png" alt="" width="18"><a>Image</a></dt>'+
                            '<dt><img src="/v2/img/icon-envelope.png" alt="" width="18"><a>Mail To Box</a></dt>'+
                            '<dt><img src="/v2/img/icon-video.png" alt="" width="18"><a>Video</a></dt>'+
                        '</dl>'+
                    '</div>'+
                '</div>';
    $('#droppable').removeAttr('style');            
    $('#droppable').css({"overflow": "hidden", "outline": "none"});            
    $('#droppable').html(content)
}

function setPulledTemplate(content) {
    var styles = {"overflow": "hidden", "outline": "none", "padding": "0px", "background": "rgb(249, 248, 248)"};
    $('#droppable').removeAttr('style');            
    $('#droppable').css(styles);            
    $('#droppable').html(content);
    initGotElements();
    // setTimeout(function () {
    //    
    //     alert('loaded')
    // }, 2000)
}

function postCall(uri, successCallback, errorCallback, data = {}) {
    $.ajax({
            url: uri,
            type: 'post',
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="a-token"]').attr('content')
            },
            cache: false,
            data: data,
            success: successCallback,
            error: errorCallback
        });
}

function getCall(uri, successCallback, errorCallback) {
    $.ajax({
            url: uri,
            type: 'get',
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="a-token"]').attr('content')
            },
            cache: false,
            success: successCallback,
            error: errorCallback
        });
}

function errorDialog(message) {
    BootstrapDialog.show({
                        type: BootstrapDialog.TYPE_DANGER,
                        title: 'Error',
                        message: message,
                        buttons: [{
                            label: 'Ok',
                            action: function (dialogItself) {
                                dialogItself.close();


                            }
                        }]
                    });
}

function getVariationAttributes() {
    var attributes_array = $('#variation-form').serializeArray();
    var attributes = {};
    for(i in attributes_array) {
        attributes[attributes_array[i].name] = attributes_array[i].value;
    }
    return attributes;
}

function getVariationContent() {
    if($('.mngView').length > 0) {
        return '';
    }
    var template_content = $('#droppable').html();
    return template_content;    
}

function getSeoAttributes() {
    var attributes_array = $('#seo-form').serializeArray();
    var attributes = {};
    for(i in attributes_array) {
        attributes[attributes_array[i].name] = attributes_array[i].value;
    }
    return attributes;
}

function setVariationId(id, name) {
    var variations = $('.campaign-variations');
    variations.each(function(item){
        if(!$(this).attr('data-id')) {
            $(this).attr('data-id', id);
            $(this).html('<i class="glyphicon glyphicon-cog"></i>'+name);       
        }
    });
}

function initDroppableBlockScroll() {
    $(".rightView").niceScroll({
        cursorcolor:"#a6a6a6",
        cursorwidth: "8px",
        autohidemode: "leave",
        cursorminheight: 10,
        cursorborder: 'none',
        railpadding: { top: 0, right: 1.8, left: 0, bottom: 0 }
    });
}

function changeVariationName(id, name) {
    var variations = $('.campaign-variations');
    variations.each(function(item){
        if($(this).attr('data-id') == id) {
            $(this).html('<i class="glyphicon glyphicon-cog"></i>'+name);       
        }
    });
}

function setVariationName(name) {
    var variations = $('.campaign-variations');
    variations.each(function(item){
        if(!$(this).attr('data-id')) {
            $(this).attr('data-id', id);
            $(this).html('<i class="glyphicon glyphicon-cog"></i>'+name);       
        }
    });
}

function setTrafficAllocationId(id) {
    var traffic_allocation = $('.TrafficAllocation');
    traffic_allocation.each(function(item){
        if(!$(this).attr('data-id')) {
            $(this).attr('data-id', id);      
        }
    });
}

function uploadFile(uri, successCallback, errorCallback, formdata) {
    $.ajax({
                url: uri, // point to server-side PHP script 
                dataType: 'json',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="a-token"]').attr('content')
                },
                processData: false,
                data: formdata,                         
                type: 'post',
                success: successCallback,
                error: errorCallback
     });
}

$(document).on('ready',function(){
    initGotElements();
    $('#CampaignSettings form').validate({
        rules : {
            redirect_return_url : {
                required : function(){
                    if($("#enable_return_redirect").val() == 1) {
                        return true;
                    }
                    return false;
                }
            },
            analitics_and_retargeting : {
                required : function(){
                    if($("#enable_retargeting").val() == 1) {
                        return true;
                    }
                    return false;
                }
            }
        },
        submitHandler:function(form) {
            createCampaign();
        }
    });
    $('#variation-form').validate({
        rules : {
            notification_email : {
                required : function(){
                    if($("#contact_type").val() == 0) {
                        return true;
                    }
                    return false;
                }
            }
        },
        submitHandler:function(form) {
            var template_content = getVariationContent();
        var traffic_allocation = getTrafficAllocation();
        // return false;
        // console.log(template_content);
        // return false;
        if($.campaign_id == 0) {
            createCampaign();
        } else if($('.mngView').length > 0) {
            errorDialog('Template content was empty');
        } else {
            var variationAttributes = getVariationAttributes();
            if(variationAttributes === null) {
                errorDialog('Please fill variation fields.');
                return false;
            }
            var data = { 
                         campaign_id:$.campaign_id,
                         template_content:template_content,
                         variation_id:$.current_variation_id,
                         attributes:variationAttributes,
                         traffic_allocation:traffic_allocation
                       };
            postCall('/v2/campaigns/saveVariation', function(data){
                if($.current_variation_id == 0) {
                    setVariationId(data.resource.id, data.resource.name);
                    setTrafficAllocationId(data.resource.id);
                    $.current_variation_id = data.resource.id;
                    bootbox.alert('Variation created.');
                } else {
                    changeVariationName(data.resource.id, data.resource.name);
                    bootbox.alert('Variation updated.');
                }
            },function(errorData){
                if(errorData.status != 401) {
                    bootbox.alert(errorData.responseJSON.message);
                }
            }, data)
        }
        }
    });

        

        if($('#contact_type').val() == 0){
            $('#integration_id').parent().hide();
            $('.optimization_type .opt_int').addClass('disabled');
        }
        if($('#contact_type').val() > 0){
            $('#NotificationEmail').parent().hide();
        }
        if($('#contact_type option:selected').data('type-id') == 4) {
            // integration with Zapier
            $('#integration_id').html('');
            $('#integration_id').parent().hide();
            $('#NotificationEmail').parent().hide();
        }

        if($('#contact_type option:selected').data('type-id') == 2) {
            if($('#aweber-note').hasClass('hide')){
                $('#aweber-note').removeClass('hide');
            }
        }else{
            $('#aweber-note').addClass('hide');
        }
        $('#contact_type').on('change', function() {


         
         
         if($('#contact_type').val() == 0) {
             $('#integration_id').parent().hide();
             $('#NotificationEmail').parent().show();
         } else {
                $('#NotificationEmail').parent().hide();
                $('#integration_id').html('');

                var type_id = $('#contact_type option:selected').data('type-id');
                $.ajax({
                    url:   '/campaigns/camplist/' + $('#contact_type').val(),
                    type: 'GET',
                    dataType: "json",
                    cache: false,
                    success: function (content) {
                        $.each(content, function(id, name){
                              $('#integration_id').append('<option value="'+id+'">'+name+'</option>');
                        });

                        var integration_id = $('#integration_id').data('integration-id');
                        if (integration_id != 0) $('#integration_id option[value="' + integration_id + '"]').prop('selected',true);
                        $('#integration_id').parent().show(function(){
                            if(type_id == 2){
                                if($('#aweber-note').hasClass('hide')){
                                    $('#aweber-note').removeClass('hide');
                                }
                            }
                        });
                    }
                });
         }
       });
});