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

# @api.representation('application/json')
class Questions(Resource):

    def get(self):
        conn = sqlFunctions.getConn('TAqns')
        questions = sqlFunctions.getAllQuestions(conn)
        return jsonify(questions)

    def post(self):
        conn = sqlFunctions.getConn('TAqns')
        question = request.get_json()
        insertedQn = sqlFunctions.insertNewQuestion(conn, question)
        return jsonify(insertedQn)

    def put(self):
        conn = sqlFunctions.getConn('TAqns')
        question = request.get_json()
        sqlFunctions.updateQuestion(conn, question)

    
api.add_resource(Questions, '/questions')

if __name__ == "__main__":
    app.run(debug=True, port=5050)