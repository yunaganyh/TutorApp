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


# insert a question into the database and returns the newly inserted question from the database so that we can display it immediately. 
# Otherwise, there will be no response to the subscribe function in question.service.ts
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

# get all questions with all their details
# unix_timestamp is used to convert the timestamp to the number of seconds since '1970-01-01 00:00:00' UTC. This is done so that we can format the timestamp correctly in the client side.
def getAllQuestions(conn):
    curs = conn.cursor()
    getQuery = '''select id, votes, description, submitter, unix_timestamp(uploaded) as uploadedTime from submissions order by uploaded desc'''
    curs.execute(getQuery)
    return curs.fetchall()

def getCurrentQuestions(conn, startDate, endDate):
    curs = conn.cursor()
    getQuery = '''select id, votes, description, submitter, unix_timestamp(uploaded) as uploadedTime from submissions 
    where unix_timestamp(uploaded) >= %s and unix_timestamp(uploaded) <= %s'''
    curs.execute(getQuery, [startDate, endDate])
    return curs.fetchall()

# get all groups
# unix_timestamp is used to convert the timestamp to the number of seconds since '1970-01-01 00:00:00' UTC. This is done so that we can format the timestamp correctly in the client side.
def getAllGroups(conn):
    curs = conn.cursor()
    getQuery = '''select submissions.id, votes, description, submitter, unix_timestamp(uploaded) as uploadedTime, gid, groupRank from submissions inner join groupedQuestions where submissions.id = groupedQuestions.id'''
    curs.execute(getQuery)
    return curs.fetchall()


# insert a group into the database and returns the newly inserted group from the database so that we can display it immediately.
# Otherwise, there will be no response to the subscribe function in question.service.ts
def insertNewGroup(conn, group):
    curs = conn.cursor()
    maxID = 1
    # Since we have to set the gid for each question, the gid is not auto_incremented.
    # Check if the table is empty. If yes, set the gid to 1. Otherwise, get the maximum gid and increment from it.
    idQuery = '''select gid from groupedQuestions'''
    hasID = curs.execute(idQuery)
    if hasID:
        # todo: somehow max(gid) keeps returning 1. Find a solution. Currently working around this.
        # maxID = curs.execute('''select max(gid) as maxGID from groupedQuestions''')
        topQuery = curs.execute('''select gid from groupedQuestions order by gid desc''')
        top = curs.fetchone()['gid']
        maxID = top + 1
    insertQuestionsIntoGroup(curs, group, maxID)
    getQueryForGroups = getQuery = '''select submissions.id, votes, description, submitter, unix_timestamp(uploaded) as uploadedTime, gid, groupRank from submissions inner join groupedQuestions on submissions.id = groupedQuestions.id where groupedQuestions.gid = %s'''
    curs.execute(getQueryForGroups, [maxID])
    return curs.fetchall()

# Insert group questions ids with the given gid into database.
def insertQuestionsIntoGroup(curs, group, groupID):
    insertQuery = '''insert into groupedQuestions (gid, groupRank, id) values (%s, %s, %s)'''
    for qn in group['questions']:
        curs.execute(insertQuery, [groupID, group['groupRank'], qn['id']])

# Deletes a group with the given id from the database. 
def deleteGroup(curs, groupID):
    deleteQuery = '''delete from groupedQuestions where gid = %s'''
    curs.execute(deleteQuery,[groupID])

# Delete all questions previously in the group and insert questions currently in the group.
def updateGroup(conn, group):
    curs = conn.cursor()
    groupID = group['gid']
    questions = group['questions']
    deleteGroup(curs, groupID)
    insertQuestionsIntoGroup(curs, group, groupID)
