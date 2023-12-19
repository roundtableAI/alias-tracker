var jsPsychAliasTracker = (function (jspsych) {
  "use strict";

  /**
   * **jsPsychAliasTracker**
   *
   * This extension is for use with the jsPsych survey-text plugin. It tracks the text input of the user and saves it to the jsPsych data object.
   *
   * @author Mathew Hardy and Mayank Agrawal
   * @see {@link https://roundtable.ai DOCUMENTATION LINK TEXT}
   */
  class ExtensionNameExtension {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.okToTrack = true;
      this.questions = {};
      this.final_responses = {};
      this.tracking_events = {};
      this.text_over_length = {};
      this.start_times = {};
    }

    initialize(params) {
      return new Promise((resolve, reject) => {
        this.max_characters = params.max_n_characters || 55000;
        resolve();
      });
    }

    on_start(params) {
      if (!this.page_id){
        // If no page_id is provided, raise error
        throw new Error('Alias tracker extension requires a page_id parameter');
      }
      this.page_id = params.page_id;
    }

    on_load(params) {
      const currentTrialInfo = this.jsPsych.getCurrentTrial();
      const currentTrialType = currentTrialInfo.type.info.name;
      if (currentTrialType !== 'survey-text') {
        this.okToTrack = false;
        throw new Error('Alias tracker extension only works with the survey-text plugin');
      }
      const textareas = document.querySelectorAll('textarea');
      currentTrialInfo.questions.forEach((question, i) => {
        const questionId = `${this.page_id}-Q${i}`;

        // Set up tracking
        this.questions[questionId] = question.prompt;
        this.tracking_events[questionId] = [];
        this.final_responses[questionId] = undefined;
        this.start_times[questionId] = undefined;
        this.text_over_length[questionId] = false;

        // Add event listener for input
        textareas[i].addEventListener('input', (e) => {
          // Update question_responses
          this.final_responses[questionId] = e.target.value;
          // Check if over length
          if (this.text_over_length[questionId]) return;
          let t;
          if (!this.start_times[questionId]) {
            this.start_times[questionId] = Date.now();
            t = 0;
          } else {
            t = Date.now() - this.start_times[questionId];
          }
          const new_history = {
            s: e.target.value,
            t,
          };
          const length_of_history = JSON.stringify([...this.tracking_events[questionId], new_history]).length;
          if (length_of_history > this.max_characters) {
            this.text_over_length[questionId] = true;
            return;
          }
          this.tracking_events[questionId].push(new_history);
        });

        // Add event listener for copy
        textareas[i].addEventListener('copy', (e) => {
          // Check if over length
          if (this.text_over_length[questionId]) return;
          let t;
          if (!this.start_times[questionId]) {
            this.start_times[questionId] = Date.now();
            t = 0;
          } else {
              t = Date.now() - this.start_times[questionId];
          }
          const new_history = {
              s: e.target.value,
              t,
              o: 'c',
              ct: window.getSelection().toString(),
          };
          const length_of_history = JSON.stringify([...this.tracking_events[questionId], new_history]).length;
          if (length_of_history > this.max_characters) {
              this.text_over_length[questionId] = true;
              return;
          }
          this.tracking_events[questionId].push(new_history);
        });
      });
    }

    on_finish(params) {
      const return_data = {
        alias_questions: this.questions,
        alias_responses: this.final_responses,
        alias_question_histories: this.tracking_events,
      };
      const okToReturn = this.okToTrack;
      // Clear the data
      this.okToTrack = true;
      this.questions = {};
      this.final_responses = {};
      this.tracking_events = {};
      this.text_over_length = {};
      this.start_times = {};
      if (okToReturn) return return_data;
      return {};
    }
  }
  ExtensionNameExtension.info = {
    name: "alias-tracker",
  };

  return ExtensionNameExtension;
})(jsPsychModule);