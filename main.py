from flask import *
import sqlite3
import os
import my_lib

app = Flask(__name__)
app.config['USER_IMG'] = "static/user_img/"
app.secret_key = "adsjhr54vd46gdgde04udgsfsf3bf"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/all_links_test_temp")
def all_links_test_temp():
    return render_template("all_links_test_temp.html")



@app.route("/reg_page")
def reg_page():
    if session.get("username") is not None:
        return redirect(url_for("dashboard"))
    else:
        return render_template("reg_page.html")



@app.route("/add_user", methods=["POST"])
def add_user():

    if request.method == "POST":
        fname = request.form["fname"]
        lname = request.form["lname"]
        email = request.form["email"]
        password = request.form["password"]
        address = request.form["address"]


        img_file = request.files["img"]
        image_file_name = img_file.filename


        con = sqlite3.connect("db/users.db")
        cur = con.cursor()

        id_rows_count = 1
        random_id = ""
        id = ""
        # Checking for genrated id in database to avoid duplicate id generation
        while id_rows_count >= 1 :
            random_id = "uid-" + my_lib.random_string(5)
            cur.execute("SELECT COUNT(1) FROM user WHERE id='"+random_id+"'")
            count_row = cur.fetchone()
            print("Count = ", count_row[0])
            id_rows_count = count_row[0]
            if(id_rows_count == 0):
                id = random_id
                break

        # print("ID = " + id)

        # image name constructor (spliting filename string to get extension of file)
        file_exten = image_file_name.split(".")
        img_name = id + "." + file_exten[-1]

        # print(img_name)

        # return "success"

        img_file.save(os.path.join(app.config['USER_IMG'], img_name))

        data_list = [id, fname, lname, email, password, address, img_name]
        cur.execute("insert into user(id,first_name,last_name,email,password,address,profile_picture) values(?,?,?,?,?,?,?)", data_list)
        con.commit()
        con.close()

        # Making Task Table for registering user with table name as user id
        con_task_db = sqlite3.connect("db/task_data.db")
        cur_task_db = con_task_db.cursor()
        new_tb_query = '''CREATE TABLE "'''+id+'''" (
                            "id" TEXT UNIQUE,
                            "title" TEXT,
                            "description" TEXT,
                            "start_time" TEXT,
                            "start_date" TEXT,
                            "end_time" TEXT,
                            "end_date" TEXT,
                            "status" TEXT,
                            PRIMARY KEY("id")
                        )'''
        cur_task_db.execute(new_tb_query)
        con_task_db.commit()
        con_task_db.close()

        # return "Data Inserted Successfully Completed"

        return redirect(url_for("dashboard"))
    else:
        return "Falied"




@app.route("/login_page")
def login_page():
    if session.get("username") is not None:
        return redirect(url_for("dashboard"))
    else:
        return render_template("login_page.html")


@app.route("/login_user", methods=["POST"])
def login_user():

    if request.method == "POST":
        email = request.form["username"]
        password = request.form["password"]
        # print(email)
        # print(password)

        con = sqlite3.connect("db/users.db")
        cur = con.cursor()
        cur.execute("select COUNT(1) from user where email = ?", [email])
        count_row = cur.fetchone()
        # print(count_row[0])
        if count_row[0] == 0:
            return "email does not exist"
        else:
            cur.execute("select id, password from user where email = ?", [email])
            data = cur.fetchone()
            # print("ID =", data[0])
            # print("Passowrd =" ,data[1])
            db_password = data[1]
            if password == db_password:
                session["username"] = email     # <-- session start
                return redirect(url_for("dashboard"))
            else:
                return redirect(url_for("login_page"))
            # return "Success"

    else:
        return "Falied"



@app.route("/logout")
def logout():
    session.pop("username", None)       # <-- Session End
    return redirect(url_for("login_page"))



@app.route("/profile")
def profile():
    if session.get("username") is not None:
        email = session["username"]
        con = sqlite3.connect("db/users.db")
        cur = con.cursor()
        cur.execute("select id, first_name, last_name, email, address, profile_picture from user where email = ?",[email])
        temp_data  = cur.fetchone()
        # print(temp_data)

        data = {"id": temp_data[0],
                "first_name": temp_data[1],
                "last_name": temp_data[2],
                "email": temp_data[3],
                "address": temp_data[4],
                "profile_picture_url": "/static/user_img/"+temp_data[5],
                }

        return [data]

    elif session.get("username") is None:
        return redirect(url_for("login_page"))





@app.route("/dashboard")
def dashboard():
    if session.get("username") is not None:
        email = session["username"]
        con = sqlite3.connect("db/users.db")
        cur = con.cursor()
        cur.execute("select * from user where email = ?",[email])
        data = cur.fetchone()
        # print(data)
        return render_template("dashboard.html", data = data)

    elif session.get("username") is None:
        return redirect(url_for("login_page"))




@app.route("/add_task", methods=["POST"])
def add_task():

    if request.method == "POST":

        if session.get("username") is None:
            return redirect(url_for("login_page"))

        elif session.get("username") is not None:
            email = session["username"]
            con_1 = sqlite3.connect("db/users.db")
            cur_1 = con_1.cursor()
            cur_1.execute("select id from user where email = ?",[email])
            data = cur_1.fetchone()
            con_1.commit()
            con_1.close()


        def date_formater(date):
            if len(date) == 0:
                return ""
            else:
                temp_list = date.split("-")
                day = temp_list[2]
                month = temp_list[1]
                year = temp_list[0]
                return day+"-"+month+"-"+year

        tb_name = data[0]
        # print(tb_name)
        task_title = request.form["task_title"]
        description = request.form["description"]

        raw_start_date = request.form["start_date"]
        start_date = date_formater(raw_start_date)

        start_time = request.form["start_time"]

        raw_end_date = request.form["end_date"]
        end_date = date_formater(raw_end_date)

        end_time = request.form["end_time"]

        con_2 = sqlite3.connect("db/task_data.db")
        cur_2 = con_2.cursor()

        id_rows_count = 1
        random_id = ""
        id = ""

        # Checking for genrated id in database to avoid duplicate id generation
        while id_rows_count >= 1 :
            random_id = "tid-" + my_lib.random_string(5)
            cur_2.execute("SELECT COUNT(1) FROM '"+tb_name+"' WHERE id='"+random_id+"'")
            count_row = cur_2.fetchone()
            # print("Count = ", count_row[0])
            id_rows_count = count_row[0]
            if(id_rows_count == 0):
                id = random_id
                break

        con_2.commit()
        con_2.close()

        # print("ID = " + id)

        # return "success"

        data_list = [id, task_title, description, start_time, start_date, end_time, end_date, "active"]
        # print(data_list)
        # return redirect(url_for("dashboard"))

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        cur_3.execute("insert into '"+tb_name+"'(id, title, description, start_time, start_date, end_time, end_date, status) values(?,?,?,?,?,?,?,?)", data_list)
        con_3.commit()
        con_3.close()

        # return "Data Inserted Successfully Completed"

        return redirect(url_for("dashboard"))
    else:
        return "Falied"



@app.route("/task_edit_data_request/<task_id>")
def task_edit_data_request(task_id):

    if session.get("username") is None:
        return redirect(url_for("login_page"))

    elif session.get("username") is not None:
        email = session["username"]
        con_1 = sqlite3.connect("db/users.db")
        cur_1 = con_1.cursor()
        cur_1.execute("select id from user where email = ?",[email])
        data = cur_1.fetchone()
        con_1.commit()
        con_1.close()

        tb_name = data[0]
        # print(tb_name)
        # print("ID = " + task_id)
        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        cur_3.execute("select id, title, description, start_date, start_time, end_date, end_time, status from '"+tb_name+"' where id = ?", [task_id])
        task_data = cur_3.fetchone()
        # print(task_data)

        con_3.commit()
        con_3.close()

        return [task_data]  # Send in array/list format
    else:
        return "Failed"



@app.route("/update_task", methods=["POST"])
def update_task():

    if request.method == "POST":

        if session.get("username") is None:
            return redirect(url_for("login_page"))

        elif session.get("username") is not None:
            email = session["username"]
            con_1 = sqlite3.connect("db/users.db")
            cur_1 = con_1.cursor()
            cur_1.execute("select id from user where email = ?",[email])
            data = cur_1.fetchone()
            con_1.commit()
            con_1.close()

        def date_formater(date):
            if len(date) == 0:
                return ""
            else:
                temp_list = date.split("-")
                day = temp_list[2]
                month = temp_list[1]
                year = temp_list[0]
                return day+"-"+month+"-"+year

        tb_name = data[0]
        # print(tb_name)

        id = request.form["id"]
        task_title = request.form["task_title"]
        description = request.form["description"]
        status = request.form["status"]

        raw_start_date = request.form["start_date"]
        start_date = date_formater(raw_start_date)

        start_time = request.form["start_time"]

        raw_end_date = request.form["end_date"]
        end_date = date_formater(raw_end_date)

        end_time = request.form["end_time"]


        # print("ID = " + id)

        # return "success"

        data_list = [task_title, description, start_time, start_date, end_time, end_date, status, id]
        # print(data_list)
        # return redirect(url_for("dashboard"))

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        # cur_3.execute("update '"+table_name+"' set status = 'completed' where id = '"+task_id+"'")
        cur_3.execute("update '"+tb_name+"' set title = ?, description = ?, start_time = ?, start_date = ?, end_time = ?, end_date = ?, status = ? where id = ?", data_list)
        con_3.commit()
        con_3.close()

        # return "Data Inserted Successfully Completed"

        return redirect(url_for("dashboard"))
    else:
        return "Falied"



@app.route("/task_list_request/<status>")
def task_list_request(status):

    list_status = ["active", "completed"]
    if status not in list_status:
        return "invalid status request"

    if session.get("username") is None:
        return redirect(url_for("login_page"))

    elif session.get("username") is not None:
        email = session["username"]
        con_1 = sqlite3.connect("db/users.db")
        cur_1 = con_1.cursor()
        cur_1.execute("select id from user where email = ?",[email])
        data = cur_1.fetchone()
        con_1.commit()
        con_1.close()

        table_name = data[0]
        # print(table_name)

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        cur_3.execute("SELECT * FROM '"+table_name+"' WHERE status = '"+status+"' ORDER BY start_date ASC")
        task_data = cur_3.fetchall()
        con_3.commit()
        con_3.close()
        # print(task_data)

        return task_data




@app.route("/sort_task_list_request/<status>/<sort_type>")
def sort_task_list_request(status, sort_type):

    list_status = ["active", "completed"]
    dic_sort_type = {"title_asc": ["title", "ASC"],
                    "title_desc": ["title", "DESC"],
                    "date_asc": ["start_date", "ASC"],
                    "date_desc": ["start_date", "DESC"],
                    }
    if status not in list_status:
        return "invalid status request"

    if sort_type not in dic_sort_type:
        return "invalid sort type"

    if session.get("username") is None:
        return redirect(url_for("login_page"))

    elif session.get("username") is not None:
        email = session["username"]
        con_1 = sqlite3.connect("db/users.db")
        cur_1 = con_1.cursor()
        cur_1.execute("select id from user where email = ?",[email])
        data = cur_1.fetchone()
        con_1.commit()
        con_1.close()

        table_name = data[0]
        # print(table_name)
        order_by_col_name = dic_sort_type[sort_type][0]
        # print(order_by_col_name)
        order = dic_sort_type[sort_type][1]
        # print(order)

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        cur_3.execute("SELECT * FROM '"+table_name+"' WHERE status = '"+status+"' ORDER BY "+order_by_col_name+" "+order+"")

        task_data = cur_3.fetchall()
        con_3.commit()
        con_3.close()
        # print(task_data)

        return task_data


@app.route("/search_task_list_request/<status>/<search_text>")
def search_task_list_request(status, search_text):

    list_status = ["active", "completed"]

    if status not in list_status:
        return "invalid status request"

    if session.get("username") is None:
        return redirect(url_for("login_page"))

    elif session.get("username") is not None:
        email = session["username"]
        con_1 = sqlite3.connect("db/users.db")
        cur_1 = con_1.cursor()
        cur_1.execute("select id from user where email = ?",[email])
        data = cur_1.fetchone()
        con_1.commit()
        con_1.close()

        table_name = data[0]
        # print(table_name)
        # print(search_text)

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()

        # cur_3.execute("SELECT * FROM '"+table_name+"' WHERE status = '"+status+"' ORDER BY start_date DESC")
        cur_3.execute("SELECT * FROM '"+table_name+"' WHERE status = '"+status+"' AND (title like '%"+search_text+"%' or description like '%"+search_text+"%' or start_time like '%"+search_text+"%' or start_date like '%"+search_text+"%') ORDER BY start_date ASC")


        task_data = cur_3.fetchall()
        con_3.commit()
        con_3.close()
        # print(task_data)

        return task_data




@app.route("/mark_task_completed/<task_id>")
def mark_task_completed(task_id):

    if session.get("username") is None:
        return redirect(url_for("login_page"))

    elif session.get("username") is not None:
        email = session["username"]
        con_1 = sqlite3.connect("db/users.db")
        cur_1 = con_1.cursor()
        cur_1.execute("select id from user where email = ?",[email])
        data = cur_1.fetchone()
        con_1.commit()
        con_1.close()

        table_name = data[0]
        # print(table_name)

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        cur_3.execute("update '"+table_name+"' set status = 'completed' where id = '"+task_id+"'")
        con_3.commit()
        con_3.close()

        return "success"



@app.route("/mark_task_active/<task_id>")
def mark_task_active(task_id):

    if session.get("username") is None:
        return redirect(url_for("login_page"))

    elif session.get("username") is not None:
        email = session["username"]
        con_1 = sqlite3.connect("db/users.db")
        cur_1 = con_1.cursor()
        cur_1.execute("select id from user where email = ?",[email])
        data = cur_1.fetchone()
        con_1.commit()
        con_1.close()

        table_name = data[0]
        # print(table_name)

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        cur_3.execute("update '"+table_name+"' set status = 'active' where id = '"+task_id+"'")
        con_3.commit()
        con_3.close()

        return "success"




@app.route("/delete_task/<task_id>")
def delete_task(task_id):

    if session.get("username") is None:
        return redirect(url_for("login_page"))

    elif session.get("username") is not None:
        email = session["username"]
        con_1 = sqlite3.connect("db/users.db")
        cur_1 = con_1.cursor()
        cur_1.execute("select id from user where email = ?",[email])
        data = cur_1.fetchone()
        con_1.commit()
        con_1.close()

        table_name = data[0]
        # print(table_name)

        con_3 = sqlite3.connect("db/task_data.db")
        cur_3 = con_3.cursor()
        cur_3.execute("delete from '"+table_name+"' where id = '"+task_id+"'")
        con_3.commit()
        con_3.close()

        return "success"


















if __name__ == "__main__":
    # app.debug = True
    # app.run()
    app.run(host='0.0.0.0', port=5000, debug=True)















