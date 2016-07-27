
/************ Counter ***********/
var counter = 0;
var cntHead = 0;
var cntText = 0;
var cntMail = 0;
var counterVd = 0;

var counterTh1 = 0;
var counterTh2 = 0;
var counterTh3 = 0;
var counterTh3Head = [];
var counterTh3Text = [];
var counterTh4 = 0;
var counterTh5 = 0;

function addImageNum() {
	return counter += 1;
}

function addHeadNum() {
	return cntHead += 1;
}

function addTextNum() {
	return cntText += 1;
}

function addMailNum() {
	return cntMail += 1;
}

function addVideoNum() {
	return counterVd += 1;
}
/*******/
function addTheme1Num() {
	return counterTh1 += 1;
}

function addTheme2Num() {
	return counterTh2 += 1;
}
/************************/
function addTheme3HeadNum() {
	if(counterTh3Head.length == 0) {
		counterTh3Head = [1, 2, 3];
	} else {
		counterTh3Head.forEach(function(e,i){
			counterTh3Head[i] = e + 3;
		});
	}
	return counterTh3Head;
}
function addTheme3TextNum() {

	if(counterTh3Text.length == 0) {
		counterTh3Text = [1, 2];
	} else {
		counterTh3Text.forEach(function (e, i) {
			counterTh3Text[i] = e + 2;
		});
	}
	return counterTh3Text;
}
function addTheme3Num() {
	return counterTh3 += 1;
}
/************************/
function addTheme4Num() {
	return counterTh4 += 1;
}

function addTheme5Num() {
	return counterTh5 += 1;
}

/********** Sorting for Ready Components **********/

componentsBlockSorting = function() {
	$( "#droppable" ).sortable({

		//appendTo: document.body,
		//containment: "parent",
		axis: 'y',
		tolerance: 'pointer',
		scroll: true,
		scrollSensitivity: 1,
		//distance: 1,
		cursor: "move",
		dropOnEmpty: false,
		items: '> div.drag',
		update:function(event, ui){
			$("#droppable").sortable({disabled : false});
		}
	});
	$("#droppable").sortable({disabled : false});
};

/********* Resizing for Ready Components ***********/

componentsBlockResizing = function() {
	$(".resizableTheme").resizable({
		handles: 's',
		stop: function(event, ui) {
			$(this).css("width", '');
		},
		minHeight: 123,
		maxHeight: 500
	});
	$("#droppable").sortable({disabled : false});
};

/********************************* START OF document.ready ***********************************************************/
$( document ).ready(function() {

/******************** handle drag and CKEDITOR conflict *************************/

$(document).on('mousedown', '.hdBlck', function(){
	//$('.imgDraggable').draggable({disabled : true});
	$("#droppable").sortable({disabled : true});
});

$(document).on('focusout', '.hdBlck', function(){
	//$('.imgDraggable').draggable({disabled : false});
	$("#droppable").sortable({disabled : false});
});

$(document).on('mousedown', '.txtBlck', function(){
	//$('.imgDraggable').draggable({disabled : true});
	$("#droppable").sortable({disabled : true});
});

$(document).on('focusout', '.txtBlck', function(){
	//$('.imgDraggable').draggable({disabled : false});
	$("#droppable").sortable({disabled : false});
});

/****************** drag and drop **************************/

/*==================*/
/****** drag ********/
/*==================*/
$(".draggableHead").draggable({
	accept: 'div[data-value="charactersBlock"]',
	containment: 'body',
	cursor: 'move',
	revert: 'invalid',
	scroll:true,
	helper: function () {
		return '<div class="dragIcon">' + $(this).html() + '</div>';
	}
});

$(".draggableText").draggable({
	accept: 'div[data-value="charactersBlock"]',
	containment: 'body',
	revert: 'invalid',
	helper: function () {
		return '<div class="dragIcon">' + $(this).html() + '</div>';
	}
});

$(".draggableMail").draggable({
	accept: 'div[data-value="charactersBlock"]',
	containment: 'body',
	cursor: 'move',
	revert: 'invalid',
	helper: function () {
		return '<div class="dragIcon">' + $(this).html() + '</div>';
	}
});

$(".draggableImg").draggable({
	containment: 'body',
	cursor: 'move',
	revert: 'invalid',
	helper: function () {
		return '<div class="dragIcon">' + $(this).html() + '</div>';
	}
});

$(".draggableVideo").draggable({
	containment: 'body',
	cursor: 'move',
	revert: 'invalid',
	helper: function () {
		return '<div class="dragIcon">' + $(this).html() + '</div>';
	}
});

/*========= ready components =========*/

$("#draggableCmpnt1, #draggableCmpnt2, #draggableCmpnt3, #draggableCmpnt4, #draggableCmpnt5").draggable({
	appendTo: 'body',
	containment: 'window',
	scroll: false,
	cursor: 'move',
	cursorAt: {top: 5, left: 5 },
	helper: function () {
		return '<div class="dragIconCmpnt"><img src="/v2/img/icon-dash.png" alt="" width="18"><span>Component</span></div>';
	}
});

/*==================*/
/****** drop ********/
/*==================*/
$("#droppable").droppable({

	over: function( event, ui ) {
		$(this).addClass("highlight");
	},
	out: function( event, ui ) {
		$(this).removeClass("highlight");
	},

	drop: function( event, ui ) {

		typeOfVar = $(ui.draggable.context).children('a').text();

		/********** components part **************/
		if(typeOfVar === ''){

			typeOfVarCmpnt = $(ui.draggable.context).attr('id');

			if(typeOfVarCmpnt === "draggableCmpnt1"){
				removeCustomTemplate();

				numth1 = addTheme1Num();

				$('#droppable').append(
					'<div id="themeOne'+ numth1 +'" class="resizableTheme imgBlockStyle imgDraggable drag" data-value="charactersBlock">' +
						'<a onclick="catchImgBlock(this)" class="pull-right themeOne'+ numth1 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon"></i>' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +

						'<div class="hdBlck" style="position: relative">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeOneH' + numth1 + '" contenteditable="true">' +

									'<h2 style="text-align:center"><br></h2>' +
									'<h2 style="text-align:center">Many carefully crefted components to present your business.</h2>' +

								'</div>' +
							'</div>' +
						'</div>' +

						'<div class="txtBlck">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeOneT' + numth1 + '" contenteditable="true">' +

									'<p style="text-align:center"><br></p>' +
									'<p style="text-align:center">Watch your video.</p>' +

								'</div>' +
							'</div>' +
						'</div>' +

					'</div>'
				);

				typeOfVarCmpnt = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

				$("#themeOne"+ numth1).css('background-color', 'transparent').css({
					'height': '321px',
					'background-image': 'url(/v2/img/cmpnt1.png)',
					'background-size':'contain',
					'background-position': 'center center',
					'background-repeat': 'no-repeat'
				});

				/******************** Headline editor *************************/
				CKEDITOR.disableAutoInline = false;
				CKEDITOR.inline( 'editorThemeOneH' + numth1, {
					toolbar: [
						{ name: 'basicstyles', items: ['Bold', 'Italic'] },
						{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
						{ name: 'styles', items: ['Format'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
					]
				});
				/******************* end editor **********************/

				/******************** Text editor *************************/
				CKEDITOR.inline( 'editorThemeOneT' + numth1, {
					toolbar: [
						{ name: 'basicstyles', items: ['Bold', 'Italic'] },
						{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
					]
				});
				/******************* end editor **********************/

				componentsBlockResizing();
				componentsBlockSorting();

				$("#droppable").sortable({disabled : false});
			}

			if(typeOfVarCmpnt === "draggableCmpnt2"){
				removeCustomTemplate();

				numth2 = addTheme2Num();

				$('#droppable').append(
					'<div id="themeTwo'+ numth2 +'" class="resizableTheme imgBlockStyle imgDraggable drag" data-value="charactersBlock">' +
						'<a onclick="catchImgBlock(this)" class="pull-right numBlock'+ numth2 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon"></i>' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +

						'<div class="hdBlck" style="position: relative">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeTwoH' + numth2 + '" contenteditable="true">' +

									'<h2 style="text-align:center"><br></h2>' +
									'<h2 style="text-align:center"><br></h2>' +
									'<h2 style="text-align:center">Reduce the amount of</h2>' +
									'<h2 style="text-align:center">time to build your ads by</h2>' +
									'<h2 style="text-align:center">300%</h2>' +

								'</div>' +
							'</div>' +
						'</div>' +

					'</div>'
				);

				typeOfVarCmpnt = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

				$("#themeTwo"+ numth2).css({'background-color': '#503f72','height': '321px'});

				/******************** Headline editor *************************/
				CKEDITOR.disableAutoInline = false;
				CKEDITOR.inline( 'editorThemeTwoH' + numth2, {
					toolbar: [
						{ name: 'basicstyles', items: ['Bold', 'Italic'] },
						{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
						{ name: 'styles', items: ['Format'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
					]
				});
				/******************* end editor **********************/

				componentsBlockResizing();
				componentsBlockSorting();

				$("#droppable").sortable({disabled : false});
			}

			if(typeOfVarCmpnt === "draggableCmpnt3"){
				removeCustomTemplate();

				numth3 = addTheme3Num();
				numth3Head = addTheme3HeadNum();
				numth3Text = addTheme3TextNum();

				$('#droppable').append(
					'<div id="themeThree'+ numth3 +'" class="resizableTheme imgBlockStyle imgDraggable drag" data-value="charactersBlock">' +
						'<a onclick="catchImgBlock(this)" class="pull-right themeThree'+ numth3 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon"></i>' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +
					/*********** Headline 1 ************/
						'<div class="hdBlck" style="position: relative">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeThreeH'+ numth3Head[0] +'" contenteditable="true">' +

									'<h1 style="text-align:center"><br></h1>' +
									'<h1 style="text-align:center"><strong>Built to impress<strong></h1>' +

								'</div>' +
							'</div>' +
						'</div>' +
					/************ Headline 2 ***********/
						'<div class="hdBlck" style="position: relative">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeThreeH'+ numth3Head[1] +'" contenteditable="true">' +

									'<h3><br></h3>' +
									'<h3><strong></strong><strong>Build quick</strong></h3>' +

								'</div>' +
							'</div>' +
						'</div>' +
					/************ Text 1 ***********/
						'<div class="txtBlck">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeThreeT'+ numth3Text[0] +'" contenteditable="true">' +

									'<p>Get butiful site up and running in no<br></p>' +
									'<p> time. Just choose component you like and<br></p>' +
									'<p> start tweaking it.</p>' +

								'</div>' +
							'</div>' +
						'</div>' +
					/*********** Headline 3 ************/
						'<div class="hdBlck" style="position: relative">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeThreeH'+ numth3Head[2] +'" contenteditable="true">' +

									'<h3><br></h3>' +
									'<h3><strong>Instructions manual</strong></h3>' +

								'</div>' +
							'</div>' +
						'</div>' +
					/************ Text 2 ***********/
						'<div class="txtBlck">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeThreeT'+ numth3Text[1] +'" contenteditable="true">' +

									'<p>Get started immediately with clear setup<br></p>' +
									'<p> instructions and a comprehensive help<br></p>' +
									'<p> guide with useful examples.</p>' +

								'</div>' +
							'</div>' +
						'</div>' +

					'</div>'
				);

				typeOfVarCmpnt = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

				/******************** Headline editor *************************/
				$.each(numth3Head, function (i, areaH) {

					CKEDITOR.disableAutoInline = false;
					CKEDITOR.inline( 'editorThemeThreeH' + areaH, {
						toolbar: [
							{ name: 'basicstyles', items: ['Bold', 'Italic'] },
							{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
							{ name: 'styles', items: ['Format'] },
							{ name: 'links', items: ['Link', 'Unlink'] },
							{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
						]
					});
				});
				/******************** end editor **************************/

				/******************** Text editor *************************/
				$.each(numth3Text, function (i, areaT) {

					CKEDITOR.disableAutoInline = false;
					CKEDITOR.inline( 'editorThemeThreeT' + areaT, {
						toolbar: [
							{ name: 'basicstyles', items: ['Bold', 'Italic'] },
							{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
							{ name: 'links', items: ['Link', 'Unlink'] },
							{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
						]
					});
				});
				/********************* end editor *************************/

				$("#themeThree"+ numth3).css('background-color', 'transparent').css({
					'height': '598px',
					'background-image': 'url(/v2/img/cmpnt3.png)',
					'background-size':'contain',
					'background-position': 'center center',
					'background-repeat': 'no-repeat'
				});

				componentsBlockResizing();
				componentsBlockSorting();

				$("#droppable").sortable({disabled : false});
			}

			if(typeOfVarCmpnt === "draggableCmpnt4"){
				removeCustomTemplate();
				numth4 = addTheme4Num();

				$('#droppable').append(
					'<div id="themeFour'+ numth4 +'" class="resizableTheme imgBlockStyle imgDraggable drag" data-value="charactersBlock">' +
						'<a onclick="catchImgBlock(this)" class="pull-right themeFour'+ numth4 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon"></i>' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +

						'<div class="hdBlck" style="position: relative">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeFourH' + numth4 + '" contenteditable="true">' +

									'<h4 style="text-align: center;"><strong></strong>&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;<br></h4>' +
									'<h1 style="text-align:center"><strong>GET YOUR COPY TODAY</strong></h1>' +
									'<p><strong></strong><br></p>' +

								'</div>' +
							'</div>' +
						'</div>' +

						'<div id="mailBoxCmpnt'+ numth4 +'" class="mtbBlck">' +
							'<a onclick="catchMailBxBlock(this)" class="pull-right" data-toggle="modal" data-target="#mailModal" >' +
								'<i class="glyphicon glyphicon-cog settIcon"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +

							'<div class="emailMailto">' +
								'<a class="mailto" href="mailto:someone@someservice.com">Subscribe</a>' +
							'</div>' +
						'</div>' +

					'</div>'
				);

				typeOfVarCmpnt = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

				$("#themeFour"+ numth4).css({'background-color': '#c23e8c','height': '235px'});
				$("#themeFour"+ numth4+" a.mailto").css({'color': '#c23e8c'});

				 /******************** Headline editor *************************/
				CKEDITOR.disableAutoInline = false;
				CKEDITOR.inline( 'editorThemeFourH' + numth4, {
					toolbar: [
						{ name: 'basicstyles', items: ['Bold', 'Italic'] },
						{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
						{ name: 'styles', items: ['Format'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
					]
				});
				/******************* end editor **********************/

				componentsBlockResizing();
				componentsBlockSorting();

				$("#droppable").sortable({disabled : false});
			}

			if(typeOfVarCmpnt === "draggableCmpnt5"){
				removeCustomTemplate();

				numth5 = addTheme5Num();

				$('#droppable').append(
					'<div id="themeFive'+ numth5 +'" class="resizableTheme imgBlockStyle imgDraggable drag" data-value="charactersBlock">' +
						'<a onclick="catchImgBlock(this)" class="pull-right themeFive'+ numth5 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon"></i>' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +

						'<div class="txtBlck">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editorThemeFiveT' + numth5 + '" contenteditable="true">' +

									'<p style="text-align:center"><br></p>' +
									'<p style="text-align:center">Generate leads and sales with us</p>' +

								'</div>' +
							'</div>' +
						'</div>' +
					'</div>'
				);

				typeOfVarCmpnt = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

				$("#themeFive"+ numth5).css({'background-color': '#d83a3a','height': '321px'});

				/******************** Text editor *************************/
				CKEDITOR.inline( 'editorThemeFiveT' + numth5, {
					toolbar: [
						{ name: 'basicstyles', items: ['Bold', 'Italic'] },
						{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
					]
				});
				/******************* end editor **********************/

				componentsBlockResizing();
				componentsBlockSorting();

				$("#droppable").sortable({disabled : false});
			}

		}

		/********** elements part **************/
		

		if(typeOfVar === "Image"){
			removeCustomTemplate();

			num = addImageNum();

			$('#droppable').append(
				'<div id="imgBlock'+ num +'" class="resizableImg imgBlockStyle imgDraggable drag" data-value="charactersBlock">' +
					'<a onclick="catchImgBlock(this)" class="pull-right numBlock'+ num +'" data-toggle="modal" data-target="#imageModal">' +
						'<i class="glyphicon glyphicon-cog settIcon"></i>' +
					'</a>' +
					'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
						'<i class="glyphicon glyphicon-trash settIcon"></i>' +
					'</a>' +
				'</div>'
			);

			$('#imgBlock'+ num).css({
				'background-image': 'url("img/icon-mount.png")',
				'background-size': '7%',
				'background-position': '50% 50%',
				'background-repeat': 'no-repeat'
			});

			$(".resizableImg").resizable({
				handles: 's',
				stop: function(event, ui) {
					$(this).css("width", '');
				},
				minHeight: 123,
				maxHeight: 500
			});

			$( "#droppable" ).sortable({
				axis: 'y',
				tolerance: 'pointer',
				scroll: true,
				scrollSensitivity: 1,
				distance: 1,
				cursor: "move",
				dropOnEmpty: false,
				items: '> div.drag',
				update:function(event, ui){
					$("#droppable").sortable({disabled : false});
				}
			});

			typeOfVar = "";
			$("#droppable").sortable({disabled : false});
		}

		if(typeOfVar === 'Headline'){
			$('div[data-value="charactersBlock"]').hover(function(){

				idBlck = $(this).attr('id');
				numHead = addHeadNum();

				$('#'+ idBlck).append(
					'<div class="hdBlck" style="position: relative">' +
						'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +
						'<div class="editable">' +
							'<div id="editor' + numHead + '" contenteditable="true">' +
								'<h2 style="text-align: center">Please type header text here.</h2>' +
							'</div>' +
						'</div>' +
					'</div>'
				);

				typeOfVar = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

				/******************** editor *************************/
				CKEDITOR.disableAutoInline = false;
				CKEDITOR.inline( 'editor' + numHead, {
					toolbar: [
						{ name: 'basicstyles', items: ['Bold', 'Italic'] },
						{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
						{ name: 'styles', items: ['Format'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
					]
				});
				/******************* end editor **********************/
			});
		}

		if(typeOfVar === 'Text'){
			$('div[data-value="charactersBlock"]').hover(function(){

				idBlck = $(this).attr('id');
				numText = addTextNum();

				$('#'+ idBlck).append(
					'<div class="txtBlck">' +
						'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +
						'<div class="editable">' +
							'<div id="editorT' + numText + '" contenteditable="true">' +
								'<p>Please type text here.</p>' +
							'</div>' +
						'</div>' +
					'</div>'
				);

				typeOfVar = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

				/******************** editor *************************/
				CKEDITOR.disableAutoInline = true;
				CKEDITOR.inline( 'editorT' + numText, {
					toolbar: [
						{ name: 'basicstyles', items: ['Bold', 'Italic'] },
						{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
					]
				});
				/******************* end editor **********************/
			});
		}

		if(typeOfVar === 'Mail To Box'){

			$('div[data-value="charactersBlock"]').hover(function(){

				idBlck = $(this).attr('id');
				numMail = addMailNum();

				$('#'+ idBlck).append(
					'<div id="mailBoxBlock'+ numMail +'" class="mtbBlck">' +
						'<a onclick="catchMailBxBlock(this)" class="pull-right" data-toggle="modal" data-target="#mailModal" >' +
							'<i class="glyphicon glyphicon-cog settIcon"></i>' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon"></i>' +
						'</a>' +
						'<div class="emailMailto">' +
							'<a class="mailto" href="mailto:someone@someservice.com">Subscribe</a>' +
						'</div>' +
					'</div>'
				);

				typeOfVar = "";
				$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');
			});
		}

		if(typeOfVar === "Video"){

			numVd = addVideoNum();

			$('#droppable').append(
				'<div id="videoBlock'+ numVd +'" class="videoBlockStyle drag">' +
					'<a onclick="catchVdBlock(this)" class="pull-right numVdBlock" data-toggle="modal" data-target="#videoModal">' +
						'<i class="glyphicon glyphicon-cog settIcon"></i>' +
					'</a>' +
					'<a onclick="delDropedElem(this)" class="numVdBlock" data-toggle="modal" data-target="#cautionModal">' +
						'<i class="glyphicon glyphicon-trash settIcon"></i>' +
					'</a>' +
				'</div>'
			);

			$('#videoBlock'+ numVd).css({
				'background-image': 'url("/v2/img/icon-video.png")',
				'background-size': '7%',
				'background-position': '50% 50%',
				'background-repeat': 'no-repeat'
			});

			$( "#droppable" ).sortable({
				axis: 'y',
				tolerance: 'pointer',
				scroll: true,
				scrollSensitivity: 1,
				distance: 1,
				cursor: "move",
				dropOnEmpty: false,
				items: '> div.drag',
				update:function(event, ui){
					$("#droppable").sortable({disabled : false});
				}
			});

			typeOfVar = "";
			$("#droppable").sortable({disabled : false});
		}

	}
});
/******** end droppable ********/

/*************** END OF PAGE *****************/
});


/* integration part*/ 

function removeCustomTemplate() {
	$('.mngView').remove('.mngView');
	$('.rightView').css('padding', '0');
	$('.highlight').css('background', '#f9f8f8');
} 