const jsPsych = initJsPsych({
  extensions: [
    { type: jsPsychAliasTracker }
  ],
  on_finish: function() {
    // Save the data to data.json
    const data = jsPsych.data.get().json();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger download
    const a = document.createElement('a');
    document.body.appendChild(a); // Append the anchor to the body
    a.style = 'display: none';
    a.href = url;
    a.download = 'data.json';
    a.click(); // Trigger the download

    // Clean up
    window.URL.revokeObjectURL(url);
    a.remove();

    jsPsych.data.displayData();
  }, 
});

// Add participant ID and survey ID
jsPsych.data.addProperties({
  participant_id: 'participant_123',
  survey_id: 'survey_456',
});

const instructions = {
  type: jsPsychInstructions,
  pages: [
    'This is a simple example of using the Roundtable Alias library with jsPsych.',
    'We will collect data from three open-ended questions. The tracking data will be automatically saved to the jsPsych data by using the Alias extension for the survey-text plugin.',
    'The experiment data will be logged to the window at the end of the experiment. You then pass the generated Alias data to our API for scoring.',
  ],
  button_label_next: "Continue",
  show_clickable_nav: true
}

const openEndsPage1 = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: 'Tell me about yourself', required: true, rows: 6 },
    { prompt: 'Why are you participating in this study?', rows: 6 },
  ],
  extensions: [
    { type: jsPsychAliasTracker, params: { page_id: 'page1' } }
  ]
}

const openEndsPage2 = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: 'What do you think was the purpose of this experiment?', required: true, rows: 6 },
  ],
  extensions: [
    { type: jsPsychAliasTracker, params: { page_id:'page2' } }
  ]
}

const timeline = [ instructions, openEndsPage1, openEndsPage2 ];

jsPsych.run(timeline)