var tempTemplate, template;
var tempDatabse;
var lessonData = {};
const categories = ["Vocab", "Letters", "Sentences", "Commands", "Phonemes", "Interactions"];

//document.getElementById("newStudent")
  //.addEventListener('change', generateFeedback, false);


// ---------------------------------------
//
//     Upload templates and database
//
// ---------------------------------------
document.getElementById("templateUpload")
  .addEventListener('change', readTemplate, false);

document.getElementById("databaseUpload")
  .addEventListener('change', readDatabase, false);


// checks if there's already a template in storage
function checkStorage(){
  templateChecker = document.getElementById('templateCheck');
  databaseChecker = document.getElementById('databaseCheck');

  if (localStorage.getItem('template') === null){
    templateChecker.innerHTML = "<h4>No template detected. Please upload a template.</h4>";
  } else{
    templateChecker.innerHTML = "<h4>Template found</h4>";
  }

  if (localStorage.getItem('database') === null){
    databaseChecker.innerHTML = "<h4>No database detected. Please upload a lesson database.</h4>";
  } else{
    databaseChecker.innerHTML = "<h4>Lesson database found</h4>";
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

// reads the uploaded template 
function readDatabase(event){
  // Check for the various File API support
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  } 

  let file = event.target.files[0];
  let reader = new FileReader();

  reader.onload = (function(fileInput) {
    return function(eventInput){
      tempDatabse = eventInput.target.result;
    };
  })(file);

  reader.readAsText(file);
}


// saves the uploaded template into local storage
function saveTemplate(){
  localStorage.setItem('template', tempTemplate);
}


// saves the uploaded database into local storage
function saveDatabase(){
  localStorage.setItem('database', tempDatabse);
}


// show the help message box
function toggleHelpMsg(){
  let helpMsgBox = document.getElementById("helpMsgBox");
  if (helpMsgBox.innerHTML.toString().trim() == ""){
    helpMsgBox.innerHTML = "<br>Templates are .txt files containing the sentences you use to populate your feedback."
    + "<br>It needs to be in JSON format, so use <a href=\"https://jsoneditoronline.org/\" target=\"_blank\">this website</a> to edit the template file." 
    + "<br>Sentences are divided into categories like \"opening\" and \"lessonTopic_intro\". Each sentence category can have as many sentences as you want so your generated paragraphs sound more randomized."
    + "<br>Remember to use keywords like \"~name\", \"~pronounSub\", \"~pronounObj\", \"~pronounPos\", \"~parent\", \"~item\", and \"~items\"."
    + "<br><br>Databases are .txt files containing the topics for each unit and lesson."
    + "<br>After editing the entries in an excel file, save it as a csv file with tab as field delimiters. Open the csv file with a text editor and copy the contents into <a href=\"https://www.csvjson.com/csv2json\" target=\"_blank\">this website</a> and convert it to JSON format. Finally copy the JSON data back into a .txt file and it can be uploaded as a database.";
    document.getElementById("helpMsgBtn").textContent = "Hide Template Tutorial";
  } else{
    helpMsgBox.innerHTML = "";
    document.getElementById("helpMsgBtn").textContent = "Show Template Tutorial";
  }
}



// ---------------------------------------
//
//     Update the form dynamically
//
// ---------------------------------------
document.getElementById("techProblems")
  .addEventListener('change', displayTechProblemBox, false);

document.getElementById("unit")
  .addEventListener('change', displayLessonDescriptionBox, false);

document.getElementById("lesson")
  .addEventListener('change', displayLessonDescriptionBox, false);


// display the tech problem box
function displayTechProblemBox(){
  let box = document.getElementById('techProblemsBox');
  if (box.style.display === "none"){
    box.style.display = "block";
  } else{
    box.style.display = "none";
  }
}


// fetch data from the database and display in lesson description
function displayLessonDescriptionBox(){
  let unit = document.getElementById('unit').value;
  let lesson = document.getElementById('lesson').value;

  if (unit == "" || lesson == ""){
    return;
  }

  lessonData = getLessonData(unit, lesson);
  for (let i = 0; i < categories.length; i++){
    let array = lessonData[categories[i]];
    let finalHTML = "";

    if (array[0] != ""){
      // category label
      finalHTML += "<label for=\"feedbackInput\" class=\"col-md-2\">" + 
        categories[i] + "</label>"
      // checkboxes
      finalHTML += "<div class=\"form-group\">";

      for (let j = 0; j < array.length; j++){
        let checkboxID = categories[i] + "Checkbox" + j;
        finalHTML += "<div class=\"col-md-2\">";
        finalHTML += "<input type=\"checkbox\" class=\"col-md-1\" id=\"" + 
          checkboxID + "\" value=\"" + array[j] + "\"> " + array[j] + "</div>";
      }

      finalHTML += "</div>";
    }

    document.getElementById(categories[i] + "Box").innerHTML = finalHTML;
  }
}



// ---------------------------------------
//
//    Generate feedback
//
// ---------------------------------------

// reads the form and generates feedback
function generateFeedback(){
  // quit if no template or database stored
  if (localStorage.getItem('template') === null){
    alert("Error: no template found");
    return;
  } 
  if (localStorage.getItem('database') === null){
    alert("Error: no lesson database found");
    return;
  } 

  // set up basic objects
  template = JSON.parse(localStorage.getItem('template'));
  let generatedFeedbackBox = document.getElementById('generatedFeedbackBox');
  let inputs = getFeedbackInputs();
  let feedback = "";

  // check for valid input
  if (inputs.unit == "" || inputs.lesson == "" || inputs.studentName == ""){
    alert("Error: please enter a valid unit, lesson and name");
    return;
  }

  // make sure there is a lessonData
  if (lessonData === null){
    alert("Error: no matching lesson found in database for unit " + inputs.unit + 
      ", lesson " + inputs.lesson);
    return;
  }


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
  if (inputs.techProblems == true){
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
  }


  // --- lesson description ---
  for (let i = 0; i < categories.length; i++){
    if (lessonData[categories[i]].length > 0 &&
        lessonData[categories[i]][0] != ""){
      feedback += getLessonDescription(categories[i]);
    }
  }
  
  // --- misc ---
  if (inputs.unitSong == "success"){
    feedback += getSentence("unitSongSuccess");
  } else if (inputs.unitSong == "failure"){
    feedback += getSentence("unitSongFailure");
  }
  if (inputs.otherComments != "") feedback += inputs.otherComments;

  // --- conclusion ---
  // thank parents
  if (inputs.parents != "ignore"){
    feedback += getSentence("thankParents")
      .replace(/~parents/g, inputs.parents);
  }
  // seld promo
  feedback += getSentence("selfPromo");

  // extra comments
  if (inputs.finalComments != "") feedback += inputs.finalComments;

  // conclusion
  feedback += getSentence("ending");


  // --- do some final processing on the feedback ---
  // make sure feedback has the right words and cases
  feedback = replaceWords(feedback, inputs);
  feedback = makeUpperCase(feedback);

  // show the feedback
  generatedFeedbackBox.innerHTML = "<p>" + feedback + "</p>";
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
  if (inputs.studentGender == "girl"){
    inputs.pronounSub = "she";
    inputs.pronounObj = inputs.pronounPos = "her";
  }

  // technical difficulties
  inputs.techProblems = document.getElementById('techProblems').checked;
  inputs.problemAudio = document.getElementById('problemAudio').checked;
  inputs.problemVideo = document.getElementById('problemVideo').checked;
  inputs.problemInternet = document.getElementById('problemInternet').checked;
  inputs.problemTime = document.getElementById('problemTime').checked;
  inputs.problemOther = document.getElementById('problemOtherCheckbox').checked;
  inputs.problemOtherText = document.getElementById('problemOtherText').value;

  // misc
  inputs.unitSong = document.getElementById('unitSong').value;
  inputs.otherComments = document.getElementById('otherComments').value;

  // conclusion
  inputs.parents = document.getElementById('parents').value;
  inputs.finalComments = document.getElementById('finalComments').value;

  return inputs;
}



// gets the lesson data based on the input
function getLessonData(unit, lesson){
  let database = JSON.parse(localStorage.getItem('database'));

  let targetLesson = {};
  for (let i = 0; i < database.length; i++){
    if (database[i].Unit == unit && database[i].Lesson == lesson){
      targetLesson = database[i];
    }
  }
  if (targetLesson === null){
    return null;
  }

  lessonData = {};

  for (let i = 0; i < categories.length; i++){
    let dataString = targetLesson[categories[i]];
    lessonData[categories[i]] = dataString.split(',');
  }

  return lessonData;
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
function getLessonDescription(topic){
  let successArray = [];
  let failureArray = [];
  for (let i = 0; i < lessonData[topic].length; i++){
    let checkbox = document.getElementById(topic + "Checkbox" + i);
    if (checkbox.checked){
      failureArray.push(checkbox.value);
    } else{
      successArray.push(checkbox.value);
    }
  }


  return getLessonDescriptionHelper(topic.toLowerCase(), "Success", successArray) +
    getLessonDescriptionHelper(topic.toLowerCase(), "Failure", failureArray);
}

// makes a lesson description sentence for the given successful state
function getLessonDescriptionHelper(topic, successful, array){
  let sentence = "";
  let target = topic + successful;

  if (array.length == 1){
    sentence = getLessonDescSentence(topic, successful, "single")
      .replace(/~item/g, array[0]);
  } else if (array.length > 1){
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

  return sentence;
}

// replace content-specific words in the feedback with those from the inputs
function replaceWords(feedback, inputs){
  let result = feedback;

  result = result.replace(/~name/g, inputs.studentName);
  result = result.replace(/~pronounSub/g, inputs.pronounSub);
  result = result.replace(/~pronounPos/g, inputs.pronounPos);
  result = result.replace(/~pronounSub/g, inputs.pronounSub);
  result = result.replace(/~unitCountry/g, template.unitCountry[inputs.unit - 1]);
  result = result.replace(/~unitCharacter/g, template.unitCharacter[inputs.unit - 1]);

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

    currentIndex += sentences[i].length + 1;
  }

  return result;
}

