var tempTemplate, template;

document.getElementById("templateUpload")
  .addEventListener('change', readTemplate, false);

document.getElementById("newStudent")
  .addEventListener('change', generateFeedback, false);


// checks if there's already a template in storage
function checkTemplate(){
  checker = document.getElementById('templateCheck');

  if (localStorage.getItem('template') === null){
    checker.innerHTML = "<h4>No template detected. Please upload a template.</h4>";
  } else{
    checker.innerHTML = "<h4>Template found</h4>";
  }
}


// reads the uploaded template 
function readTemplate(event){
  // Check for the various File API support
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  } 

  let file = event.target.files[0];
  let reader = new FileReader();

  reader.onload = (function(fileInput) {
    return function(eventInput){
      tempTemplate = eventInput.target.result;
    };
  })(file);

  reader.readAsText(file);
}


// saves the uploaded template into local storage
function saveTemplate(){
  localStorage.setItem('template', tempTemplate);
  checkTemplate();
}


// get feedback inputs from the form and store into an object
function getFeedbackInputs(){
  let inputs = {}
  // lesson info
  inputs.unit = document.getElementById('unit').value;
  inputs.lesson = document.getElementById('lesson').value;

  // student info
  inputs.studentName = document.getElementById('name').value;
  inputs.studentGender = document.getElementById('gender').value;
  inputs.newStudent = document.getElementById('newStudent').checked;
  inputs.pronounSub = "he";
  inputs.pronounObj = "him";
  inputs.pronounPos = "his";
  if (gender == "girl"){
    inputs.pronounSub = "she";
    inputs.pronounObj = inputs.pronounPos = "her";
  }

  // technical difficulties
  inputs.problemAudio = document.getElementById('problemAudio').checked;
  inputs.problemVideo = document.getElementById('problemVideo').checked;
  inputs.problemInternet = document.getElementById('problemInternet').checked;
  inputs.problemTime = document.getElementById('problemTime').checked;
  inputs.problemOther = document.getElementById('problemOtherCheckbox').checked;
  inputs.problemOtherText = document.getElementById('problemOtherText').value;
  
  // lesson descriptions
  inputs.vocabSuccess = document.getElementById('vocabSuccess').value;
  inputs.vocabFailure = document.getElementById('vocabFailure').value;
  inputs.vocabComments = document.getElementById('vocabComments').value;
  inputs.lettersSuccess = document.getElementById('lettersSuccess').value;
  inputs.lettersFailure = document.getElementById('lettersFailure').value;
  inputs.lettersComments = document.getElementById('lettersComments').value;
  inputs.sentencesSuccess = document.getElementById('sentencesSuccess').value;
  inputs.sentencesFailure = document.getElementById('sentencesFailure').value;
  inputs.sentencesComments = document.getElementById('sentencesComments').value;
  inputs.commandsSuccess = document.getElementById('commandsSuccess').value;
  inputs.commandsFailure = document.getElementById('commandsFailure').value;
  inputs.commandsComments = document.getElementById('commandsComments').value;
  inputs.phonemesSuccess = document.getElementById('phonemesSuccess').value;
  inputs.phonemesFailure = document.getElementById('phonemesFailure').value;
  inputs.phonemesComments = document.getElementById('phonemesComments').value;
  inputs.interactionSuccess = document.getElementById('interactionSuccess').value;
  inputs.interactionFailure = document.getElementById('interactionFailure').value;
  inputs.interactionComments = document.getElementById('interactionComments').value;

  // misc
  inputs.unitSong = document.getElementById('unitSong').value;
  inputs.otherComments = document.getElementById('otherComments').value;

  // conclusion
  inputs.parents = document.getElementById('parents').value;
  inputs.extraComment = document.getElementById('extraComment').value;

  return inputs;
}



// reads the form and generates feedback
function generateFeedback(){
  // quit if no template stored
  if (localStorage.getItem('template') === null){
    alert("Error: no template found");
    return;
  } 

  // set up basic objects
  template = JSON.parse(localStorage.getItem('template'));
  let generatedFeedbackBox = document.getElementById('generatedFeedbackBox');
  let inputs = getFeedbackInputs();
  let feedback = "";
  let randomNumber = 0;

  // -----------------------------
  //     assemble the feedback 
  // -----------------------------
  // --- opening sentence ---
  let openingSentence = "";
  if (inputs.newStudent == true){
    openingSentence = getSentence("opening_newStudent");
  } else{
    openingSentence = getSentence("opening");
  }
  feedback += openingSentence;

  // --- lesson-dependent topic sentences ---
  let topicSentence = "";
  if (inputs.lesson == 1){
    topicSentence = getSentence("lessonTopic_intro");
  } else if (lesson == 4){
    topicSentence = getSentence("lessonTopic_checkpoint");
  } else if (lesson == 8){
    topicSentence = getSentence("lessonTopic_assessment");
  }
  feedback += topicSentence;

  // --- technical difficulties and other issues ---
  let techProblems = [];
  if (inputs.problemAudio == true) techProblems.push("the audio");
  if (inputs.problemVideo == true) techProblems.push("the video");
  if (inputs.problemInternet == true) techProblems.push("the internet speed");

  if (techProblems.length > 0){
    let techProbPhrase = "";
    if (techProblems.length == 1){
      techProbPhrase = techProblems[0];
    } else if (techProblems.length == 2){
      techProbPhrase = techProblems[0] + " and " + techProblems[1];
    } else{
      techProbPhrase = techProblems[0] + ". " + techProblems[1] + ", and " +
        techProblems[2];
    }
    feedback += getSentence("techProblems")
      .replace(/~techProblems/g, techProbPhrase);
  }

  if (inputs.problemTime == true){
    if(techProblems.length > 0){
      feedback += getSentence("didNotFinishBecauseTechProblems");
    } else{
      feedback += getSentence("didNotFinish");
    }
  }

  if (inputs.problemOther == true && inputs.problemOther != ""){
    feedback += inputs.problemOtherText;
  }

  // --- lesson description ---
  feedback += getLessonDescription("vocab", inputs);
  feedback += getLessonDescription("letters", inputs);
  feedback += getLessonDescription("sentences", inputs);
  feedback += getLessonDescription("commands", inputs);
  feedback += getLessonDescription("phonemes", inputs);
  feedback += getLessonDescription("interaction", inputs);
  
  // --- misc ---
  if (inputs.unitSong == "success"){
    feedback += getSentence("unitSongSuccess");
  } else if (inputs.unitSong == "failure"){
    feedback += getSentence("unitSongFailure");
  }
  if (inputs.otherComments != "") feedback += inputs.otherComments;

  // --- conclusion ---
  // thank parents
  feedback += getSentence("thankParents")
    .replace(/~parents/g, inputs.parents);

  // seld promo
  feedback += getSentence("selfPromo");

  // extra comments
  if (inputs.extraComment != "") feedback += inputs.extraComment;

  // conclusion
  feedback += getSentence("ending");


  // --- do some final processing on the feedback ---
  // make sure feedback has the right words and cases
  feedback = replaceWords(feedback, inputs);
  feedback = makeUpperCase(feedback);

  // show the feedback
  generatedFeedbackBox.innerHTML = "<p>" + feedback + "</p>";
}


// returns a random sentence from the appropriate array in template
function getSentence(sentence){
  let r = Math.floor(Math.random() * template[sentence].length);
  return template[sentence][r];
}

// returns a random sentence from the appropriate lesson description
function getLessonDescSentence(topic, successful, singular){
  let target = topic + "Description";
  let r = Math.floor(Math.random() * template[target][successful][singular].length);
  return template[target][successful][singular][r];
}


// makes a lesson description sentence
function getLessonDescription(topic, inputs){
  return getLessonDescriptionHelper(topic, "Success", inputs) +
   " " + getLessonDescriptionHelper(topic, "Failure", inputs) +
   " " + inputs[topic + "Comments"];
}

// makes a lesson description sentence for the given successful state
function getLessonDescriptionHelper(topic, successful, inputs){
  let sentence = "";
  let target = topic + successful;

  if (inputs[target] != ""){
    let array = inputs[target].split(",");
    
    if (array.length == 1){
      sentence = getLessonDescSentence(topic, successful, "single")
        .replace(/~item/g, array[0]);
    } else{
      let words = "";
      if (array.length == 2){
        words = array[0] + " and " + array[1];
      } else{
        for (let i = 0; i < array.length - 1; i++){
          words += array[i] + ", ";
        }
        words += "and " + array[array.length - 1];
      }

      sentence = getLessonDescSentence(topic, successful, "multiple")
        .replace(/~items/g, words);
    }
  }

  return sentence;
}

// replace content-specific words in the feedback with those from the inputs
function replaceWords(feedback, inputs){
  let result = feedback;

  result = result.replace(/~name/g, inputs.studentName);
  result = result.replace(/~pronounSub/g, inputs.pronounSub);
  result = result.replace(/~pronounPos/g, inputs.pronounPos);
  result = result.replace(/~pronounSub/g, inputs.pronounSub);
  result = result.replace(/~unitCountry/g, template.unitCountry[inputs.unit]);
  result = result.replace(/~unitCharacter/g, template.unitCharacter[inputs.unit]);

  return result;
}



// takes a string and uppercase the first letter of each sentence
function makeUpperCase(feedback){
  let sentences = feedback.split(/[.!?]+/);
  let result = "";

  let currentIndex = 0;
  for (let i = 0; i < sentences.length; i++){
    let trimmedSentence = sentences[i].trim();
    let firstChar = trimmedSentence.charAt(0).toUpperCase();
    let punctuation = feedback.substr(currentIndex + feedback.substr(currentIndex).search(/[.!?]+/), 1);
    result += firstChar + trimmedSentence.substr(1) + punctuation + " ";

    currentIndex += sentences[i].length;
  }

  return result;
}

