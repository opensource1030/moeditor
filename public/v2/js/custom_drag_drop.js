/***************  GLOBAL VARIABLES **********************/
var counter = {};

counter.numbContainerBlock = 0;
counter.numbImgBlock = 0;
counter.numbThemeOne = 0;
counter.numbThemeTwo = 0;
counter.numbTemeThree = 0;
counter.numbThemeFour = 0;
counter.numbThemeFive = 0;
counter.numbHeadBlock = 0;
counter.numbTextBlock = 0;
//counter.numbMailBoxBlock = 0;
counter.numbVideoBlock = 0;
counter.numbHeadCmpntBlock = [];
counter.numbTextCmpntBlock = [];

/************ init elements got from ajax ***********/
initGotElements = function() {

	var arrCom = arrCke = arrRsize =[];
	var InitObj = $( "#droppable .hdBlck, #droppable .txtBlck" );
	var initResizeObj = $( ".ui-resizable-handle" );
	var ckeObj = $('.cke');

	arrCke = $.map(ckeObj, function(value, index) {
		return [value];
	});

	arrCke.forEach(function(e){
		$(e).remove();
	});


	if(InitObj.length === 0){

	}else{

		arrRsize = $.map(initResizeObj, function(value, index) {
			return [value];
		});

		arrRsize.forEach(function(e){
			$(e).remove();
		});

		arrCom = $.map(InitObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){

			var str = $(e).find('.editable').find(">:first-child").attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			CKEDITOR.disableAutoInline = false;

			if(isRightBlock === 'editor') {
				/******************** editor *************************/
				CKEDITOR.inline('editor' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph',	items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles','Format']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************* end editor **********************/
			}

			if(isRightBlock === 'editorT') {
				/******************** editor *************************/
				CKEDITOR.inline('editorT' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						{name: 'forms', items: ['ImageButton']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles']},
						{name: 'font', items: ['FontSize']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************* end editor **********************/
			}

			if(isRightBlock === 'editorThemeOneH') {
				/******************** Headline editor *************************/
				CKEDITOR.inline('editorThemeOneH' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles','Format']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************* end editor **********************/
			}

			if(isRightBlock === 'editorThemeOneT') {
				/******************** Text editor *************************/
				CKEDITOR.inline('editorThemeOneT' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph',items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						{name: 'forms', items: ['ImageButton']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles']},
						{name: 'font', items: ['FontSize']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************* end editor **********************/
			}

			if(isRightBlock === 'editorThemeTwoH') {
				/******************** Headline editor *************************/
				CKEDITOR.inline('editorThemeTwoH' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles','Format']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************* end editor **********************/
			}

			if(isRightBlock === 'editorThemeThreeH') {
				/******************** Headline editor *************************/
				CKEDITOR.inline('editorThemeThreeH' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles','Format']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************** end editor **************************/
			}

			if(isRightBlock === 'editorThemeThreeT') {
				/******************** Text editor *************************/
				CKEDITOR.inline('editorThemeThreeT' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						{name: 'forms', items: ['ImageButton']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles']},
						{name: 'font', items: ['FontSize']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/********************* end editor *************************/
			}

			if(isRightBlock === 'editorThemeFourH') {
				/******************** Headline editor *************************/
				CKEDITOR.inline('editorThemeFourH' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles','Format']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************* end editor **********************/
			}

			if(isRightBlock === 'editorThemeFiveT') {
				/******************** Text editor *************************/
				CKEDITOR.inline('editorThemeFiveT' + idOfBlock, {
					toolbar: [
						{name: 'lists', items: ['Outdent', 'Indent']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
						{name: 'forms', items: ['ImageButton']},
						'/',
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
						{name: 'styles', items: ['Styles']},
						{name: 'font', items: ['FontSize']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'colors', items: ['TextColor', 'BGColor']}
					]
				});
				/******************* end editor **********************/
			}
			imgBlockResizing();
			componentsBlockResizing();
			containerBlockResizing();
			componentsBlockSorting();
			elementsBlockSorting();
		});
	}
};

/************ get current CONTAINER blocks count and detect last id ***********/
findCurrentContainerBlockNumber = function() {
	var arrCom = arrContainerBlock = [];
	var blockObj = $( "#droppable .containerBlockStyle" );

	if(blockObj.length === 0){
		counter.numbContainerBlock = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});
		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'containerBlock'){
				arrContainerBlock.push(idOfBlock);
			}
		});

		if( arrContainerBlock.length != 0){
			counter.numbContainerBlock = Math.max.apply( Math, arrContainerBlock );
		}
	}
};

/************ get current IMAGE blocks count and detect last id ***********/
findCurrentImgBlockNumber = function() {
	var arrCom = arrImgBlock = [];
	var blockObj = $( "#droppable .imgBlockStyle" );

	if(blockObj.length === 0){
		counter.numbImgBlock = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'imgBlock'){
				arrImgBlock.push(idOfBlock);
			}
		});

		if( arrImgBlock.length != 0){
			counter.numbImgBlock = Math.max.apply( Math, arrImgBlock );
		}
	}
};

/************ get current COPMONENT1 blocks count and detect last id ***********/
findCurrentThemeOneNumber = function() {
	var arrCom = arrThemeOne = [];
	var blockObj = $( "#droppable .imgBlockStyle" );

	if(blockObj.length === 0){
		counter.numbThemeOne = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'themeOne'){
				arrThemeOne.push(idOfBlock);
			}
		});

		if( arrThemeOne.length != 0) {
			counter.numbThemeOne = Math.max.apply(Math, arrThemeOne);
		}
	}
};

/************ get current COPMONENT2 blocks count and detect last id ***********/
findCurrentThemeTwoNumber = function() {
	var arrCom = arrThemeTwo = [];
	var blockObj = $( "#droppable .imgBlockStyle" );

	if(blockObj.length === 0){
		counter.numbThemeTwo = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'themeTwo'){
				arrThemeTwo.push(idOfBlock);
			}
		});

		if( arrThemeTwo.length != 0) {
			counter.numbThemeTwo = Math.max.apply(Math, arrThemeTwo);
		}
	}
};

/************ get current COPMONENT3 blocks count and detect last id ***********/
findCurrentTemeThreeNumber = function() {
	var arrCom = arrTemeThree = [];
	var blockObj = $( "#droppable .imgBlockStyle" );

	if(blockObj.length === 0){
		counter.numbTemeThree = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'themeThree'){
				arrTemeThree.push(idOfBlock);
			}
		});

		if(arrTemeThree.length != 0) {
			counter.numbTemeThree = Math.max.apply(Math, arrTemeThree);
		}
	}
};

/************ get current COPMONENT4 blocks count and detect last id ***********/
findCurrentThemeFourNumber = function() {
	var arrCom = arrThemeFour = [];
	var blockObj = $( "#droppable .imgBlockStyle" );

	if(blockObj.length === 0){
		counter.numbThemeFour = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'themeFour'){
				arrThemeFour.push(idOfBlock);
			}else{
				arrThemeFour = [0];
			}
		});

		if(arrThemeFour.length != 0) {
			counter.numbThemeFour = Math.max.apply(Math, arrThemeFour);
		}
	}
};

/************ get current COPMONENT5 blocks count and detect last id ***********/
findCurrentThemeFiveNumber = function() {
	var arrCom = arrThemeFive = [];
	var blockObj = $( "#droppable .imgBlockStyle" );

	if(blockObj.length === 0){
		counter.numbThemeFive = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'themeFive'){
				arrThemeFive.push(idOfBlock);
			}else{
				arrThemeFive = [0];
			}
		});

		if(arrThemeFive.length != 0) {
			counter.numbThemeFive = Math.max.apply(Math, arrThemeFive);
		}
	}
};

/************ get current HEADLINE blocks count and detect last id ***********/
findCurrentHeadNumber = function(){
	var arrCom = arrHeadBlock = [];
	var blockObj = $( "#droppable .headBlockStyle" );

	if(blockObj.length === 0){
		counter.numbHeadBlock = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).find('.editable').find(">:first-child").attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'editor'){
				arrHeadBlock.push(idOfBlock);
			}
		});

		if(arrHeadBlock.length != 0) {
			counter.numbHeadBlock = Math.max.apply(Math, arrHeadBlock);
		}
	}
};

/************ get current TEXT blocks count and detect last id ***********/
findCurrentTextNumber = function(){
	var arrCom = arrTextBlock = [];
	var blockObj = $( "#droppable .textBlockStyle" );

	if(blockObj.length === 0){
		counter.numbTextBlock = 0;
	}else{
		arrCom = $.map(blockObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).find('.editable').find(">:first-child").attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'editorT'){
				arrTextBlock.push(idOfBlock);
			}
		});

		if(arrTextBlock.length != 0) {
			counter.numbTextBlock = Math.max.apply(Math, arrTextBlock);
		}
	}
};

/************ get current MAILBOX blocks count and detect last id ***********/
findCurrentMailBoxNumber = function(){
	var arrCom = arrMailBoxBlock = [];
	var mailBoxObj = $( "#droppable .mtbBlck" );

	if(mailBoxObj.length === 0){

		counter.numbMailBoxBlock = 1;

	}else{

		counter.numbMailBoxBlock = 8;
	}
};

/************ get current Video blocks count and detect last id ***********/
findCurrentVideoNumber = function(){
	var arrCom = arrVideoBlock = [];
	var videoObj = $( "#droppable .videoBlockStyle" );

	if(videoObj.length === 0){
		counter.numbVideoBlock = 0;
	}else{

		arrCom = $.map(videoObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'videoBlock'){
				arrVideoBlock.push(idOfBlock);
			}
		});

		if( arrVideoBlock.length != 0) {
			counter.numbVideoBlock = Math.max.apply(Math, arrVideoBlock);
		}
	}
};

/************ get current HEADLINE Components blocks count and detect last id ***********/
findCurrentHeadCmpntNumber = function(){
	var arrCom = arrHeadCmpnt = [];
	var headCmpntObj = $( "#droppable .headCmpntBlockStyle" );

	if(headCmpntObj.length === 0){
		counter.numbHeadCmpntBlock = [];
	}else{

		arrCom = $.map(headCmpntObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).find('.cke_editable').attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'editorThemeThreeH'){
				arrHeadCmpnt.push(parseInt(idOfBlock));
			}
		});

		if(arrHeadCmpnt.length != 0) {
			counter.numbHeadCmpntBlock = arrHeadCmpnt.sort(function(a, b){return a - b;}).slice(Math.max(arrCom.length - 3, 0));
		}
	}
};

/************ get current TEXT Components blocks count and detect last id ***********/
findCurrentTextCmpntNumber = function(){
	var arrCom = arrTextCmpnt = [];
	var textCmpntObj = $( "#droppable .textCmpntBlockStyle" );

	if(textCmpntObj.length === 0){
		counter.numbTextCmpntBlock = [];
	}else{

		arrCom = $.map(textCmpntObj, function(value, index) {
			return [value];
		});

		arrCom.forEach(function(e){
			var str = $(e).find('.cke_editable').attr('id');
			var idOfBlock = str.replace(/\D/g, '');
			var isRightBlock = str.substring(0,str.lastIndexOf(idOfBlock));

			if(isRightBlock === 'editorThemeThreeT'){
				arrTextCmpnt.push(parseInt(idOfBlock));
			}
		});
		if(arrTextCmpnt.length != 0) {
			counter.numbTextCmpntBlock = arrTextCmpnt.sort(function(a, b){return a - b;}).slice(Math.max(arrCom.length - 2, 0));
		}
	}
};

/************ Counter ***********/
function addContainerNum() {
	return counter.numbContainerBlock += 1;
}

function addImageNum() {
	return counter.numbImgBlock += 1;
}

function addHeadNum() {
	return counter.numbHeadBlock += 1;
}

function addTextNum() {
	return counter.numbTextBlock += 1;
}

function addMailNum() {
	return counter.numbMailBoxBlock;
}

function addVideoNum() {
	return counter.numbVideoBlock += 1;
}
/*******/
function addTheme1Num() {
	return counter.numbThemeOne += 1;
}

function addTheme2Num() {
	return counter.numbThemeTwo += 1;
}
/************************/
function addTheme3HeadNum() {
	if(counter.numbHeadCmpntBlock.length == 0) {
		counter.numbHeadCmpntBlock = [1, 2, 3];
	} else {
		counter.numbHeadCmpntBlock.forEach(function(e,i){
			counter.numbHeadCmpntBlock[i] = e + 3;
		});
	}
	return counter.numbHeadCmpntBlock;
}

function addTheme3TextNum() {

	if(counter.numbTextCmpntBlock.length == 0) {
		counter.numbTextCmpntBlock = [1, 2];
	} else {
		counter.numbTextCmpntBlock.forEach(function (e, i) {
			counter.numbTextCmpntBlock[i] = e + 2;
		});
	}
	return counter.numbTextCmpntBlock;
}

function addTheme3Num() {
	return counter.numbTemeThree += 1;
}
/************************/
function addTheme4Num() {
	return counter.numbThemeFour += 1;
}

function addTheme5Num() {
	return counter.numbThemeFive += 1;
}

/********* Resizing for Ready Components ***********/
componentsBlockResizing = function() {

	$(".resizableTheme").resizable({
		handles: 's',
		stop: function(event, ui) {
			$(this).css("width", '');
		},
		resize: function(event,ui){
			//console.log(ui.size.height);
		},
		minHeight: 123
		//maxHeight: 500
	});
	$(".imgDraggable").sortable({disabled : false});
	$("#droppable").sortable({disabled : false});
};

/********* Resizing for Img Blocks ***********/
imgBlockResizing = function() {

	$(".resizableImg").resizable({
		handles: 's',
		stop: function(event, ui) {
			$(this).css("width", '');
		},
		resize: function(event,ui){
			//console.log(ui.size.height);
		},
		minHeight: 123
		//maxHeight: 500
	});
	$(".imgDraggable").sortable({disabled : false});
	$("#droppable").sortable({disabled : false});
};

/********* Resizing for Container Blocks ***********/
containerBlockResizing = function() {

	$(".resizableContainer").resizable({
		handles: 's',
		stop: function(event, ui) {
			$(this).css("width", '');
		},
		resize: function(event,ui){

			//console.log($(ui.originalElement).find('.imgBlockStyle').length);
			//console.log(ui.size.height);
		},
		minHeight: 245
		//maxHeight: 500
	});
	$(".imgDraggable").sortable({disabled : false});
	$("#droppable").sortable({disabled : false});
};

/********* Sorting Elements inner Block ***********/
elementsBlockSorting = function() {
	$( ".imgDraggable" ).sortable({

		//appendTo: document.body,
		containment: "parent",
		axis: 'y',
		tolerance: 'pointer',
		scroll: false,
		//scrollSensitivity: 1,
		//distance: 1,
		cursor: 'move',
		cursorAt: {top: 5, left: 5},
		dropOnEmpty: false,
		items: '> div.sortBlock', //'> div[data-value="sortBlock"]',
		update:function(event, ui){
			$(".imgDraggable").sortable({disabled : false});
			$("#droppable").sortable({disabled : false});
		},
		start: function(event, ui) {
			
			//ui.item.toggleClass("highlightElem");
			
			$(ui.item).css({
				"opacity": "0.7"
			});
		},
		stop: function(event, ui) {
			
			//ui.item.toggleClass("highlightElem");
			
			$(ui.item).css({
				"opacity": "1.0"
			});
		}
	});
	$(".imgDraggable").sortable({disabled : false});
	$("#droppable").sortable({disabled : false});
};

/********** Sorting for Ready Components **********/
componentsBlockSorting = function() {

	$( "#droppable" ).sortable({

		//appendTo: document.body,
		containment: "parent",
		axis: 'y',
		tolerance: 'pointer',
		scroll: false,
		//scrollSensitivity: 1,
		//distance: 1,
		cursor: 'move',
		cursorAt: {top: 5, left: 5},
		dropOnEmpty: false,
		items: '> div.drag',
		update:function(event, ui){
			$(".imgDraggable").sortable({disabled : false});
			$("#droppable").sortable({disabled : false});
		},
		start: function(event, ui) {
			$(ui.item).css({
				"opacity": "0.7"
			});
		},
		stop: function(event, ui) {
			$(ui.item).css({
				"opacity": "1.0"
			});
		}
	});
	$(".imgDraggable").sortable({disabled : false});
	$("#droppable").sortable({disabled : false});
};


/********************************* START OF document.ready ***********************************************************/
$( document ).ready(function() {

	/******************** handle drag and CKEDITOR conflict *************************/

	$(document).on('mousedown', '.hdBlck', function(){
		$("#droppable").sortable({disabled : true});
		$(".imgDraggable").sortable({disabled : true});
	});

	$(document).on('focusout', '.hdBlck', function(){
		$("#droppable").sortable({disabled : false});
		$(".imgDraggablee").sortable({disabled : false});
		elementsBlockSorting();
	});

	$(document).on('mousedown', '.txtBlck', function(){
		$("#droppable").sortable({disabled : true});
		$(".imgDraggable").sortable({disabled : true});
	});

	$(document).on('focusout', '.txtBlck', function(){
		$("#droppable").sortable({disabled : false});
		$(".imgDraggable").sortable({disabled : false});
		elementsBlockSorting();
	});

	/****************** drag and drop **************************/

	/*==================*/
	/****** drag ********/
	/*==================*/
	$(".draggableHead, .draggableText, .draggableMail, .draggableVideo").draggable({
		accept: 'div[data-value="charactersBlock"], div[data-value="charactersBlockCommon"]',
		appendTo: 'body',
		containment: 'window',
		scroll: false,
		cursor: 'move',
		cursorAt: {top: 5, left: 5},
		revert: 'invalid',
		helper: function () {
			return '<div class="dragIcon">' + $(this).html() + '</div>';
		}
	});

	$(".draggableImg").draggable({
		accept: 'div[data-value="charactersBlockCommon"]',
		appendTo: 'body',
		containment: 'window',
		scroll: false,
		cursor: 'move',
		cursorAt: {top: 5, left: 5},
		revert: 'invalid',
		helper: function () {
			return '<div class="dragIcon">' + $(this).html() + '</div>';
		}
	});

	$(".draggableBlock").draggable({
		accept: 'div[data-value="charactersBlockBg"]',
		appendTo: 'body',
		containment: 'window',
		scroll: false,
		cursor: 'move',
		cursorAt: {top: 5, left: 5},
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
		cursorAt: {top: 5, left: 5},
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

			/********** elements part **************/
			typeOfVar = $(ui.draggable.context).children('a').text();

			if(typeOfVar === "Container"){
				removeCustomTemplate();

				findCurrentContainerBlockNumber();
				numContainer = addContainerNum();

				$('#droppable').append(
					'<div id="containerBlock'+ numContainer +'" class="resizableContainer containerBlockStyle imgDraggable drag" data-value="charactersBlockCommon">' +
						'<a onclick="catchContBlock(this)" class="pull-right numBlock'+ numContainer +'" data-toggle="modal" data-target="#containerModal">' +
							'<i class="glyphicon glyphicon-cog settIcon contCog" rel="alt1" title="Container"></i>' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon contTrash" rel="alt2" title="Container"></i>' +
						'</a>' +
					'</div>'
				);

				$("[rel=alt1]").tooltip({placement: 'right'});
				$("[rel=alt2]").tooltip({placement: 'left'});

				$('#containerBlock'+ numContainer).css({
					'background-image': 'url("/v2/img/icon-square.png")',
					'background-size': '7%',
					'background-position': '50% 50%',
					'background-repeat': 'no-repeat'
				});

				typeOfVar = "";
				containerBlockResizing();
				componentsBlockSorting();
			}

			if(typeOfVar === "Image"){
				$('div[data-value="charactersBlockCommon"]').hover(function(){

					findCurrentImgBlockNumber();
					num = addImageNum();

					$(this).append(
						'<div id="imgBlock'+ num +'" class="resizableImg imgBlockStyle imgDraggable drag sortBlock" data-value="charactersBlock">' +
							'<a onclick="catchImgBlock(this)" class="pull-right numBlock'+ num +'" data-toggle="modal" data-target="#imageModal">' +
								'<i class="glyphicon glyphicon-cog settIcon" rel="alt3" title="Image"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon" rel="alt4" title="Image"></i>' +
							'</a>' +
						'</div>'
					);

					$("[rel=alt3]").tooltip({placement: 'right'});
					$("[rel=alt4]").tooltip({placement: 'left'});
					$('#imgBlock'+ num).css({
						'background-image': 'url("/v2/img/icon-mount.png")',
						'background-size': '7%',
						'background-position': '50% 50%',
						'background-repeat': 'no-repeat'
					});
					$(this).css('height', $(this).height() + $('#imgBlock'+ num).height() );

					typeOfVar = "";
					$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
					imgBlockResizing();
					componentsBlockSorting();
					elementsBlockSorting();
				});
			}

			if(typeOfVar === 'Headline'){
				$('div[data-value="charactersBlock"], div[data-value="charactersBlockCommon"]').hover(function(){

					//setTimeout(findCurrentHeadNumber, 5000);
					findCurrentHeadNumber();
					numHead = addHeadNum();

					$(this).append(
						'<div class="hdBlck headBlockStyle sortBlock" style="position: relative" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon" rel="alt5" title="Headline"></i>' +
							'</a>' +
							'<div class="editable">' +
								'<div id="editor' + numHead + '" contenteditable="true">' +
									'<h2 style="text-align: center">Please type header text here.</h2>' +
								'</div>' +
							'</div>' +
						'</div>'
					);

					$("[rel=alt5]").tooltip({placement: 'left'});
					//$(this).css('height', $(this).height() + $('#editor' + numHead).height() );

					typeOfVar = "";
					$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
					$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

					/******************** editor *************************/
					CKEDITOR.disableAutoInline = false;
					CKEDITOR.inline( 'editor' + numHead, {
						toolbar: [
							{ name: 'lists', items: [ 'Outdent','Indent'] },
							{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr','BidiRtl'] },
							'/',
							{ name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript','Superscript'] },
							{ name: 'styles', items: ['Styles','Format'] },
							{ name: 'links', items: ['Link', 'Unlink'] },
							{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
						]
					});
					/******************* end editor **********************/
					//setTimeout(elementsBlockSorting, 5000);
					elementsBlockSorting();
				});

			}

			if(typeOfVar === 'Text'){
				$('div[data-value="charactersBlock"], div[data-value="charactersBlockCommon"]').hover(function(){

					findCurrentTextNumber();
					numText = addTextNum();

					$(this).append(
						'<div class="txtBlck textBlockStyle sortBlock" style="position: relative" data-value="sortBlock">' +
						'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
						'</a>' +
						'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
						'<i class="glyphicon glyphicon-trash settIcon" rel="alt6" title="Text"></i>' +
						'</a>' +
						'<div class="editable">' +
						'<div id="editorT' + numText + '" contenteditable="true">' +
						'<p style="text-align: center;">Please type text here.</p>' +
						'</div>' +
						'</div>' +
						'</div>'
					);

					$("[rel=alt6]").tooltip({placement: 'left'});
					//$(this).css('height', $(this).height() + $('#editorT' + numText).height() );

					typeOfVar = "";
					$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
					$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');

					/******************** editor *************************/
					CKEDITOR.disableAutoInline = true;
					CKEDITOR.inline( 'editorT' + numText, {
						toolbar: [
							{ name: 'lists', items: [ 'Outdent','Indent'] },
							{ name: 'paragraph', items: ['Blockquote', 'NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr','BidiRtl'] },
							{ name: 'forms', items : [ 'ImageButton' ] },
							'/',
							{ name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript','Superscript'] },
							{ name: 'styles', items: ['Styles'] },
							{ name: 'font', items: ['FontSize'] },
							{ name: 'links', items: ['Link', 'Unlink'] },
							{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
						]
					});
					/******************* end editor **********************/
					elementsBlockSorting();
				});
			}

			if(typeOfVar === 'Mail To Box'){
				$('div[data-value="charactersBlock"], div[data-value="charactersBlockCommon"]').hover(function(){

					findCurrentMailBoxNumber();
					numMail = addMailNum();

					if(numMail === 1) {

						$(this).append(
							'<div id="mailBoxBlock' + numMail + '" class="mtbBlck sortBlock" data-value="sortBlock">' +
							'<a onclick="catchMailBxBlock(this)" class="pull-right" data-toggle="modal" data-target="#mailModal" >' +
							'<i class="glyphicon glyphicon-cog settIcon" rel="alt7" title="Mail Box"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt8" title="Mail Box"></i>' +
							'</a>' +
							'<div class="emailMailto">' +
							'<a class="mailto" href="mailto:someone@someservice.com">Subscribe</a>' +
							'</div>' +
							'</div>'
						);

						$("[rel=alt7]").tooltip({placement: 'right'});
						$("[rel=alt8]").tooltip({placement: 'left'});
						//$(this).css('height', $(this).height() + $('#mailBoxBlock' + numMail).height());

						typeOfVar = "";
						$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');
						elementsBlockSorting();
					}
				});
			}

			if(typeOfVar === "Video"){
				$('div[data-value="charactersBlockCommon"]').hover(function(){

					findCurrentVideoNumber();
					numVd = addVideoNum();

					$(this).append(
						'<div id="videoBlock'+ numVd +'" class="videoBlockStyle sortBlock" data-value="sortBlock">' +
							'<a onclick="catchVdBlock(this)" class="pull-right numVdBlock" data-toggle="modal" data-target="#videoModal">' +
								'<i class="glyphicon glyphicon-cog settIcon" rel="alt9" title="Video"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" class="numVdBlock" data-toggle="modal" data-target="#cautionModal">' +
								'<i class="glyphicon glyphicon-trash settIcon" rel="alt10" title="Video"></i>' +
							'</a>' +
						'</div>'
					);

					$('#videoBlock'+ numVd).css({
						'background-image': 'url("/v2/img/icon-video.png")',
						'background-size': '7%',
						'background-position': '50% 50%',
						'background-repeat': 'no-repeat'
					});

					$("[rel=alt9]").tooltip({placement: 'right'});
					$("[rel=alt10]").tooltip({placement: 'left'});
					$(this).css('height', $(this).height() + $('#videoBlock'+ numVd).height() );

					typeOfVar = "";
					$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
					elementsBlockSorting();
				});

			}

			/********** components part **************/
			if(typeOfVar === ''){

				typeOfVarCmpnt = $(ui.draggable.context).attr('id');

				if(typeOfVarCmpnt === "draggableCmpnt1"){
					$('div[data-value="charactersBlockCommon"]').hover(function() {

						findCurrentThemeOneNumber();
						numth1 = addTheme1Num();

						$(this).append(
							'<div id="themeOne' + numth1 + '" class="resizableTheme imgBlockStyle imgDraggable drag sortBlock" data-value="charactersBlock">' +
							'<a onclick="catchImgBlock(this)" class="pull-right themeOne' + numth1 + '" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon" rel="alt11" title="Image"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt12" title="Image"></i>' +
							'</a>' +

							'<div class="hdBlck headBlockStyle sortBlock" style="position: relative" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt13" title="Headline"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeOneH' + numth1 + '" contenteditable="true">' +

							'<h2 style="text-align:center"><br></h2>' +
							'<h2 style="text-align:center">Many carefully crefted components</h2>' +
							'<h2 style="text-align:center"> to present your business.</h2>' +

							'</div>' +
							'</div>' +
							'</div>' +

							'<div class="txtBlck textBlockStyle sortBlock" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt14" title="Text"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeOneT' + numth1 + '" contenteditable="true">' +

							'<p style="text-align:center"><br></p>' +
							'<p style="text-align:center"><br></p>' +
							'<p style="text-align:center">Watch your video.</p>' +

							'</div>' +
							'</div>' +
							'</div>' +

							'</div>'
						);

						$("[rel=alt11]").tooltip({placement: 'right'});
						$("[rel=alt12]").tooltip({placement: 'left'});
						$("[rel=alt13]").tooltip({placement: 'left'});
						$("[rel=alt14]").tooltip({placement: 'left'});
						$(this).css( 'height', $(this).height() + $('#themeOne' + numth1).height() );

						typeOfVarCmpnt = "";
						$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlockBg"]').unbind('mouseenter mouseleave');

						$("#themeOne" + numth1).css('background-color', 'transparent').css({
							'height': '321px',
							'background-image': 'url(/v2/img/cmpnt1.png)',
							'background-size': 'contain',
							'background-position': 'center center',
							'background-repeat': 'no-repeat'
						});

						/******************** Headline editor *************************/
						CKEDITOR.disableAutoInline = false;
						CKEDITOR.inline('editorThemeOneH' + numth1, {
							toolbar: [
								{name: 'lists', items: ['Outdent', 'Indent']},
								{name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
								'/',
								{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
								{name: 'styles', items: ['Styles','Format']},
								{name: 'links', items: ['Link', 'Unlink']},
								{name: 'colors', items: ['TextColor', 'BGColor']}
							]
						});
						/******************* end editor **********************/

						/******************** Text editor *************************/
						CKEDITOR.inline('editorThemeOneT' + numth1, {
							toolbar: [
								{name: 'lists', items: ['Outdent', 'Indent']},
								{name: 'paragraph', items: ['Blockquote', 'NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl']},
								{name: 'forms', items: ['ImageButton']},
								'/',
								{name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript', 'Superscript']},
								{name: 'styles', items: ['Styles']},
								{name: 'font', items: ['FontSize']},
								{name: 'links', items: ['Link', 'Unlink']},
								{name: 'colors', items: ['TextColor', 'BGColor']}
							]
						});
						/******************* end editor **********************/

						componentsBlockResizing();
						componentsBlockSorting();
						elementsBlockSorting();
					});
				}

				if(typeOfVarCmpnt === "draggableCmpnt2"){
					$('div[data-value="charactersBlockCommon"]').hover(function() {

						findCurrentThemeTwoNumber();
						numth2 = addTheme2Num();

						$(this).append(
							'<div id="themeTwo'+ numth2 +'" class="resizableTheme imgBlockStyle imgDraggable drag sortBlock" data-value="charactersBlock">' +
							'<a onclick="catchImgBlock(this)" class="pull-right numBlock'+ numth2 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon" rel="alt15" title="Image"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt16" title="Image"></i>' +
							'</a>' +

							'<div class="hdBlck sortBlock" style="position: relative" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt17" title="Headline"></i>' +
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

						$("[rel=alt15]").tooltip({placement: 'right'});
						$("[rel=alt16]").tooltip({placement: 'left'});
						$("[rel=alt17]").tooltip({placement: 'left'});
						$(this).css( 'height', $(this).height() + $('#themeTwo'+ numth2).height() );

						typeOfVarCmpnt = "";
						$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlockBg"]').unbind('mouseenter mouseleave');

						$("#themeTwo"+ numth2).css({'background-color': '#503f72','height': '321px'});

						/******************** Headline editor *************************/
						CKEDITOR.disableAutoInline = false;
						CKEDITOR.inline( 'editorThemeTwoH' + numth2, {
							toolbar: [
								{ name: 'lists', items: [ 'Outdent','Indent'] },
								{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr','BidiRtl'] },
								'/',
								{ name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript','Superscript'] },
								{ name: 'styles', items: ['Styles','Format'] },
								{ name: 'links', items: ['Link', 'Unlink'] },
								{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
							]
						});
						/******************* end editor **********************/

						componentsBlockResizing();
						componentsBlockSorting();
						elementsBlockSorting();
					});
				}

				if(typeOfVarCmpnt === "draggableCmpnt3"){
					$('div[data-value="charactersBlockCommon"]').hover(function() {

						findCurrentTemeThreeNumber();
						numth3 = addTheme3Num();
						findCurrentHeadCmpntNumber();
						numth3Head = addTheme3HeadNum();
						findCurrentTextCmpntNumber();
						numth3Text = addTheme3TextNum();

						$(this).append(
							'<div id="themeThree'+ numth3 +'" class="resizableTheme imgBlockStyle imgDraggable drag sortBlock" data-value="charactersBlock">' +
							'<a onclick="catchImgBlock(this)" class="pull-right themeThree'+ numth3 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon" rel="alt18" title="Image"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt19" title="Image"></i>' +
							'</a>' +
							/*********** Headline 1 ************/
							'<div class="hdBlck headCmpntBlockStyle sortBlock" style="position: relative" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt20" title="Headline"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeThreeH'+ numth3Head[0] +'" contenteditable="true">' +

							'<h1><br></h1>' +
							'<h1 style="text-align:center"><strong>Built to impress<strong></h1>' +
							'<h1></h1>' +

							'</div>' +
							'</div>' +
							'</div>' +
							/************ Headline 2 ***********/
							'<div class="hdBlck headCmpntBlockStyle sortBlock" style="position: relative" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt21" title="Headline"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeThreeH'+ numth3Head[1] +'" contenteditable="true">' +

							'<h3><br></h3>' +
							'<h3 style="margin-left: 40px;"><strong>Build quick</strong></h3>' +
							'<p><strong></strong></p>' +

							'</div>' +
							'</div>' +
							'</div>' +
							/************ Text 1 ***********/
							'<div class="txtBlck textCmpntBlockStyle sortBlock" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt22" title="Text"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeThreeT'+ numth3Text[0] +'" contenteditable="true">' +

							'<p style="margin-left: 40px;">Get butiful site up and running in no<br></p>' +
							'<p style="margin-left: 40px;"> time. Just choose component you like and<br></p>' +
							'<p style="margin-left: 40px;"> start tweaking it.</p>' +

							'</div>' +
							'</div>' +
							'</div>' +
							/*********** Headline 3 ************/
							'<div class="hdBlck headCmpntBlockStyle sortBlock" style="position: relative" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt23" title="Headline"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeThreeH'+ numth3Head[2] +'" contenteditable="true">' +

							'<h3><br></h3>' +
							'<h3 style="margin-left: 40px;"><strong>Instructions manual</strong></h3>' +
							'<p><strong></strong></p>' +

							'</div>' +
							'</div>' +
							'</div>' +
							/************ Text 2 ***********/
							'<div class="txtBlck textCmpntBlockStyle sortBlock" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt24" title="Text"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeThreeT'+ numth3Text[1] +'" contenteditable="true">' +

							'<p style="margin-left: 40px;">Get started immediately with clear setup<br></p>' +
							'<p style="margin-left: 40px;"> instructions and a comprehensive help<br></p>' +
							'<p style="margin-left: 40px;"> guide with useful examples.</p>' +

							'</div>' +
							'</div>' +
							'</div>' +

							'</div>'
						);

						$("[rel=alt18]").tooltip({placement: 'right'});
						$("[rel=alt19]").tooltip({placement: 'left'});
						$("[rel=alt20]").tooltip({placement: 'left'});
						$("[rel=alt21]").tooltip({placement: 'left'});
						$("[rel=alt22]").tooltip({placement: 'left'});
						$("[rel=alt23]").tooltip({placement: 'left'});
						$("[rel=alt24]").tooltip({placement: 'left'});
						$(this).css( 'height', $(this).height() + $('#themeThree'+ numth3).height() );

						typeOfVarCmpnt = "";
						$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlockBg"]').unbind('mouseenter mouseleave');

						/******************** Headline editor *************************/
						$.each(numth3Head, function (i, areaH) {

							CKEDITOR.disableAutoInline = false;
							CKEDITOR.inline( 'editorThemeThreeH' + areaH, {
								toolbar: [
									{ name: 'lists', items: [ 'Outdent','Indent'] },
									{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr','BidiRtl'] },
									'/',
									{ name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript','Superscript'] },
									{ name: 'styles', items: ['Styles','Format'] },
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
									{ name: 'lists', items: [ 'Outdent','Indent'] },
									{ name: 'paragraph', items: ['Blockquote', 'NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr','BidiRtl'] },
									{ name: 'forms', items : [ 'ImageButton' ] },
									'/',
									{ name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript','Superscript'] },
									{ name: 'font', items: ['FontSize'] },
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
						elementsBlockSorting();
					});
				}

				if(typeOfVarCmpnt === "draggableCmpnt4"){
					$('div[data-value="charactersBlockCommon"]').hover(function() {

						findCurrentThemeFourNumber();
						numth4 = addTheme4Num();

						$(this).append(
							'<div id="themeFour'+ numth4 +'" class="resizableTheme imgBlockStyle imgDraggable drag sortBlock" data-value="charactersBlock">' +
							'<a onclick="catchImgBlock(this)" class="pull-right themeFour'+ numth4 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon" rel="alt25" title="Image"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt26" title="Image"></i>' +
							'</a>' +

							'<div class="hdBlck sortBlock" style="position: relative" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#headModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt27" title="Headline"></i>' +
							'</a>' +
							'<div class="editable">' +
							'<div id="editorThemeFourH' + numth4 + '" contenteditable="true">' +

							'<h4 style="text-align: center;"><strong></strong>&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;<br></h4>' +
							'<h1 style="text-align: center"><strong>GET YOUR COPY TODAY</strong></h1>' +
							'<p><strong></strong><br></p>' +

							'</div>' +
							'</div>' +
							'</div>' +

							'<div id="mailBoxCmpnt'+ numth4 +'" class="mtbBlck" data-value="sortBlock">' +
							'<a onclick="catchMailBxBlock(this)" class="pull-right" data-toggle="modal" data-target="#mailModal" >' +
							'<i class="glyphicon glyphicon-cog settIcon" rel="alt28" title="Mail Box"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt29" title="Mail Box"></i>' +
							'</a>' +

							'<div class="emailMailto">' +
							'<a class="mailto" href="mailto:someone@someservice.com">Subscribe</a>' +
							'</div>' +
							'</div>' +

							'</div>'
						);

						$("[rel=alt25]").tooltip({placement: 'right'});
						$("[rel=alt26]").tooltip({placement: 'left'});
						$("[rel=alt27]").tooltip({placement: 'left'});
						$("[rel=alt28]").tooltip({placement: 'right'});
						$("[rel=alt29]").tooltip({placement: 'left'});
						$(this).css( 'height', $(this).height() + $('#themeFour'+ numth4).height() );

						typeOfVarCmpnt = "";
						$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlockBg"]').unbind('mouseenter mouseleave');

						$("#themeFour"+ numth4).css({'background-color': '#c23e8c','height': '235px'});
						$("#themeFour"+ numth4+" a.mailto").css({'color': '#c23e8c'});

						/******************** Headline editor *************************/
						CKEDITOR.disableAutoInline = false;
						CKEDITOR.inline( 'editorThemeFourH' + numth4, {
							toolbar: [
								{ name: 'lists', items: [ 'Outdent','Indent'] },
								{ name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr','BidiRtl'] },
								'/',
								{ name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript','Superscript'] },
								{ name: 'styles', items: ['Styles','Format'] },
								{ name: 'links', items: ['Link', 'Unlink'] },
								{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
							]
						});
						/******************* end editor **********************/

						componentsBlockResizing();
						componentsBlockSorting();
						elementsBlockSorting();
					});
				}

				if(typeOfVarCmpnt === "draggableCmpnt5"){
					$('div[data-value="charactersBlockCommon"]').hover(function() {

						findCurrentThemeFiveNumber();
						numth5 = addTheme5Num();

						$(this).append(
							'<div id="themeFive'+ numth5 +'" class="resizableTheme imgBlockStyle imgDraggable drag sortBlock" data-value="charactersBlock">' +
							'<a onclick="catchImgBlock(this)" class="pull-right themeFive'+ numth5 +'" data-toggle="modal" data-target="#imageModal">' +
							'<i class="glyphicon glyphicon-cog settIcon" rel="alt30" title="Image"></i>' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt31" title="Image"></i>' +
							'</a>' +

							'<div class="txtBlck sortBlock" data-value="sortBlock">' +
							'<a class="pull-right" data-toggle="modal" data-target="#textModal">' +
							'</a>' +
							'<a onclick="delDropedElem(this)" data-toggle="modal" data-target="#cautionModal">' +
							'<i class="glyphicon glyphicon-trash settIcon" rel="alt32" title="Text"></i>' +
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

						$("[rel=alt30]").tooltip({placement: 'right'});
						$("[rel=alt31]").tooltip({placement: 'left'});
						$("[rel=alt32]").tooltip({placement: 'left'});
						$(this).css( 'height', $(this).height() + $('#themeFive'+ numth5).height() );

						typeOfVarCmpnt = "";
						$('div[data-value="charactersBlockCommon"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlock"]').unbind('mouseenter mouseleave');
						$('div[data-value="charactersBlockBg"]').unbind('mouseenter mouseleave');

						$("#themeFive"+ numth5).css({'background-color': '#d83a3a','height': '321px'});

						/******************** Text editor *************************/
						CKEDITOR.disableAutoInline = false;
						CKEDITOR.inline( 'editorThemeFiveT' + numth5, {
							toolbar: [
								{ name: 'lists', items: [ 'Outdent','Indent'] },
								{ name: 'paragraph', items: ['Blockquote', 'NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr','BidiRtl'] },
								{ name: 'forms', items : [ 'ImageButton' ] },
								'/',
								{ name: 'basicstyles', items: ['Bold', 'Italic', 'Subscript','Superscript'] },
								{ name: 'font', items: ['FontSize'] },
								{ name: 'links', items: ['Link', 'Unlink'] },
								{ name: 'colors', items: [ 'TextColor', 'BGColor' ] }
							]
						});
						/******************* end editor **********************/

						componentsBlockResizing();
						componentsBlockSorting();
						elementsBlockSorting();
					});
				}

			}
		}
	});
	/******** end droppable ********/

	/*************** END OF PAGE AND END OF document.ready*****************/
});

/* integration part*/

function removeCustomTemplate() {
	$('.mngView').remove('.mngView');
	$('.rightView').css('padding', '0');
	$('.highlight').css('background', '#f9f8f8');
}