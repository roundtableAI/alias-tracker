# Roundtable Alias JsPsych extension

This repository contains details on using the [Roundtable Alias API](https://docs.roundtable.ai) with JsPsych for survey bot and fraud detection.

## Setup

The [Alias tracker](public/alias-tracker.js) integrates with JsPsych `survey-text` trials to identify potential fraudelent, inattentive, or bot-like responses to open-ended questions. You can use this as a naturalistic captcha to identify participants to exclude from your analyses. We also do device fingerprinting for additional security and duplicate detection.

The Alias tracker extension generates arrays of all the change events to open-ended questions (called "question histories"), which you then pass to our API. To use this extension, add a link to it in `index.html`, include it in the `initJsPsych` call, and then pass it as an extension to any `jsPsychSurveyText` questions you want to track (note that you must include at least one `survey-text` question with our extension).

The Alias tracker takes an optional initialization argument `max_n_characters`, when specifies the max number of characters the JSON string of each `question_history` can be (by default, this is 50,000; we highly recommend setting it to at least 20,000). The extension also requires a `page_id` parameter on every trial where the extension is used. This allows you to easily compare responses across participants even if there are conditional timelines or repeated questions.

For fingerprinting, the Alias tracker generates a fingerprint id and adds it to the jsPsych data on every `jsPsychSurveyText` trial with the Alias extension. You can then pass this id to the API to identify duplicate participants. Note that there is only one fingerprint id generated per participant-session.

We include a full example of using our extension in a JsPsych experiment in the [public/](public/) directory. Here is a simplified example:

```
const jsPsych = initJsPsych({
  extensions: [
    { type: jsPsychAliasTracker, params: { max_n_characters:55000 } }
  ],
});

...

const openEndsTrial = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: 'What do you think was the purpose of this experiment?', required: true, rows: 6 },
  ],
  extensions: [
    { type: jsPsychAliasTracker, params: { page_id:'page1' } }
  ]
}

...

```

## Calling the API

Our tracker automatically adds all of the data the Alias API needs to trial data with the `jsPsychAliasTracker` extension. This data is stored as `alias_questions`, `alias_responses`, `alias_question_histories`, and `alias_fingerprint_id`. This data can be passed to our API without any further modifications. An example of parsing the data from our example experiment and passing it to the API is included in [call-api.py](call-api.py). More information on our API and setting up keys can be found on the [Alias API documentation](https://docs.roundtable.ai).

## Running on Heroku

This repository provides code to deploy an Alias JsPsych experiment to Heroku, a cloud platform service. Follow the steps below to clone the repository, install necessary dependencies, and launch your experiment on Heroku.

```bash
git clone https://github.com/roundtableAI/alias-tracker.git  # Clones the repository
cd alias-tracker/                                            # Navigates into the directory
npm install                                                  # Installs all dependencies
heroku create your-app-name                                  # Creates a new Heroku app
git push heroku master                                       # Deploys the app to Heroku
heroku open                                                  # Opens the app in a web browser
```