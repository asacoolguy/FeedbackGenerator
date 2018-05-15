var tempTemplate;

document.getElementById("templateUpload")
  .addEventListener('change', readTemplate, false);


function checkTemplate(){
  checker = document.getElementById('templateCheck');

  if (localStorage.getItem('template') === null){
    checker.innerHTML = "<h4>No template detected. Please upload a template.</h4>";
  } else{
    checker.innerHTML = "<h4>Template found</h4>";
  }
}


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


function saveTemplate(){
  localStorage.setItem('template', JSON.stringify(tempTemplate));
  checkTemplate();
}


function generateFeedback(){
  let generatedFeedback = document.getElementById('generatedFeedbackBox');
  let name = document.getElementById('studentName').value;
  let lessonNumber = document.getElementById('lessonNumber').value;
  let lessonTopic = document.getElementById('lessonTopic').value;
  let template = JSON.parse(localStorage.getItem('template'));

  generatedFeedback.innerHTML = '<p>' + 
                                'student name is ' + name + ". " +
                                'Today we did lesson ' + lessonNumber + 
                                ' which is about ' + lessonTopic + ". " +
                                'Saved template is ' + template + ". " +
                                '</p>';
}