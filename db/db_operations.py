import sqlite3



# conn = sqlite3.connect("db/users.db")
# cur = conn.cursor()


# cur.execute('''CREATE TABLE "user" (
# 	"id"	TEXT,
# 	"first_name"	TEXT,
# 	"last_name"	TEXT,
# 	"email"	TEXT UNIQUE,
# 	"password"	TEXT,
# 	"address"	TEXT,
# 	"profile_picture"	TEXT UNIQUE,
# 	PRIMARY KEY("id")
# )''')

# conn.commit()
# conn.close()



# DATABASE = "users.db"  # Path to the SQLite database file
DATABASE = "india_2.db"  # Path to the SQLite database file


# Database configuration
def get_db_connection():
    # pass
    connection = sqlite3.connect(DATABASE)
    # connection = sqlite3.connect("users.db")
    connection.row_factory = sqlite3.Row  # Rows can be accessed as dictionaries
    return connection



# con = sqlite3.connect("users.db")
con = get_db_connection()
cur = con.cursor()
cur.execute("select * from country")
temp_data  = cur.fetchall()
con.close()

# print(temp_data)

conn = get_db_connection()
try:
    cursor = conn.cursor()
    columns = 'name, country_code'
    cursor.execute(f'SELECT {columns} FROM country ORDER BY name ASC')
    data = [dict(row) for row in cursor.fetchall()]

finally:
    conn.close()

print(data)
