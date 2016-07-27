
var delSureObj = {};
var objColor = {};

/************ image upload and preview ***********/

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
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            // Render thumbnail.
            var img = '<img class="thumb repoImg" width="200" src="' + e.target.result + '" title="' + escape(theFile.name) + '"/>';
            if(!selected){
                var span = document.createElement('span');
                span.className = 'imageContainer';
                span.innerHTML = img;
                document.getElementById('list').insertBefore(span, null);
            }else{
                $('.imageContainer').html(img);

                $('body').find('img.imgSelected').removeClass('imgSelected');
            }
            selected = true;
        };
    })(files);
    // Read in the image file as a data URL.
    reader.readAsDataURL(files);
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);


/************ remove variation string ***********/
delVariation = function(e) {
    $(e).parent().remove();
};

/************ remove drag element ***********/
/*delDropedImgElem = function(e) {
    $(e).parent().remove();
};*/

/************ remove drag element ***********/
/*delDropedElem = function(e) {
    $(e).parent().remove();
};*/

delDropedElem = function(e) {
    delSureObj.elemCnt = e;
    delSureObj.elemType = $(e).parent()[0].className;

    switch(delSureObj.elemType) {
        case 'hdBlck':
            $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Title Block</span> ?');
            break;
        case 'txtBlck':
            $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Text Block</span> ?');
            break;
        case 'mtbBlck':
            $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Mail Block</span> ?');
            break;
        case 'videoBlockStyle':
            $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Video Block</span> ?');
            break;
        default:
            $('#cautionModal .alert').text('').append('Do you want delete this <span style="color:red">Image Block</span> ?');
            break;
    }
};

delSureElem = function(e) {

    if(e === 'YES'){

        $(delSureObj.elemCnt).parent().remove();
        if($('#droppable').html().trim().length === 0) {
            setCustomTemplate();
        }

    }else if(e === 'NO') {

        event.preventDefault();
    }

    $("#droppable").sortable({disabled : false});
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

/************ change Image from modal ***********/

selectImgElem = function(e) {

    var tabValid = $('#imageModal #home-v1').hasClass('active');
    var strClass = $("#imageModal").find("output").attr("class");

    if(tabValid){
        var strImg = $("img.imgSelected");
        var imgName = strImg[0].src;
        var res = imgName.split("/");
        var titleName = res[res.length - 1];

        if(titleName){

            $("#"+ strClass).css('background-color', 'transparent').css({
                'background-image': 'url(img/' + titleName + ')',
                'background-size':'contain',
                'background-position': 'center center',
                'background-repeat': 'no-repeat'
            });
        }
    }else{
        if(objColor.imageBg) {
            var colorBg = $('#colorpickerHolder .colorpicker_hex input').val();
            var strColorBg = $("#imageModal").find("output").attr("class");
            //var kindBlockBg = strColorBg.replace(/\D/g,'');
            $("#" + strClass).css('background-image', 'none').css('background-color', '#' + colorBg);
            objColor.imageBg = false;
        }
    }
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
        $('#' + str).css('height', 'auto');
        $('#' + str).prepend(iframe);
    }
};

/************ change Email Box from modal ***********/

selectMailBoxElem = function(e) {

    var str = $("#emailBoxInput").attr("class");
    var kindBlock = str.replace(/\D/g, '');
    var emailVal = $("#emailBoxInput").val();

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

    if(objColor.emailBoxAddress){

        if(str.includes("mailBoxBlock")){

            $("#mailBoxBlock" + kindBlock + " a.mailto").attr("href", 'mailto:' + emailVal);

        }else if(str.includes("mailBoxCmpnt")){

            $("#mailBoxCmpnt" + kindBlock + " a.mailto").attr("href", 'mailto:' + emailVal);
        }
        objColor.emailBoxAddress = false;
    }
};


/********************************* START OF document.ready ***********************************************************/
$( document ).ready(function() {

/********** detected changes in Email Box modal for email address **********/

$('body').on('change','#mailModal #emailBoxInput ',function () {

    objColor.emailBoxAddress = true;
});

/******************** selected images in modal *************************/

$('body').on('click','.repoImg', function () {

    $('body').find('img.imgSelected').removeClass('imgSelected');
    $(this).addClass('imgSelected');
});

/******************** selected mail boxes in modal *************************/

$('body').on('click','.repoMailBox', function () {

    $('body').find('img.mBoxSelected').removeClass('mBoxSelected');
    $(this).addClass('mBoxSelected');
});

/******************** switch buttons ON-OFF *************************/

$('.probeProbe1').bootstrapSwitch('state', true);
$('.probeProbe2').bootstrapSwitch('state', false);
$('.probeProbe3').bootstrapSwitch('state', true);

$('.probeProbe1').on('switchChange.bootstrapSwitch', function (event, state) {

    //alert(this);
    //alert(event);
    //alert(state); // true or false
    $(".analitAndRetarget_div").fadeToggle("slow", "linear");
});

$('.probeProbe2').on('switchChange.bootstrapSwitch', function (event, state) {

    //alert(this);
    //alert(event);
    //alert(state); // true or false
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

/******************** show-hide buttons *************************/

$('body').on('click', '.varEvent', function () {
    $('#mdprt1').toggleClass('hidden');
    $("#mdprt2").addClass('hidden');
    $("#mdprt3").addClass('hidden');
    
    var numVar = $(this).children('a')[0].className.replace(/\D/g,'');

    $(".rightPart .rightView").toggleClass('variation' + numVar);

    /*var checked = $(".rightPart .rightView").hasClass('variation' + numVar);

    if(checked){
        $(".rightPart .rightView").attr('id','droppable');
    }else{
        $(".rightPart .rightView").attr('id','');
    }*/
});

$('body').on('click', '.cmpSet', function () {
    $('#mdprt2').toggleClass('hidden');
    $("#mdprt1").addClass('hidden');
    $("#mdprt3").addClass('hidden');
    //$("#mdprt1").removeClass('hidden');
});

$('body').on('click', '.cmnts', function () {
    $('#mdprt3').toggleClass('hidden');
    $("#mdprt1").addClass('hidden');
    $("#mdprt2").addClass('hidden');
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

$(".rightView").niceScroll({
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

    // for(i in variations) {
        // console.log(variations[i].attr('class'));
    // }
    // console.log(variations[0].attr('class'));
    // return false;
    var str = $('.leftMenuItem .subSecVar dt').text();
    var num = Number(str.slice(-1)) + 1;
    $('.leftMenuItem .subSecVar dl').append(
        '<dt class="varEvent">' +
            '<a class="var' + num + ' campaign-variations">' +
                '<i class="glyphicon glyphicon-cog"></i>Variation ' + num + '' +
            '</a>' +
            '<a onclick="delVariation(this)" class="delVar' + num + '">' +
                '<i class="glyphicon glyphicon-trash"></i>' +
            '</a>' +
        '</dt>')
    setCustomTemplate();
    fillVariationFields(null)
    $.current_variation_id = 0;
});

/*********************************************/

/*************** END OF PAGE *****************/
});

/*************** Integration part *****************/

/*campaign settings button*/
$(document).ready(function(){
    $('#CampaignSettings button[type="submit"]').on('click',function(e){
        e.preventDefault();
        // console.log($(this).serialize());
        createCampaign();
    })
});

function createCampaign() {
    var form = $('#CampaignSettings form').serialize();
        var seoForm = getSeoAttributes();
        var variationAttributes = getVariationAttributes();
        var template_content = getVariationContent();
        variationAttributes.template_content = template_content

        // console.log(seoForm);
        // return false;

        // console.log(form);
        data = {
            variation:variationAttributes,
            seo:seoForm,
            id:$.campaign_id
        };
        postCall('/v2/campaigns/create?'+form, function(data){
            if($.campaign_id == 0) {
                bootbox.confirm('Campaign was saved, stay on this page?', function(res){
                    if(res) {
                        $.current_variation_id = data.resource.template_id;
                        $.campaign_id = data.resource.campaign_id;
                        setVariationId(data.resource.template_id);
                    } else { 
                        window.location.replace('/campaigns');
                    }
                })
            } else {
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
            // console.log('error', errordata.responseJSON);
        }, data);

        console.log(form);
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


$(document).ready(function(){
    $('#variation-save').on('click',function(e){
        e.preventDefault();
        var template_content = getVariationContent();
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
                         attributes:variationAttributes
                       };
            postCall('/v2/campaigns/saveVariation', function(data){
                if($.current_variation_id == 0) {
                    setVariationId(data.resource.id);
                    $.current_variation_id = data.resource.id;
                    bootbox.alert('Variation created.');
                } else {
                    bootbox.alert('Variation updated.');
                }
            },function(){

            }, data)
        }
    })
    $(document).on('click', '.campaign-variations', function(e){
        console.log($(this), 'clicked');
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
        console.log(id, $(this));
        // if( $.current_variation_id != 0 &&  $.current_variation_id == id) {
        //     return false;
        // }
        if(id) {
            // $.current
            $.current_variation_id = id;
            getCall('/v2/campaigns/'+$.campaign_id+'/variations/'+$.current_variation_id,function(data){
                console.log(data)
                fillVariationFields(data.resource);
                setPulledTemplate(data.resource.body);
            }, function(errorData){});
        } else {
            $.current_variation_id = 0;
        }
    });
});



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
                        'Drag & Drop Eelemnts here'+
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
    $('#droppable').html(content)
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

    if(
        attributes.template_return_email_content === undefined || attributes.template_return_email_content === '' ||
        attributes.email_subject === undefined || attributes.email_subject === '' || 
        attributes.return_redirect_link === undefined || attributes.return_redirect_link === ''
        ) {
        return null;
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

function setVariationId(id) {
    var variations = $('.campaign-variations');
    variations.each(function(item){
        if(!$(this).attr('data-id')) {
            $(this).attr('data-id', id)        
        }
    });
}

$(document).on('ready',function(){

        if($('#contact_type').val() == 0){
            $('#integration_id').parent().hide();
            $('.optimization_type .opt_int').addClass('disabled');
        }
        if($('#contact_type').val() > 0){
            $('#NotificationEmail').parent().show();
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