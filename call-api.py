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

body = {
    'questions': questions,
    'question_histories': question_histories,
    'responses': responses,
    'survey_id': survey_id,
    'participant_id': participant_id,
}

# Headers to be sent in the request
headers = {
    "Content-Type": "application/json",
    "api_key": api_key  # API key goes in the headers
}

# Make request
response = requests.post(
    'https://roundtable.ai/api/alias/v011',
    json=body,
    headers=headers
)

if response.status_code == 200:
    # Get the body of the response and print
    results_data = response.json()
    print('Success: ', results_data)
else:
    # Get the body of the response and print
    response_body = response.json()
    print('Error: ', response_body)