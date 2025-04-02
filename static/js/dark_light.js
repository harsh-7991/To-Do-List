
$(document).ready(function(){


    const theme_btn_ui = `    <!-- Dark Mode Button -->

    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="moon-stars-fill" viewBox="0 0 16 16">
        <path
            d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z">
        </path>
        <path
            d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z">
        </path>
        </symbol>
        <symbol id="sun-fill" viewBox="0 0 16 16">
        <path
            d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z">
        </path>
        </symbol>
    </svg>

    <div id="div_day_night_mode" class="div_day_night_mode">
        <button id="day_night_mode_btn" class="day_night_mode_btn" title="Change Between Day and Night Mode" data-day-night-mode="none">
        <div id="div_day_mode" class="div_day_mode">
            <svg class="day_icon_svg"><use href="#sun-fill"></use></svg>
        </div>

        <div id="div_night_mode" class="div_night_mode">
            <svg class="night_icon_svg"><use href="#moon-stars-fill"></use></svg>
        </div>
        </button>

    </div>`;

	let dark_ui_present = $("#div_theme_btn_cont").length;

	if(dark_ui_present == 0 && dark_ui_present < 1) {
		$("body").append(theme_btn_ui);
	}

    if(!Cookies.get("theme")){
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // dark mode
            Cookies.set("theme", "night");
        }else{
            Cookies.set("theme", "day");
        }
    }

});




$(document).ready(function(){

	let day_night_mode_state;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const current_os_theme = e.matches ? "dark" : "light";
        if(current_os_theme == "dark"){
            $("#div_night_mode").css("display", "none");
            $("#div_day_mode").css("display", "flex");
            $("#day_night_mode_btn").attr("data-day-night-mode", "day");
            day_night_mode_state = "day";
            $("html").attr("data-bs-theme","");
            $("form").attr("data-bs-theme","");
            switch_theme();
        }else
        if(current_os_theme == "light"){
            $("#div_night_mode").css("display", "flex");
            $("#div_day_mode").css("display", "none");
            $("#day_night_mode_btn").attr("data-day-night-mode", "night");
            day_night_mode_state = "night";
            $("html").attr("data-bs-theme","dark");
            $("form").attr("data-bs-theme","dark");
            switch_theme();
        }
    });


	// const default_theme = "night";
	const default_theme = Cookies.get('theme');

	const dic_element_style = [
								{"id" : "body", "dark_class" : "body_dark",},
								{"id" : "form", "dark_class" : "form_dark",},
								{"id" : "svg", "dark_class" : "icon_svg_dark",},

								{"id" : "#div_nav_bar", "dark_class" : "div_nav_bar_dark",},
								{"id" : ".a_logo_text_link", "dark_class" : "a_logo_text_link_dark",},

								{"id" : "#div_side_menu", "dark_class" : "div_side_menu_dark",},
								{"id" : "#div_tab_container", "dark_class" : "div_tab_container_dark",},
								{"id" : "#thead_task_list_tb", "dark_class" : "thead_task_list_tb_dark",},
								{"id" : "#thead_task_history_list_tb", "dark_class" : "thead_task_list_tb_dark",},
								{"id" : "#div_task_list_head_btn_strip", "dark_class" : "div_task_list_head_btn_strip_dark",},
								{"id" : "#div_task_list_history_head_btn_strip", "dark_class" : "div_task_list_head_btn_strip_dark",},
								{"id" : "#div_profile_edit_btn_strip", "dark_class" : "div_profile_edit_btn_strip_dark",},


								// {"id" : "form", "dark_class" : "form_dark",},

							];


	if(default_theme == "night"){
		$("#div_night_mode").css("display", "none");
		$("#div_day_mode").css("display", "flex");
		$("#day_night_mode_btn").attr("data-day-night-mode", "day");
		day_night_mode_state = "day";
        $("html").attr("data-bs-theme","");
		$("form").attr("data-bs-theme","");
		switch_theme();
	}else
	if(default_theme == "day"){
		$("#div_night_mode").css("display", "flex");
		$("#div_day_mode").css("display", "none");
		$("#day_night_mode_btn").attr("data-day-night-mode", "night");
		day_night_mode_state = "night";
        $("html").attr("data-bs-theme","dark");
		$("form").attr("data-bs-theme","dark");
		switch_theme();
	}

	// Variables
	// Day NIght Mode Onclick Even Function
	$("#day_night_mode_btn").click(function(){
		const day_night_btn = $("#day_night_mode_btn");
        day_night_btn.addClass("div_disabled");
		switch_theme();
        day_night_btn.removeClass("div_disabled");
	});

	// Theme Switcher Function
	function switch_theme(){
		//console.log("Enter in Function");

		const day_night_btn = $("#day_night_mode_btn");
		const btn_mode_data = day_night_btn.attr("data-day-night-mode");
        day_night_btn.addClass("div_disabled");


		if(btn_mode_data == "night" && day_night_mode_state == "night"){
			//console.log("night detected");

            $("#div_day_mode").css("display", "none");
			$("#div_night_mode").css("display", "flex");
            $("#div_day_night_mode").css("background-color", "#ffffff");
			day_night_btn.attr("data-day-night-mode", "day");
			day_night_mode_state = "day";

			const len = dic_element_style.length - 1;

			for(var i = 0; i <= len ; i++) {
				//console.log(i);
				const id = dic_element_style[i].id;
				const dark_class = dic_element_style[i].dark_class;
				$(id).removeClass(dark_class);

			}

			const ignore_element_list = $("[data-ignore-day-theme]");
			// console.log(ignore_element_list);

			for(let i = 0; i < ignore_element_list.length; i++){
				const this_tag_obj = ignore_element_list[i];
				const tag_name = ignore_element_list[i]["tagName"];

				if(tag_name == "svg"){
					$(this_tag_obj).addClass("icon_svg_dark");
				}
			}

			$("html").attr("data-bs-theme","");
			$("form").attr("data-bs-theme","");
            Cookies.set("theme", "day");


			//return;
		}else
		if(btn_mode_data == "day" && day_night_mode_state == "day"){
			//console.log("Day Detected");

			$("#div_night_mode").css("display", "none");
			$("#div_day_mode").css("display", "flex");
            $("#div_day_night_mode").css("background-color", "#000000");
			day_night_btn.attr("data-day-night-mode", "night");
			day_night_mode_state = "night";

			const len = dic_element_style.length - 1;

			for(var i = 0; i <= len ; i++) {
				//console.log(i);
				const id = dic_element_style[i].id;
				const dark_class = dic_element_style[i].dark_class;
				$(id).addClass(dark_class);

			}

			const ignore_element_list = $("[data-ignore-night-theme]");
			// console.log(ignore_element_list);

			for(let i = 0; i < ignore_element_list.length; i++){
				const this_tag_obj = ignore_element_list[i];
				const tag_name = ignore_element_list[i]["tagName"];

				if(tag_name == "svg"){
					$(this_tag_obj).removeClass("icon_svg_dark");
				}
			}


			$("html").attr("data-bs-theme","dark");
			$("form").attr("data-bs-theme","dark");
            Cookies.set("theme", "night");


			//return;
		}else{
			//console.log("else detected");

			$("#div_night_mode").css("display", "none");
			$("#div_day_mode").css("display", "flex");
			day_night_btn.attr("data-day-night-mode", "day");
			day_night_mode_state = "day";

			$("html").attr("data-bs-theme","");
			$("form").attr("data-bs-theme","");
            Cookies.set("theme", "day");

			//return;
		}

        day_night_btn.removeClass("div_disabled");
	}



});













