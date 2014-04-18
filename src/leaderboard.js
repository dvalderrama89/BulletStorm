var LEADERBOARD_SIZE = 5;


var scoreListRef = new Firebase('https://ezfuzion.firebaseio.com//scoreList');
var htmlForPath = {};

// Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
function handleScoreAdded(scoreSnapshot, prevScoreName) {
  var newScoreRow = $("<tr/>");
  newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
  newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

  // Store a reference to the table row so we can get it again later.
  htmlForPath[scoreSnapshot.name()] = newScoreRow;

  // Insert the new score in the appropriate place in the table.
  if (prevScoreName === null) {
    $("#leaderboard").append(newScoreRow);
  }
  else {
    var lowerScoreRow = htmlForPath[prevScoreName];
    lowerScoreRow.before(newScoreRow);
  }
}

// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleScoreRemoved(scoreSnapshot) {
  var removedScoreRow = htmlForPath[scoreSnapshot.name()];
  removedScoreRow.remove();
  delete htmlForPath[scoreSnapshot.name()];
}

// Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
var scoreListView = scoreListRef.limit(LEADERBOARD_SIZE);

// Add a callback to handle when a new score is added.
scoreListView.on('child_added', function (newScoreSnapshot, prevScoreName) {
  handleScoreAdded(newScoreSnapshot, prevScoreName);
});

// Add a callback to handle when a score is removed
scoreListView.on('child_removed', function (oldScoreSnapshot) {
  handleScoreRemoved(oldScoreSnapshot);
});

// Add a callback to handle when a score changes or moves positions.
var changedCallback = function (scoreSnapshot, prevScoreName) {
  handleScoreRemoved(scoreSnapshot);
  handleScoreAdded(scoreSnapshot, prevScoreName);
};
scoreListView.on('child_moved', changedCallback);
scoreListView.on('child_changed', changedCallback);


var newScore;
function setScore(score){
  newScore = score;
}
// When the user presses enter on scoreInput, add the score, and update the highest score.
$("#scoreInput").click(function() {

  var name = $("#nameInput").val();

  if (name.length === 0)
    return;

  var userScoreRef = scoreListRef.child(name);

  // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
  userScoreRef.setWithPriority({ name:name, score:newScore }, newScore);
  //reset score
  newScore = -1;

});
