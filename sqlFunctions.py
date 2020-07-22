#!/usr/bin/python3

import pymysql.cursors

# return the connection to database
def getConn(db):
    dbHost = "localhost"
    dbUser = "root"
    dbPwd = "ZoomChat1!"
    cursorType = pymysql.cursors.DictCursor

    conn = pymysql.connect(
        host=dbHost,
        user=dbUser,
        password=dbPwd,
        db=db,
        cursorclass=cursorType,
        autocommit=True
        )
    return conn

# insert a question into the database TAqns table and returns the newly inserted question from the database
# otherwise, there will be no response to the subscribe function in question.service.ts
def insertNewQuestion(conn, question):
    curs = conn.cursor()
    insertQuery = '''insert into submissions (description, submitter) values (%s, %s)'''
    curs.execute(insertQuery, [question['description'], question['submitter']])
    curs.execute('''select * from submissions where id = LAST_INSERT_ID()''')
    return curs.fetchall()

# updates question details
def updateQuestion(conn, question):
    curs = conn.cursor()
    updateQuery = '''update submissions set votes = %s where id = %s'''
    curs.execute(updateQuery, [question['votes'], question['id']])

# get all questions
def getAllQuestions(conn):
    curs = conn.cursor()
    getQuery = '''select id, votes, description, submitter, unix_timestamp(uploaded) as uploadedTime from submissions order by uploaded desc'''
    curs.execute(getQuery)
    return curs.fetchall()

def getAllGroups(conn):
    curs = conn.cursor()
    getQuery = '''select * from submissions inner join groupedQuestions where submissions.id = groupedQuestions.id'''
    curs.execute(getQuery)
    return curs.fetchall()

def insertNewGroup(conn, group):
    curs = conn.cursor()
    maxID = 0
    idQuery = '''select gid from groupedQuestions'''
    hasID = curs.execute(idQuery)
    if hasID:
        # todo: somehow max(gid) keeps returning 1. Find a solution. Currently working around this.
        # maxID = curs.execute('''select max(gid) as maxGID from groupedQuestions''')
        topQuery = curs.execute('''select gid from groupedQuestions order by gid desc''')
        top = curs.fetchone()['gid']
        maxID = top + 1
    else:
        maxID = 1
    insertQuery = '''insert into groupedQuestions (gid, questionRank, id) values (%s, %s, %s)'''
    for qn in group['questions']:
        curs.execute(insertQuery, [maxID, group['rank'], qn['id']])
    getQuery = '''select * from submissions inner join groupedQuestions on submissions.id = groupedQuestions.id where groupedQuestions.gid = %s'''
    curs.execute(getQuery, [maxID])
    return curs.fetchall()
