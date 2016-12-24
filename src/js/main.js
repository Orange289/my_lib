$(".calculation__open").on("click", function(){
	$(this).toggleClass("calculation__open--open");
	$(this).parents(".calculation__item").find(".calculation__content").slideToggle("fast");
});
