#!/usr/bin/python3

import pymysql.cursors

dbHost = "localhost"
dbUser = "root"
dbPwd = "ZoomChat1!"
cursorType = pymysql.cursors.DictCursor

db = pymysql.connect(
    host=dbHost,
    user=dbUser,
    password=dbPwd,
    cursorclass=cursorType
    )

try:
    with db.cursor() as cursor:
        # create database for questions
        cursor.execute('''create database if not exists TAqns''')
        db.select_db('''TAqns''')

        cursor.execute('''drop table if exists groupedQuestions''')
        cursor.execute('''drop table if exists submissions''')
        
        # create table for question submissions
        tableCreation = '''CREATE TABLE submissions (
            id int auto_increment primary key,
            votes int DEFAULT 0,
            description varchar(300),
            submitter varchar(20),
            uploaded timestamp DEFAULT CURRENT_TIMESTAMP
            )'''
        cursor.execute(tableCreation)

        # create table for grouped questions
        groupTableCreation = '''CREATE TABLE groupedQuestions (
            gid int auto_increment primary key,
            questionRank int DEFAULT 0,
            id int,
            foreign key (id) references submissions (id)
            )'''
        cursor.execute(groupTableCreation)
 
except Exception as e:
    print("Exception occured:{}".format(e))

finally:
    cursor.close()