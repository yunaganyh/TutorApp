from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask_jsonpify import jsonify
import sqlFunctions

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

api = Api(app)

CORS(app, resources={r"*": {"origins": "*"}})

TAconn = 'TAqns'

class Questions(Resource):

    # retrieve submitted questions from database
    def get(self):
        conn = sqlFunctions.getConn(TAconn)
        questions = sqlFunctions.getAllQuestions(conn)
        return jsonify(questions)

    # post/add a question to the database
    def post(self):
        conn = sqlFunctions.getConn(TAconn)
        question = request.get_json()
        insertedQn = sqlFunctions.insertNewQuestion(conn, question)
        # return the added question so that we can display it right away
        # error that the subscribed object is undefined is thrown if we do not return it
        return jsonify(insertedQn)

    # update an existing question in the database
    def put(self):
        conn = sqlFunctions.getConn(TAconn)
        question = request.get_json()
        sqlFunctions.updateQuestion(conn, question)


class Groups(Resource):

    # retrieve grouped questions from database
    def get(self):
        conn = sqlFunctions.getConn(TAconn)
        groups = sqlFunctions.getAllGroups(conn)
        return jsonify(groups)

    # post/add a group to the database
    def post(self):
        conn = sqlFunctions.getConn(TAconn)
        group = request.get_json()
        print(group)
        insertedGroup = sqlFunctions.insertNewGroup(conn, group)
        # Has to be an object, not array. Otherwise angular throws errors.
        # Find a fix if possible
        #return the added group so that we can display it right away
        return jsonify({'group':insertedGroup})

    # update an existing group in the database
    def put(self):
        conn = sqlFunctions.getConn(TAconn)
        group = request.get_json()
        sqlFunctions.updateGroup(conn, group)

class CurrentQuestions(Resource):

    # retrieve questions in the current week from database
    def get(self):
        conn = sqlFunctions.getConn(TAconn)
        startDate = int(request.args.get("startDate"))/1000
        endDate = int(request.args.get("endDate"))/1000
        print(startDate, endDate)
        currentQuestions = sqlFunctions.getCurrentQuestions(conn, startDate, endDate)
        print(jsonify(currentQuestions))
        return jsonify(currentQuestions)

api.add_resource(Questions, '/questions')
api.add_resource(Groups, '/groups')
api.add_resource(CurrentQuestions, '/currentQuestions')

if __name__ == "__main__":
    app.run(debug=True, port=5050)