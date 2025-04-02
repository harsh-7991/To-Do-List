$(document).ready(function(){

    const btn_side_menu = $("#btn_left_side_nav_bar");
    const div_side_menu = $("#div_side_menu");

    const div_tab_container = $("#div_tab_container");

    // checkin if cookie exist or not and update from cookie data at start of page loading
    if(Cookies.get("side_nav_menu")){
        if(Cookies.get("side_nav_menu") == "closed") {
            btn_side_menu.attr("data-state","opened");
            Cookies.set("side_nav_menu", "opened");
            side_nav_menu_toggle();
        }else
        if(Cookies.get("side_nav_menu") == "opened") {
            btn_side_menu.attr("data-state","closed");
            Cookies.set("side_nav_menu", "closed");
            side_nav_menu_toggle();
        }
    }else{
        btn_side_menu.attr("data-state","opened");
        Cookies.set("side_nav_menu", "opened");
        side_nav_menu_toggle();
    }

    // Side Menu Toggle Button Click Event Listener
    btn_side_menu.click(function(){
        btn_side_menu.addClass("div_disabled");
        side_nav_menu_toggle();
        btn_side_menu.removeClass("div_disabled");
    });


    // Fuction to toggle side menu
    function side_nav_menu_toggle(){
        const menu_state = btn_side_menu.attr("data-state");
        btn_side_menu.addClass("div_disabled");
        const side_menu_state = Cookies.get("side_nav_menu");

        if (menu_state == "opened" && side_menu_state == "opened"){
            div_tab_container.removeClass("div_tab_container_shrink")
            div_side_menu.removeClass("show_side_nav");
            btn_side_menu.attr("data-state","closed");
            Cookies.set("side_nav_menu", "closed");
        }

        if (menu_state == "closed" && side_menu_state == "closed"){
            div_tab_container.addClass("div_tab_container_shrink")
            div_side_menu.addClass("show_side_nav");
            btn_side_menu.attr("data-state","opened");
            Cookies.set("side_nav_menu", "opened");

        }
        btn_side_menu.removeClass("div_disabled");
    }



    // Setting Current Time and Date to input type date and time
    $('#btn_add_new_task').click(function(){
        const date_today = new Date();
        // console.log(date_today.toTimeString());
        // console.log(date_today.toTimeString().substring(0,8));
        $('#input_start_date').val(date_today.toISOString().substring(0,10));
        $('#input_start_time').val(date_today.toTimeString().substring(0,5));
        return;

    });


});



$(document).ready(function(){


    function get_url_parameter(search_string) {
        var parse = function (params, pairs) {
            var pair = pairs[0];
            var parts = pair.split('=');
            var key = decodeURIComponent(parts[0]);
            var value = decodeURIComponent(parts.slice(1).join('='));
            // Handle multiple parameters of the same name
            if (typeof params[key] === "undefined") {
                params[key] = value;
            } else {
                params[key] = [].concat(params[key], value);
            }
            return pairs.length == 1 ? params : parse(params, pairs.slice(1))
        }
        // Get rid of leading ?
        return search_string.length == 0 ? {} : parse({}, search_string.substr(1).split('&'));
    }

    function update_url(key, value){
        // URL: https://example.com?version=1.0
        const params = new URLSearchParams(location.search);
        params.set(key, value);
        window.history.replaceState({}, '', `${location.pathname}?${params}`);
        // URL: https://example.com?version=2.0
    }

    function title(title){
        const a = title;
        if (a == null) {
            return document.title;
        } else
        if(a != null) {
            return document.title = a;
        }
    }

    let current_page_tab;
    let active_tab_tracker = {
                                "profile":	    false,
                                "profile_edit": false,
                                "task_list":    false,
                                "history":	    false,
                            };


    const page_url = location.search;
    const url_param = get_url_parameter(page_url);
    const tab_para = url_param['tab'];

    if(tab_para != undefined && tab_para.length != 0){
        tab_selector(tab_para);
    }else{
        tab_selector("task_list");
    }


    // Tab Button Event Listener Handlers
    $("#a_user_name_dp").click(function(event){
        event.preventDefault();
        tab_selector("profile");
        return;
    });

    $("#a_tab_link_profie_edit").click(function(event){
        event.preventDefault();
        tab_selector("profile_edit");
        return;
    });

    $("#a_tab_link_task").click(function(event){
        event.preventDefault();
        tab_selector("task_list");
        return;
    });

    $("#a_tab_link_history").click(function(event){
        event.preventDefault();
        tab_selector("history");
        return;
    });



    function tab_selector(tab_name){

        const tab_container_id_dic = {
                        profile: 	    "#div_tab_profile",
                        profile_edit:   "#div_tab_profile_edit",
                        task_list: 	    "#div_tab_task_list",
                        history: 	    "#div_tab_history",
                        };

        const tab_btn_id_dic = {
                        profile: 	    "#div_user_name_dp",
                        profile_edit:   "#li_tab_link_profile_edit",
                        task_list: 	    "#li_tab_link_task",
                        history: 	    "#li_tab_link_history",
                        };

        const current_tab_div_id = ""+tab_container_id_dic[current_page_tab];
        $(current_tab_div_id).css("display", "none");

        if(current_page_tab === "profile" || current_page_tab === "profile_edit"){
            // $("#div_tab_link_list_profile_links").css("display", "none");
            $("#div_tab_link_list_profile_links").hide();
        }

        active_tab_tracker[current_page_tab] = false;

        const current_tab_btn_id = ""+tab_btn_id_dic[current_page_tab];
        $(current_tab_btn_id).removeClass("active_tab_btn");

        if(tab_name === "profile"){
            profile_tab_render();
            active_tab_tracker.profile = true;
            current_page_tab = "profile";
            // $("#div_tab_link_list_profile_links").css("display", "flex");
            $("#div_tab_link_list_profile_links").show();
            $("#div_user_name_dp").addClass("active_tab_btn");
            $("#spn_tab_name_navbar").text("Profile");
            return;
        }

        if(tab_name === "profile_edit"){
            profile_edit_tab_render();
            active_tab_tracker.profile_edit = true;
            current_page_tab = "profile_edit";
            // $("#div_tab_link_list_profile_links").css("display", "flex");
            $("#div_tab_link_list_profile_links").show();
            $("#li_tab_link_profile_edit").addClass("active_tab_btn");
            $("#spn_tab_name_navbar").text("Profile Edit");
            return;
        }

        if(tab_name === "task_list"){
            task_list_tab_render();
            active_tab_tracker.task_list = true;
            current_page_tab = "task_list";
            $("#li_tab_link_task").addClass("active_tab_btn");
            $("#spn_tab_name_navbar").text("Task List");

            return;
        }

        if(tab_name === "history"){
            history_tab_render();
            active_tab_tracker.history = true;
            current_page_tab = "history";
            $("#li_tab_link_history").addClass("active_tab_btn");
            $("#spn_tab_name_navbar").text("History");

            return;
        }


    }

    // Profile Tab
    function profile_tab_render(){
        const page_title = "Profile";
        title(page_title);

        update_url("tab", "profile");
        const div_tab_profile = $("#div_tab_profile");
        // const tab_body = `<span>This Profile Tab</span>`;

        if(div_tab_profile.attr("data-tab-ui-state") == "null"){
            // div_tab_profile.append(tab_body);
            div_tab_profile.attr("data-tab-ui-state", "loaded");
        }

        div_tab_profile.css("display", "flex");


        $.ajax({

            url: "/profile",

            beforeSend: function(){
                // const loading_div = $("#div_tab_profile");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_profile">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_tab_profile").append(loading_block);
            },

            success: function(result){
                // console.log(result);
                profile_tab_ui_render(result);
                // toast_notify("profile_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_profile").remove();
            },

        });

        div_tab_profile.css("display", "flex");


    }


    function profile_tab_ui_render(profile_data) {
        const data = profile_data[0];

        if($("#div_profile_info_container")){
            $("#div_profile_info_container").remove();
        }

        // console.log(data);

        const id = data.id;
        const fname = data.first_name;
        const lname = data.last_name;
        const email = data.email;
        const address = data.address;
        const profile_picture_url = data.profile_picture_url;


        const profile_html_block = `<div id="div_profile_info_container" class="div_profile_info_container">

                                        <div id="div_profile_picture_and_name" class="div_profile_picture_and_name">
                                            <div id="div_profile_img_container" class="div_profile_img_container">
                                                <img id="img_profile_user_picture" class="img_profile_user_picture" src="${profile_picture_url}"/>
                                            </div>
                                            <div id="div_profile_full_name" class="div_profile_full_name">
                                                <span id="span_profile_full_name" class="span_profile_full_name">${fname+" "+lname}</span>
                                            </div>
                                        </div>

                                        <div class="div_line_divider" id=""></div>

                                        <div id="div_profile_all_info" class="div_profile_all_info">
                                            <div id="div_profile_info_id" class="div_profile_info_grp div_profile_info_id">
                                                <span id="span_profile_info_type_id" class="span_profile_info_type">ID :</span>
                                                <span id="span_profile_user_info_id" class="span_profile_user_info">${id}</span>
                                            </div>

                                            <div id="div_profile_info_fname" class="div_profile_info_grp div_profile_info_fname">
                                                <span id="span_profile_info_type_fname" class="span_profile_info_type">First Name :</span>
                                                <span id="span_profile_user_info_fname" class="span_profile_user_info">${fname}</span>
                                            </div>

                                            <div id="div_profile_info_lname" class="div_profile_info_grp div_profile_info_lname">
                                                <span id="span_profile_info_type_lname" class="span_profile_info_type">Last Name :</span>
                                                <span id="span_profile_user_info_lname" class="span_profile_user_info">${lname}</span>
                                            </div>

                                            <div id="div_profile_info_email" class="div_profile_info_grp div_profile_info_email">
                                                <span id="span_profile_info_type_email" class="span_profile_info_type">Email :</span>
                                                <span id="span_profile_user_info_email" class="span_profile_user_info">${email}</span>
                                            </div>

                                            <div id="div_profile_info_address" class="div_profile_info_grp div_profile_info_address">
                                                <span id="span_profile_info_type_address" class="span_profile_info_type">Address :</span>
                                                <span id="span_profile_user_info_address" class="span_profile_user_info">${address}</span>
                                            </div>

                                        </div>


                                    </div>`;


        $("#div_tab_profile").append(profile_html_block);


    }




    // Profile Edit Tab
    function profile_edit_tab_render(){
        const page_title = "Profile Edit";
        title(page_title);

        update_url("tab", "profile_edit");
        const div_tab_profile_edit = $("#div_tab_profile_edit");
        // const tab_body = `<span>This Profile Edit Tab</span>`;

        if(div_tab_profile_edit.attr("data-tab-ui-state") == "null"){
            // div_tab_profile_edit.append(tab_body);
            div_tab_profile_edit.attr("data-tab-ui-state", "loaded");
        }


        div_tab_profile_edit.css("display", "flex");


        $.ajax({

            url: "/profile",

            beforeSend: function(){
                // const loading_div = $("#div_tab_profile_edit");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_profile">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_tab_profile_edit").append(loading_block);
            },

            success: function(result){
                // console.log(result);
                profile_edit_tab_ui_render(result);
                // toast_notify("profile_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_profile").remove();
            },

        });



        div_tab_profile_edit.css("display", "flex");



    }


    // Profile Edit Tab UI Render
    function profile_edit_tab_ui_render(profile_data){
        console.log(profile_data);
        const data = profile_data[0];

        if($("#div_profile_edit_container_wrapper")){
            $("#div_profile_edit_container_wrapper").remove();
        }

        // console.log(data);

        const id = data.id;
        const fname = data.first_name;
        const lname = data.last_name;
        const email = data.email;
        const address = data.address;
        const profile_picture_url = data.profile_picture_url;


        const profile_html_block = `<div class="div_profile_edit_container_wrapper" id="div_profile_edit_container_wrapper">

                                        <div id="div_profile_edit_btn_strip" class="div_profile_edit_btn_strip">
                                            <div id="" class="div_task_list_head">
                                                <span id="" class="spn_task_list_head">Task List</span>
                                            </div>

                                            <div id="div_profile_edit_btns" class="div_profile_edit_btns">

                                                <div id="div_profile_edit_save_btn" class="div_profile_edit_save_btn">
                                                    <button id="btn_profile_edit_save" class="btn btn_icon2 bg_clr_light_green crl_white brdr_1px btn-sm btn-outline-success" title="Save Changes">
                                                        <div class="div_btn_icon2_cont">
                                                            <svg class="icon_svg icon_svg_dark" data-ignore-day-theme="true">
                                                                <use xlink:href="#icon-save"></use>
                                                            </svg>
                                                            <span class="btn_icon2_sp_text">Save</span>
                                                        </div>
                                                    </button>
                                                </div>

                                            </div>

                                        </div>


                                        <div id="div_profile_info_container" class="div_profile_info_container">

                                            <div id="div_profile_edit_profile_picture" class="div_profile_edit_profile_picture">
                                                <div id="div_profile_img_container" class="div_profile_img_container">
                                                    <img id="img_profile_user_picture_preview" class="img_profile_user_picture" src="${profile_picture_url}"/>
                                                </div>
                                                <div id="div_profile_edit_profile_picture_input" class="div_profile_edit_profile_picture_input">
                                                    <input class="form-control mb-1" id="in_profile_edit_profile_image" name="profile_image" type="file" accept="image/*" placeholder="Select Image File">
                                                </div>
                                            </div>

                                            <div class="div_line_divider" id=""></div>

                                            <div id="div_profile_all_info" class="div_profile_all_info">
                                                <div id="div_profile_info_id" class="div_profile_info_grp div_profile_info_id">
                                                    <span id="span_profile_info_type_id" class="span_profile_info_type">ID :</span>
                                                    <span id="span_profile_user_info_id" class="span_profile_user_info">${id}</span>

                                                </div>
                                                <div id="div_profile_info_fname" class="div_profile_info_grp div_profile_info_fname">
                                                    <span id="span_profile_info_type_fname" class="span_profile_info_type">First Name :</span>
                                                    <input class="form-control mb-1" id="in_profile_edit_first_name" name="first_name" type="text" value=${fname} placeholder="Enter Your New First Name" required="">
                                                    <button id="btn_profile_edit_reset_first_name" class="btn btn-sm btn-outline-success svg_fill_green brdr_clr_transp" data-input-field="input_first_name" title="Reset First Name">
                                                        <div id="task_action_mark_btn_icon_tid-Tgezd" class="div_btn_icon1_cont">
                                                            <svg class="icon_svg_small icon_svg_light">
                                                                <use xlink:href="#icon-check"></use>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>

                                                <div id="div_profile_info_lname" class="div_profile_info_grp div_profile_info_lname">
                                                    <span id="span_profile_info_type_lname" class="span_profile_info_type">Last Name :</span>
                                                    <input class="form-control mb-1" id="in_profile_edit_last_name" name="last_name" type="text" value=${lname} placeholder="Enter Your New Last Name" required="">
                                                    <button id="btn_profile_edit_reset_last_name" class="btn btn-sm btn-outline-success svg_fill_green brdr_clr_transp" data-input-field="input_last_name" title="Reset Last Name">
                                                        <div id="task_action_mark_btn_icon_tid-Tgezd" class="div_btn_icon1_cont">
                                                            <svg class="icon_svg_small icon_svg_light">
                                                                <use xlink:href="#icon-check"></use>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                    </div>

                                                <div id="div_profile_info_address" class="div_profile_info_grp div_profile_info_address">
                                                    <span id="span_profile_info_type_address" class="span_profile_info_type">Address :</span>
                                                    <textarea class="form-control mb-1" id="in_profile_edit_address" name="address" type="text" placeholder="Enter Task New Address" required="">${address}</textarea>
                                                    <button id="btn_profile_edit_reset_last_name" class="btn btn-sm btn-outline-success svg_fill_green brdr_clr_transp" data-input-field="input_address" title="Reset Address">
                                                        <div id="task_action_mark_btn_icon_tid-Tgezd" class="div_btn_icon1_cont">
                                                            <svg class="icon_svg_small icon_svg_light">
                                                                <use xlink:href="#icon-check"></use>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="div_line_divider" id=""></div>

                                            <div id="div_profile_all_info" class="div_profile_all_info">
                                                <span class="warning_text_span">NOTE: If You Change the Email then You will be logged out, and need to login with new Email</span>
                                                <div id="div_profile_info_email" class="div_profile_info_grp div_profile_info_email">
                                                    <span id="span_profile_info_type_email" class="span_profile_info_type">Email :</span>
                                                    <input class="form-control mb-1" id="in_profile_edit_email" name="email" type="text" value=${email} placeholder="Enter Your New Email" required="">
                                                </div>
                                            </div>

                                            <div class="div_line_divider" id=""></div>

                                            <div id="div_profile_all_info" class="div_profile_all_info">
                                                <span id="span_profile_info_type_address" class="span_profile_info_type">Change Password :</span>
                                                <span class="warning_text_span">NOTE: If You Change the Password then You will be logged out, and need to login with new Password</span>
                                                <div id="div_profile_edit_change_password_btn" class="div_profile_edit_change_password_btn">
                                                    <button id="btn_profile_edit_change_password" class="btn_profile_edit_change_password btn btn-sm btn-outline-danger" title="Change Password">
                                                        Change Password
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>`;


        $("#div_tab_profile_edit").append(profile_html_block);




        $("#btn_profile_edit_change_password").click(function(){
            change_password_popup_ui();
            return;
        });

    }



    function change_password_popup_ui(){

        console.log("change_password_popup_ui")

        const ui_block = ``;





    }



    // Task List Tab
    function task_list_tab_render(){
        const page_title = "Task List";
        title(page_title);

        update_url("tab", "task_list");
        const div_tab_task_list = $("#div_tab_task_list");
        const tab_body = ``;

        if(div_tab_task_list.attr("data-tab-ui-state") == "null"){
            // div_tab_task_list.append(tab_body);
            div_tab_task_list.attr("data-tab-ui-state", "loaded");

            $("#input_search_from_task_list").on('input', function(){
                // console.log(this.value);
                const search_text = this.value;
                search_task_list(search_text);
                return;
            });

            $("#select_sort_task_list").on('change', function(){
                // console.log(this.value);
                const sort_type = this.value;
                sort_task_list_request(sort_type);
                return;
            });
        }

        $.ajax({

            url: "/task_list_request/active",

            beforeSend: function(){
                // const loading_div = $("#div_task_list_tab_body");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_task_list">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_task_list_tab_body").append(loading_block);
            },

            success: function(result){
                task_list_data_loader(result);
                toast_notify("list_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_task_list").remove();
            },

        });

        div_tab_task_list.css("display", "flex");
    }

    function sort_task_list_request(sort_type){
        $.ajax({

            url: "/sort_task_list_request/active/"+sort_type,

            beforeSend: function(){
                // const loading_div = $("#div_task_list_tab_body");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_task_list">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_task_list_tab_body").append(loading_block);
            },

            success: function(result){
                task_list_data_loader(result);
                toast_notify("list_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_task_list").remove();
            },

        });


        return;
    }

    function search_task_list(search_text){

        let search_task_list_url= "";
        if(search_text != "" && search_text.length > 0){
            search_task_list_url = "/search_task_list_request/active/"+search_text
        }else
        if(search_text == "" || search_text.length == 0){
            search_task_list_url = "/task_list_request/active"
        }else{
            search_task_list_url = "/task_list_request/active"
        }

        $.ajax({

            url: search_task_list_url,

            beforeSend: function(){
                // const loading_div = $("#div_task_list_tab_body");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_task_list">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_task_list_tab_body").append(loading_block);
            },

            success: function(result){
                task_list_data_loader(result);
                // toast_notify("list_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_task_list").remove();
            },

        });


        return;
    }


    function task_list_data_loader(data){
        //console.log(data);
        const tbody_task_list_tb = $("#tbody_task_list_tb");
        tbody_task_list_tb.text("");
        let list_count = 0;
        data.forEach(element => {
            //console.log(element);
            list_count++;
            const id = element[0];
            const title = element[1];
            const description = element[2];
            const start_time = element[3];
            const start_date = element[4];
            const end_time = element[5];
            const end_date = element[6];
            const status = element[7];

            const tb_row =`<tr id="tr_id_${id}" data-task-id="${id}" data-task-list-tb-row="${id}">
                                <td class="td_right_border">${list_count}</td>
                                <td>${title}</td>
                                <td>${description}</td>
                                <td>${start_time}</td>
                                <td>${start_date}</td>
                                <!-- <td>${end_date}</td>
                                <td>${end_time}</td> -->
                                <td class="td_left_border td_task_action_col">
                                    <table>
                                        <tr>
                                            <td class="td_task_action_col_cell">
                                                <button id="btn_mark_task_task" class="btn btn-sm btn-outline-success svg_fill_green brdr_clr_transp" data-btn-task-op-complete="${id}" data-task-id="${id}" title="Mark As Task Completed">
                                                    <div id="task_action_mark_btn_icon_${id}" class="div_btn_icon1_cont">
                                                        <svg class="icon_svg_small icon_svg_light">
                                                            <use xlink:href="#icon-check"></use>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </td>
                                            <td class="td_task_action_col_cell">
                                                <button id="btn_edit_task" class="btn btn-sm btn-outline-primary svg_fill_skyblue brdr_clr_transp" data-btn-task-op-edit="${id}" data-task-id="${id}" title="Edit Task">
                                                    <div id="task_action_edit_btn_icon_${id}" class="div_btn_icon1_cont">
                                                        <svg class="icon_svg_small icon_svg_light">
                                                            <use xlink:href="#icon-edit"></use>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </td>
                                            <td class="td_task_action_col_cell">
                                                <button id="btn_delete_task" class="btn btn-sm btn-outline-danger svg_fill_red brdr_clr_transp" data-btn-task-op-delete="${id}" data-task-id="${id}" title="Delete Task">
                                                    <div id="task_action_delete_btn_icon_${id}" class="div_btn_icon1_cont">
                                                        <svg class="icon_svg_small icon_svg_light">
                                                            <use xlink:href="#icon-trash-2"></use>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>`;

            tbody_task_list_tb.append(tb_row);



        });


        // task action buttons event listeners
        $("[data-btn-task-op-complete]").click(function(){
            const id = $(this).attr("data-btn-task-op-complete");
            mark_task_completed(id);
            return;
        });

        $("[data-btn-task-op-edit]").click(function(){
            // const id = $(this).attr("data-btn-task-op-edit");
            const id = $(this).attr("data-task-id");
            edit_task(id);
            return;
        });

        $("[data-btn-task-op-delete]").click(function(){
            // const id = $(this).attr("data-btn-task-op-delete");
            const id = $(this).attr("data-task-id");
            delete_task(id);
            return;
        });



    }




    // History Tab
    function history_tab_render(){
        const page_title = "History";
        title(page_title);

        update_url("tab", "history");
        const div_tab_history = $("#div_tab_history");
        const tab_body = ``;

        if(div_tab_history.attr("data-tab-ui-state") == "null"){
            // div_tab_history.append(tab_body);
            div_tab_history.attr("data-tab-ui-state", "loaded");

            $("#input_search_from_history").on('input', function(){
                // console.log(this.value);
                const search_text = this.value;
                search_history_list(search_text);
                return;
            });


            $("#select_sort_history").on('change', function(){
                // console.log(this.value);
                const sort_type = this.value;
                sort_history_list_request(sort_type);
                return;
            });
        }

        $.ajax({

            url: "/task_list_request/completed",

            beforeSend: function(){
                // const loading_div = $("#div_task_list_tab_body");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_task_list">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_task_list_tab_body").append(loading_block);
            },

            success: function(result){
                task_history_list_data_loader(result);
                toast_notify("list_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_task_list").remove();
            },

        });

        div_tab_history.css("display", "flex");



    }

    function sort_history_list_request(sort_type){
        $.ajax({

            url: "/sort_task_list_request/completed/"+sort_type,

            beforeSend: function(){
                // const loading_div = $("#div_task_list_tab_body");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_task_list">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_task_list_tab_body").append(loading_block);
            },

            success: function(result){
                task_history_list_data_loader(result);
                toast_notify("list_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_task_list").remove();
            },

        });


        return;
    }

    function search_history_list(search_text){

        let search_history_list_url= "";
        if(search_text != "" && search_text.length > 0){
            search_history_list_url = "/search_task_list_request/completed/"+search_text
        }else
        if(search_text == "" || search_text.length == 0){
            search_history_list_url = "/task_list_request/completed"
        }else{
            search_history_list_url = "/task_list_request/completed"
        }

        $.ajax({

            url: search_history_list_url,

            beforeSend: function(){
                // const loading_div = $("#div_task_list_tab_body");
                const loading_block = `<div class="div_loading_icon" id="div_loading_icon_task_list">
                                            <div class="loader_spin_icon" id="">
                                                <svg class="icon_svg_large1 loading_spin_animation" data-ignore-night-theme="">
                                                    <use xlink:href="#icon-loading-spinner"></use>
                                                </svg>
                                            </div>
                                        </div>`;
                // loading_div.append(loading_block);
                $("#div_task_list_tab_body").append(loading_block);
            },

            success: function(result){
                task_history_list_data_loader(result);
                // toast_notify("list_loaded");
            },

            error: function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                $("#div_loading_icon_task_list").remove();
            },

        });


        return;
    }


    function task_history_list_data_loader(data){
        //console.log(data);
        const tbody_task_history_list_tb = $("#tbody_task_history_list_tb");
        tbody_task_history_list_tb.text("");
        let list_count = 0;
        data.forEach(element => {
            //console.log(element);
            list_count++;
            const id = element[0];
            const title = element[1];
            const description = element[2];
            const start_time = element[3];
            const start_date = element[4];
            const end_time = element[5];
            const end_date = element[6];
            const status = element[7];

            const tb_row =`<tr id="tr_id_${id}" data-task-id="${id}" data-task-list-tb-row="${id}">
                                <td class="td_right_border">${list_count}</td>
                                <td>${title}</td>
                                <td>${description}</td>
                                <td>${start_time}</td>
                                <td>${start_date}</td>
                                <!-- <td>${end_date}</td>
                                <td>${end_time}</td> -->
                                <td class="td_left_border td_task_action_col">
                                    <table>
                                        <tr>
                                            <td class="td_task_action_col_cell">
                                                <button id="btn_mark_task_task" class="btn btn-sm btn-outline-success svg_fill_green brdr_clr_transp" data-btn-task-op-active="${id}" data-task-id="${id}" title="Mark As Task Active">
                                                    <div id="task_action_mark_btn_icon_${id}" class="div_btn_icon1_cont">
                                                        <svg class="icon_svg_small icon_svg_light">
                                                            <use xlink:href="#icon-check"></use>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </td>
                                            <td class="td_task_action_col_cell">
                                                <button id="btn_edit_task" class="btn btn-sm btn-outline-primary svg_fill_skyblue brdr_clr_transp" data-btn-task-op-edit="${id}" data-task-id="${id}" title="Edit Task">
                                                    <div id="task_action_edit_btn_icon_${id}" class="div_btn_icon1_cont">
                                                        <svg class="icon_svg_small icon_svg_light">
                                                            <use xlink:href="#icon-edit"></use>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </td>
                                            <td class="td_task_action_col_cell">
                                                <button id="btn_delete_task" class="btn btn-sm btn-outline-danger svg_fill_red brdr_clr_transp" data-btn-task-op-delete="${id}" data-task-id="${id}" title="Delete Task">
                                                    <div id="task_action_delete_btn_icon_${id}" class="div_btn_icon1_cont">
                                                        <svg class="icon_svg_small icon_svg_light">
                                                            <use xlink:href="#icon-trash-2"></use>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>`;

            tbody_task_history_list_tb.append(tb_row);



        });


        // task action buttons event listeners
        $("[data-btn-task-op-active]").click(function(){
            const id = $(this).attr("data-btn-task-op-active");
            mark_task_active(id);
            return;
        });

        $("[data-btn-task-op-edit]").click(function(){
            // const id = $(this).attr("data-btn-task-op-edit");
            const id = $(this).attr("data-task-id");
            edit_task(id);
            return;
        });

        $("[data-btn-task-op-delete]").click(function(){
            // const id = $(this).attr("data-btn-task-op-delete");
            const id = $(this).attr("data-task-id");
            delete_task(id);
            return;
        });



    }


    function toast_notify(id){
        const toast_obj = $("#"+id);
        const toast_instance = bootstrap.Toast.getOrCreateInstance(toast_obj);
        // console.log(toast_instance);
        toast_instance.show();
    }





    // Task Operations Mark Completed, Edit Task and Delete Task

    function mark_task_completed(id){

        $.ajax({
            url: "/mark_task_completed/"+id,

            beforeSend: function(){
                // console.log("Starting");
                $("#task_action_mark_btn_icon_"+id).css("display", "none");
                const mark_btn = $("[data-btn-task-op-complete = "+id+"]");
                // console.log(mark_btn);
                mark_btn.prop("disabled", true);

                const loading_block = `<div class="loader_spin_icon_small" id="loading_icon_mark_${id}">
                                        <svg class="icon_svg_small loading_spin_animation">
                                            <use xlink:href="#icon-loading-spinner"></use>
                                        </svg>
                                    </div>`;
                mark_btn.append(loading_block);
            },

            success: function(result){
                console.log(result);
                if(result == "success"){
                    $("#tr_id_"+id).remove();
                    toast_notify("task_list_task_mark_toast");
                }else{
                    console.log(result);
                    toast_notify("toast_failed");
                }
            },

            error:function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                // console.log("Completed");
                const mark_btn = $("[data-btn-task-op-complete = "+id+"]");
                // console.log(mark_btn);
                mark_btn.prop("disabled", false);

                $("#loading_icon_mark_"+id).remove();
                $("#task_action_mark_btn_icon_"+id).css("display", "flex");
            },

        });

    }

    function mark_task_active(id){

        $.ajax({
            url: "/mark_task_active/"+id,

            beforeSend: function(){
                // console.log("Starting");
                $("#task_action_mark_btn_icon_"+id).css("display", "none");
                const mark_btn = $("[data-btn-task-op-active = "+id+"]");
                // console.log(mark_btn);
                mark_btn.prop("disabled", true);

                const loading_block = `<div class="loader_spin_icon_small" id="loading_icon_mark_${id}">
                                        <svg class="icon_svg_small loading_spin_animation">
                                            <use xlink:href="#icon-loading-spinner"></use>
                                        </svg>
                                    </div>`;
                mark_btn.append(loading_block);
            },

            success: function(result){
                console.log(result);
                if(result == "success"){
                    $("#tr_id_"+id).remove();
                    toast_notify("task_list_task_mark_active_toast");
                }else{
                    console.log(result);
                    toast_notify("toast_failed");
                }
            },

            error:function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                // console.log("Completed");
                const mark_btn = $("[data-btn-task-op-active = "+id+"]");
                // console.log(mark_btn);
                mark_btn.prop("disabled", false);

                $("#loading_icon_mark_"+id).remove();
                $("#task_action_mark_btn_icon_"+id).css("display", "flex");
            },

        });

    }

    function edit_task(id){
        // console.log(id);

        $.ajax({
            url: "/task_edit_data_request/"+id,

            beforeSend: function(){
                // console.log("Starting");
                $("#task_action_edit_btn_icon_"+id).css("display", "none");
                const edit_btn = $("[data-btn-task-op-edit = "+id+"]");
                // console.log(mark_btn);
                edit_btn.prop("disabled", true);

                const loading_block = `<div class="loader_spin_icon_small" id="loading_icon_mark_${id}">
                                        <svg class="icon_svg_small loading_spin_animation">
                                            <use xlink:href="#icon-loading-spinner"></use>
                                        </svg>
                                    </div>`;
                edit_btn.append(loading_block);

            },

            success: function(result){
                // console.log(result);
                // if(result == "success"){
                //     $("#tr_id_"+id).remove();
                //     toast_notify("task_list_task_mark_toast");
                // }else{
                //     console.log(result);
                //     toast_notify("toast_failed");
                // }

                function date_formater(date) {
                    if(date.length == 0){
                        return "";
                    }else{
                        const temp_list = date.split("-")
                        const day = temp_list[0];
                        const month = temp_list[1];
                        const year = temp_list[2];
                        return year+"-"+month+"-"+day;
                    }
                }
                const data = result[0];
                // console.log(data);

                const id = data[0];
                const title = data[1];
                const description = data[2];
                const start_date = date_formater(data[3]);
                const start_time = data[4];
                const end_date = date_formater(data[5]);
                const end_time = data[6];
                const status = data[7];


                $("#input_id_update").val(id);
                $("#input_task_title_update").val(title);
                $("#input_description_update").val(description);
                $("#input_start_date_update").val(start_date);
                $("#input_start_time_update").val(start_time);
                $("#input_end_date_update").val(end_date);
                $("#input_end_time_update").val(end_time);
                $("#input_status_update").val(status);

                $("#div_edit_task_popup").modal('show');

            },

            error:function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                // console.log("Completed");
                const edit_btn = $("[data-btn-task-op-edit = "+id+"]");
                // console.log(edit_btn);
                edit_btn.prop("disabled", false);

                $("#loading_icon_mark_"+id).remove();
                $("#task_action_edit_btn_icon_"+id).css("display", "flex");
            },

        });
    }

    function delete_task(id){
        // console.log(id);
        // return;
        $.ajax({
            url: "/delete_task/"+id,

            beforeSend: function(){
                // console.log("Starting");
                $("#task_action_delete_btn_icon_"+id).css("display", "none");
                const delete_btn = $("[data-btn-task-op-delete = "+id+"]");
                // console.log(delete_btn);
                delete_btn.prop("disabled", true);

                const loading_block = `<div class="loader_spin_icon_small" id="loading_icon_delete_${id}">
                                        <svg class="icon_svg_small loading_spin_animation">
                                            <use xlink:href="#icon-loading-spinner"></use>
                                        </svg>
                                    </div>`;
                delete_btn.append(loading_block);
            },

            success: function(result){
                console.log(result);
                if(result == "success"){
                    $("#tr_id_"+id).remove();
                    toast_notify("task_list_task_delete_toast");
                }else{
                    console.log(result);
                    toast_notify("toast_failed");
                }
            },

            error:function(result){
                // console.log(result);
                toast_notify("toast_failed");
            },

            complete: function(){
                // console.log("Completed");
                const delete_btn = $("[data-btn-task-op-delete = "+id+"]");
                // console.log(delete_btn);
                delete_btn.prop("disabled", false);

                $("#loading_icon_delete_"+id).remove();
                $("#task_action_delete_btn_icon_"+id).css("display", "flex");
            },

        });

    }




});
