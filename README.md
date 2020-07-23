# TutorApp

## Setting up the localhost server 

source venv/bin/activate  

python db.py (sets up the database - execute only once when first running the app)  

python app.py

## Setting up web client

cd zoomApp  

ng serve --open

# Overview

This is an app for teaching assistants (TA) to receive and compile questions from their students so that the questions can be answered during office hours.  
Questions can be upvoted or downvoted to indicate the popularity of the question.  
Similar questions can be grouped to be answered at the same time for a more efficient office hour session.  
Groups of questions can be ranked to indicate the order in which questions will be answered.  