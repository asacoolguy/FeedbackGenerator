function generateFeedback(){
  let feedback = "";
  let generatedFeedbackBox = document.getElementById('generatedFeedbackBox');

  // lesson info
  let unit = document.getElementById('unit').value;
  let lesson = document.getElementById('lesson').value;

  // student info
  let name = document.getElementById('name').value;
  let gender = document.getElementById('gender').value;
  let newStudent = document.getElementById('newStudent').checked;
  let pronounSub = "he";
  let pronounObj = "him";
  let pronounPos = "his";
  if (gender == "girl"){
    pronounSub = "she";
    pronounObj = pronounPos = "her";
  }

  // technical difficulties
  let problemAudio = document.getElementById('problemAudio').checked;
  let problemVideo = document.getElementById('problemVideo').checked;
  let problemInternet = document.getElementById('problemInternet').checked;
  let problemTime = document.getElementById('problemTime').checked;
  let problemOther = document.getElementById('problemOtherCheckbox').checked;
  let problemOtherText = document.getElementById('problemOtherText').value;
  
  // lesson description
  let vocabSuccess = document.getElementById('vocabSuccess').value;
  let vocabFailure = document.getElementById('vocabFailure').value;
  let lettersSuccess = document.getElementById('lettersSuccess').value;
  let lettersFailure = document.getElementById('lettersFailure').value;

  // misc
  let parent = document.getElementById('parents').value;
  let extraComment = document.getElementById('extraComment').value;

  // --- assemble the feedback ---
  // opening sentence
  feedback += "It was a pleasure teaching " + name;
  if (newStudent == false){
    feedback += " again today! ";
  } else{
    feedback += " for the first time today! " +
      "Thank you for giving me the opportunity to teach your child English. ";
  }

  // special lesson description
  if (lesson == 1){
    feedback += "Today we learned about the country from unit " + 
      unit + " and introduce the character from unit " + unit + ". "
  } else if (lesson == 4){
    feedback += pronounSub + 
      " did a great job today with the checkpoint lesson. ";   
  } else if (lesson == 8){
    feedback += pronounSub +
      " did agreat job today with the assessment lesson. ";
  }

  // technical difficulties
  let techProblems = [];
  if (problemAudio == true) techProblems.push("the audio");
  if (problemVideo == true) techProblems.push("the video");
  if (problemInternet == true) techProblems.push("the internet speed");

  if (techProblems.length > 0){
    feedback += "Unfortunately, we had some issues with ";
    if (techProblems.length == 1){
      feedback += techProblems[0] + " today. ";
    } else if (techProblems.length == 2){
      feedback += techProblems[0] + " and " + techProblems[1] + " today. ";
    } else{
      for(let i = 0; i < techProblems.length - 1; i++){
        feedback += techProblems[i] + ", ";
      }
      feedback += " and " + techProblems[techProblems.length - 1] + ". ";
    }
  }

  if (problemTime == true){
    if (techProblems.length > 0){
      feedback += "Because of these issues, we did not end up finishing" +
        " all of today's lesson. ";
    } else{
      feedback += "Unfortunately, we did not get to finish all of today's lesson. ";
    }
  }

  if (problemOther == true && problemOtherText != ""){
    feedback += problemOtherText + " ";
  }

  // lesson description
  // vocabs
  if (vocabSuccess != ""){
    let vocabs = vocabSuccess.split(",");
    if (vocabs.length == 1){
      feedback += pronounSub + " did a great job with the vocab word " +
        vocabs[0] + ". ";
    } else if (vocabs.length == 2){
      feedback += pronounSub + " did a great job with the vocab words " +
        vocabs[0] + " and " + vocabs[1] + ". ";
    } else{
      feedback += pronounSub + " did a great job with the vocab words ";
      for(let i = 0; i < vocabs.length - 1; i++){
        feedback += vocabs[i] + ", ";
      }
      feedback += " and " + vocabs[vocabs.length - 1] + ". ";
    }
  }
  if (vocabFailure != ""){
    let vocabs = vocabFailure.split(",");
    if (vocabs.length == 1){
      feedback += "However, " + pronounSub + 
        " could use more practice with the word " +
        vocabs[0] + ". ";
    } else if (vocabs.length == 2){
      feedback += "However, " + pronounSub + 
        " could use more practice with the words " +
        vocabs[0] + " and " + vocabs[1] + ". ";
    } else{
      feedback += "However, " + pronounSub + 
        " could use more practice with the words ";
      for(let i = 0; i < vocabs.length - 1; i++){
        feedback += vocabs[i] + ", ";
      }
      feedback += " and " + vocabs[vocabs.length - 1] + ". ";
    }
  }

  // thank parents
  let parentPresent = "dad";
  if (parent == "mom") parentPresent = "mom";
  if (parent == "both") parentPresent = "mom and dad";
  feedback += "Thank you for a wonderful lesson, and thank you, " +
    parentPresent + ", for choosing me to be your child's teacher! ";

  // like share and subscribe
  feedback += "If you enjoyed the lesson, please consider leaving me feedback too. " +
    "Thank you. ";

  // extra comments
  if (extraComment != ""){
    feedback += extraComment;
  }

  // conclusion
  feedback += " Thank you and hope to see you again!  -Teacher Grace";

  // run a script through it to make sure sentences start with Uppercase


  // show the feedback
  generatedFeedbackBox.innerHTML = "<p>" + feedback + "</p>";
}