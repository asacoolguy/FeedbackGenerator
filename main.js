var database, tempDatabase;

//document.getElementById("newStudent")
  //.addEventListener('change', generateFeedback, false);


// ---------------------------------------
//
//     Upload templates and database
//
// ---------------------------------------
document.getElementById("databaseUpload")
  .addEventListener('change', readDatabase, false);


// checks if there's already a template in storage
function checkStorage(){
  databaseChecker = document.getElementById('databaseCheck');

  if (localStorage.getItem('database') === null){
    databaseChecker.innerHTML = "<h4>No database detected. Please upload a lesson database.</h4>";
  } else{
    databaseChecker.innerHTML = "<h4>Lesson database found</h4>";
  }
}


// reads the uploaded database 
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
      tempDatabase = parseDatabase(eventInput.target.result);
    };
  })(file);

  reader.readAsText(file);
}


// saves the uploaded database into local storage
function saveDatabase(){
  console.log(tempDatabase);
  localStorage.setItem('database', JSON.stringify(tempDatabase));
}


// ---------------------------------------
//
//    Generate feedback
//
// ---------------------------------------

// reads the form and generates feedback
function generateFeedback(){
  // quit if no database stored
  if (localStorage.getItem('database') === null){
    alert("Error: no lesson database found");
    return;
  } 

  // set up basic objects and parse the database
  let database = JSON.parse(localStorage.getItem('database'));
  let generatedFeedbackBox = document.getElementById('generatedFeedbackBox');
  let inputs = getFeedbackInputs();

  // check for valid input
  if (inputs.unit == "" || inputs.lesson == "" || inputs.studentName == ""){
    alert("Error: please enter a valid unit, lesson and name");
    return;
  }


  // fetch the right feedback
  let key = inputs.unit + "." + inputs.lesson;
  let feedback = database[key];
  if (feedback == ""){
    feedback = "No feedback found for this unit and chapter.";
  } else{
    // replace name and pronouns

  }

  generatedFeedbackBox.innerHTML = "<p>" + feedback + "</p>";
}



// parse the database file into a JSON file
function parseDatabase(input){
  let database = {};
  let rows = input.split('\n');
  
  for (let i = 0; i < rows.length; i++){
    let columns = rows[i].split('\t');
    database[columns[0]] = columns[1];
  }

  return database;
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
  inputs.pronounSub = "he";
  inputs.pronounObj = "him";
  inputs.pronounPos = "his";
  if (inputs.studentGender == "girl"){
    inputs.pronounSub = "she";
    inputs.pronounObj = inputs.pronounPos = "her";
  }

  return inputs;  
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


// replace content-specific words in the feedback with those from the inputs
function replaceWords(feedback, inputs){
  let result = feedback;

  result = result.replace(/Baobao/g, inputs.studentName);
  // subject pronouns
  result = result.replace(/\she\s/g, " " + inputs.pronounSub + " ");
  result = result.replace(/\sshe\s/g, " " + inputs.pronounSub + " ");
  result = result.replace(/\sHe\s/g, " " + inputs.pronounSub + " ");
  result = result.replace(/\sShe\s/g, " " + inputs.pronounSub + " ");
  // possesive pronouns
  result = result.replace(/\shis\s/g, " " + inputs.pronounPos + " ");
  result = result.replace(/\sher\s/g, " " + inputs.pronounPos + " ");
  result = result.replace(/\shers\s/g, " " + inputs.pronounPos + " ");
  result = result.replace(/\sHis\s/g, " " + inputs.pronounPos + " ");
  result = result.replace(/\sHer\s/g, " " + inputs.pronounPos + " ");
  result = result.replace(/\shis./g, " " + inputs.pronounPos + ".");
  result = result.replace(/\sher./g, " " + inputs.pronounPos + ".");
  result = result.replace(/\shers./g, " " + inputs.pronounPos + ".");
  result = result.replace(/\shis,/g, " " + inputs.pronounPos + ",");
  result = result.replace(/\sher,/g, " " + inputs.pronounPos + ",");
  result = result.replace(/\shers,/g, " " + inputs.pronounPos + ",");
  result = result.replace(/\shis!/g, " " + inputs.pronounPos + "!");
  result = result.replace(/\sher!/g, " " + inputs.pronounPos + "!");
  result = result.replace(/\shers!/g, " " + inputs.pronounPos + "!");
  result = result.replace(/\shis\?/g, " " + inputs.pronounPos + "?");
  result = result.replace(/\sher\?/g, " " + inputs.pronounPos + "?");
  result = result.replace(/\shers\?/g, " " + inputs.pronounPos + "?");
  // object pronouns
  result = result.replace(/\shim\s/g, inputs.pronounSub);

  return result;
}



// takes a paragraph and uppercase the first letter of each sentence
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

