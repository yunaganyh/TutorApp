from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask_jsonpify import jsonify
from json import dumps
import sqlFunctions
import logging

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

api = Api(app)

CORS(app, resources={r"*": {"origins": "*"}})

TAconn = 'TAqns'

class Questions(Resource):

    def get(self):
        conn = sqlFunctions.getConn(TAconn)
        questions = sqlFunctions.getAllQuestions(conn)
        return jsonify(questions)

    def post(self):
        conn = sqlFunctions.getConn(TAconn)
        question = request.get_json()
        insertedQn = sqlFunctions.insertNewQuestion(conn, question)
        return jsonify(insertedQn)

    def put(self):
        conn = sqlFunctions.getConn(TAconn)
        question = request.get_json()
        sqlFunctions.updateQuestion(conn, question)

    

class Groups(Resource):
    def get(self):
        conn = sqlFunctions.getConn(TAconn)
        groups = sqlFunctions.getAllGroups(conn)
        return jsonify(groups)

    def post(self):
        conn = sqlFunctions.getConn(TAconn)
        group = request.get_json()
        insertedGroup = sqlFunctions.insertNewGroup(conn, group)
        # Has to be an object, not array. Otherwise angular throws errors.
        # Find a fix if possible
        return jsonify({'group':insertedGroup})


api.add_resource(Questions, '/questions')
api.add_resource(Groups, '/groups')
if __name__ == "__main__":
    app.run(debug=True, port=5050)