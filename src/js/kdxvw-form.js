// CUSTOM CHECKBOX/RADIO
function customCheck(checkTarget){
    if(checkTarget.is(':checked')){
            if(checkTarget.is(':radio')){
            checkTarget.parent().siblings('.kdxvw-form__gender-radio').removeClass('kdxvw_checked');
            checkTarget.parents('.js_kdxvw_radiogroup').find('.js_kdxvw_custom_check').removeClass('kdxvw_checked');
        }
        checkTarget.parent().addClass('kdxvw_checked');
    }
    else{
        checkTarget.parent().removeClass('kdxvw_checked');
    }
}


// CUSTOM SCROLL FUNCTIONS
function customscrollInit(custoscrollTarget){                
    custoscrollTarget.mCustomScrollbar({
        advanced:{
            updateOnContentResize: true
        }
    });
}


// CUSTOM SCROLL
$(window).load(function(){
    customscrollInit($(".js_kdxvw_customscroll"));
});
//=================================================


$(document).ready(function(){



$(".js_phonemask").mask("+7 (999) 999-9999");



// CHOSEN


$('.js-kdxvw-chosen').each(function(){
    var placeholderTxt = $(this).find('option:first').text();
    if ($(this).attr('data-search')) {
        var diasbleSearch = false;
    }
    else {
        var diasbleSearch = true;
    }

    $(this).chosen({
        width: "100%",
        disable_search: diasbleSearch,
        placeholder_text_single: placeholderTxt,
        no_results_text: "Нет результатов по"
    });
});

//custom scroll in select
customscrollInit($(".chosen-results-wrapper"));



// ==================================



// CUSTOM CHECKBOX/RADIO
$('.js_kdxvw_custom_check [disabled]').parent().addClass('disabled');
// check defaults or F5
$('.js_kdxvw_custom_check input').each(function(){
    customCheck($(this));
});

// on change
$(document).on('change','.js_kdxvw_custom_check input',function(){
    customCheck($(this));
});

$(document).on('focus','.js_kdxvw_custom_check input',function(){
    $(this).parent().addClass('focus');
});
$(document).on('blur','.js_kdxvw_custom_check input',function(){
    $(this).parent().removeClass('focus');
});

// ==========================================


// SLIDE DOWN
$(document).on('click','.js_kdxvw_slidedown',function(){
    var slideTarget = $(this).attr('data-target');
    $(slideTarget).slideToggle(500).toggleClass('kdxvw-active');
});


// SHOW INNER 
$(document).on('click','.js_kdxvw_showinner',function(){
    if(!$(this).hasClass('.kdxvw-active')){
        if($('.kdxvw-form__holder').length) {
            var kdxvwformWidth = $('.kdxvw-form__holder').width();
        }
        else { kdxvwformWidth = 320 }
        $(this).addClass('.kdxvw-active').find('.js_kdxvw_inner').width(kdxvwformWidth-87).show(300);
    }
    else {
        $(this).removeClass('.kdxvw-active').find('.js_kdxvw_inner').hide(300);    
    }    
});



// crossbrowser placeholder in forms
if($('.no-placeholder').length) {
    
    $('input,textarea').each(function(){
        if($(this).attr('placeholder')){$(this).addClass('placeholder');}
    });
    
    $('input[type=password]').addClass('password');
        
    var phTarget = $('input.placeholder, textarea.placeholder');
    
    phTarget.each(function(){        
        if($(this).val() == '') {
            thisPlaceholder = $(this).attr('placeholder');
            $(this).val(thisPlaceholder);
        }
    });
    
    phTarget.focus(function(){
        if($(this).val() == $(this).attr('placeholder')) {
            $(this).val('');                
        }
    });
    phTarget.blur(function(){
        if($(this).val() == '') {
            thisPlaceholder = $(this).attr('placeholder');
            $(this).val(thisPlaceholder);                
        }
    });
    
    phTarget.parents('form').submit(function(){
        if($(this).val() == $(this).attr('placeholder')) {
//                return false;
        }
    });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



    /*
    * Dealers list handlers start
    */
    $('body').on("click", function(el){
        if($(el.target).parents('#dlrs_list_wrapper').length === 0 && $('.kdxvw-check__select').hasClass('check-with-drop'))
            $('.kdxvw-check__select').removeClass('check-with-drop');
    });

    $(".kdxvw-check__selected").on("click", function (e) {
        if($(this).parents(".kdxvw-check__select").hasClass('disabled-select') === false)
            $(this).parents(".kdxvw-check__select").toggleClass("check-with-drop");

        e.stopImmediatePropagation();
        e.preventDefault();
    });


    $(".check-el").on("click", function(e){
        if($('#dlrs_list_wrapper input[name="dlrs-list"][data-city="'+current_city+'"]').length == $('#dlrs_list_wrapper input[name="dlrs-list"][data-city="'+current_city+'"]:checked').length) {
            $("#all").prop("checked", true);
        } else {
            $("#all").prop("checked", false);
        }
    });

    $("#all").on("click", function(e){
        if($('#dlrs_list_wrapper input[name="dlrs-list"][data-city="'+current_city+'"]').length === $('#dlrs_list_wrapper input[name="dlrs-list"][data-city="'+current_city+'"]:checked').length){
            $('#dlrs_list_wrapper input[name="dlrs-list"][data-city="'+current_city+'"]').prop("checked", false).removeAttr("checked");
        }
        else{
            $('#dlrs_list_wrapper input[name="dlrs-list"][data-city="'+current_city+'"]').prop("checked", true).attr("checked", "checked");
        }

        e.stopImmediatePropagation();
    });


    $('select[name="city"]').on('change', function(){
        current_city = $(this).val();

        $('#dlrs_list_wrapper input[name="dlrs-list"]').prop("checked", false).removeAttr("checked").parent().hide();
        $('#dlrs_list_wrapper .kdxvw-check__selected label span').html('Не выбрано');

        if(!$('#dlrs_list_wrapper').hasClass('disabled-select'))
            $('#dlrs_list_wrapper').addClass('disabled-select');

        if(current_city !== 'empty'){
            var objDomElementsList = $('#dlrs_list_wrapper input[name="dlrs-list"][data-city="'+current_city+'"]');

            if(typeof objDomElementsList === 'object' && objDomElementsList.length > 0){
                objDomElementsList.prop("checked", false).removeAttr("checked").parent().show();

                if(objDomElementsList.length > 1){
                    $('#dlrs_list_wrapper').removeClass('disabled-select');
                    $('#dlrs_list_wrapper .kdxvw-check__selected label span').html('Все дилеры');
                } else {
                    var dealerName = $(objDomElementsList[0]).siblings('span').html();

                    objDomElementsList.prop("checked", true).attr("checked", "checked");

                    if(typeof dealerName === 'string' && dealerName.length > 0)
                        $('#dlrs_list_wrapper .kdxvw-check__selected label span').html(dealerName);
                }
            }
        }
    });

    customscrollInit($(".kdxvw-check__drop"));
    /*
    * Dealers list handlers end
    */




});
