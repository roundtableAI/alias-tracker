# Roundtable Alias JsPsych extension

This repository contains details on using the [Roundtable Alias API](https://github.com/roundtableAI/alias-api) for survey bot and fraud detection.

If you're interested in using the Alias API or have questions about integration, feel free to contact us at [support@roundtable.ai](mailto:support@roundtable.ai) and our team can walk you through the features and get your account set up.

## Setup

Our [Alias extension](alias_extension.js) integrates with JsPsych survey-text questions to identify potential fraudelent, inattentive, or bot-like responses. The extension generates question history arrays of the change events on open-ended questions, which can then be passed to our API for scoring.

To use this extension, simply add a link to it in `index.html`, include it in the `initJsPsych` call, and then pass it as an extension to any `jsPsychSurveyText` questions you want to track. The Alias extension takes an optional initialization argument `max_n_characters`, when specifies the max number of characters JSON string each `question_history` can be (by default, this is 50,000). Additionally, the extension requires passing a `page_id` to every trial where the extension is used - this allows you to easily compare question responses across participants even if there are conditional timelines or repeated questions.

We include a full example of using our extension in a JsPsych experiment in the [example/](example/) directory. Here is a simplified example:

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

Our extension automatically adds all of the data the Alias API needs to the trial data. This data is stored as `alias_questions`, `alias_responses`, and `alias_question_histories`. These can be passed to our API for scoring without any additional modifications. An example of parsing the data from our example experiment and passing it to the API is included in the [example/call-api.py](example/call-api.py). More information on calling our API and setting up keys can be found on the [Alias API Github](https://github.com/roundtableAI/alias-api).