import json
import requests
import os
from dotenv import load_dotenv
load_dotenv()

# ------------------
# ------------------
# Prepare data from experiment
# ------------------
# ------------------

# Load JSON data
with open('data.json', 'r') as file:
    experiment_data = json.load(file)

# Set variables to pass to the API
participant_id = experiment_data[0]['participant_id']
survey_id = experiment_data[0]['survey_id']

questions = {}
question_histories = {}
responses = {}

# Loop through every element in the experiment_data and print
for element in experiment_data:
    if element['trial_type'] == 'survey-text':
        # Add alias data by merging dictionaries
        questions = {**questions, **element['alias_questions']}
        question_histories = {**question_histories, **element['alias_question_histories']}
        responses = {**responses, **element['alias_responses']}
        print('------------------')


# ------------------
# ------------------
# Call API
# ------------------
# ------------------

api_key = os.getenv('ROUNDTABLE_API_KEY')

# # Make body of request
# body = {
#     'questions': questions,
#     'question_histories': question_histories,
#     'responses': responses,
#     'survey_id': survey_id,
#     'api_key': api_key,
#     'participant_id': participant_id,
# }

body = {
"questions": {
    "question_id_1": "What do you think of Betway as a brand?"
  },
"responses": {
    "question_id_1": "I think Betway is a responsible brand"
  },
  "survey_id": "231001",
  "participant_id": "TESTKH001",
  "api_key": "sk-JsfrEUrtEgGdRxawHDAn",
}

# Make request and check
response = requests.post('https://roundtable.ai/.netlify/functions/alias-v01', json=body)
if response.status_code == 200:
    # Get the body of the response and print
    results_data = response.json()
    print('Success: ', results_data)
else:
    # Get the body of the response and print
    response_body = response.json()
    print('Error: ', response_body)