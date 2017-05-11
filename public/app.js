function loadIndex() {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', '/projects/');
  xhr.send(null);

  xhr.onreadystatechange = function() {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        console.log('Response:' + xhr.responseText); // 'This is the returned text.'
        var projects = JSON.parse(xhr.responseText);
        $('#catalogItems').empty();
        $('#catalogItems').html(list(projects));

      } else {
        console.log('Error: ' + xhr.status); // An error occurred during the request.
      }
    }
  }
}

function showLarge(project) {
  console.log(project.id);
  // var url = '/images/' + project.filename;
  var url = '/images/' + project.filename;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send(null);

  //TODO: Handle the returned list of song files

  $('#largeImg').attr('src', url);
  $('#itemName').html(project.name);
  $('#itemInfo').html(project.artist + ' - ' + project.genre);
  $('#selectedItemPanel').css('visibility', 'visible');
  $('#musicFiles').html(serveMusicFiles(project.id));

  $('#musicFile').attr('value', project.id);
  $('#musicForm').attr('action', "http://localhost:3000/songUploads/" + project.id);
}

function serveMusicFiles(albumID) {
  var musicHTML = $('<ul>');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/music/' + albumID);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        console.log('Response:' + xhr.responseText); // 'This is the returned text.'
        var musicFiles = JSON.parse(xhr.responseText);
        musicFiles.forEach(function(song) {
          if (song) {
            var name = song.split('.')[0];
            var html = '<h5>' + name + '</h5><li style="list-style:none"><audio controls><source src="/music/'+ albumID+ '/' + song + '" type="audio/mpeg"></audio></li>';
            $(html).appendTo(musicHTML);
          }
        });

      } else {
        console.log('Error: ' + xhr.status); // An error occurred during the request.
      }
    }
  }
  return musicHTML;
}

function list(projects){
  // var table = $('<table>').addClass('table');
  // var head = $('<tr>').append('<th>Albums</th>').appendTo(table);
  var ul = $('<ul>').addClass('row first');
  // var ul = $('<ul>');
  projects.forEach(function(project) {
    // console.log(project);
    var html =
    '<li class="col-lg-2 col-md-4 col-sm-3 col-xs-4 col-xxs-12 bspHasModal" style="list-style:none; margin-bottom:25px;">' +
      '<div class="imgWrapper"><img class="img-responsive" src="/images/' + project.filename + '" alt="blood"/></div>' +
      '<div class="caption" style="background-color: white;">' +
        '<p>' + project.name + '</p>' +
      '</div>' +
    '</li>';
//     var html =
//     '<div class="col-sm-2">' +
//       '<div class="thumbnail">' +
//          '<a href="/w3images/lights.jpg">' +
//           '<img src="/images/blood.png" alt="blood" style="width:200px">' +
//           '<div class="caption">' +
//             '<p>' + project.name + '</p>' +
//           '</div>' +
//         '</a>'
//       '</div>' +
//     '</div>';

    // $('<tr>').append(html)
    $(html)
      .click(function(event) {
        event.preventDefault();
        //alert("Load using Ajax");
        console.log(project.name + " clicked");
        showLarge(project);
        unselectAll();
      }).appendTo(ul);
  });
  return ul;
}

function unselectAll() {
    if(document.selection) document.selection.empty();
    if(window.getSelection) window.getSelection().removeAllRanges();
}
function hideMe(obj) {
    obj.style.visibility = 'hidden';
}

var displayMessage = function(message, type){
  var html = '<div id="javascriptMessage" class="alert fade show alert-dismissable alert-'
           + type + '"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><span class="h4">'
           + message + ' </span></div>';
  $('#message').append(html);
  setTimeout(function() {
  	$("#javascriptMessage").alert('close');
  }, 3000);
};

$('#addItem').on('click', function() {
  var form = $('#editForm');
  if (form.css('visibility') == 'visible') {
    form.css('visibility', 'hidden');
  }
  else {
    form.css('visibility', 'visible');
  }
});

// $('#submitItem').on('click', function() {
//     displayMessage('Item Uploaded.', 'success');
// });

// var form = new FormData($("#uploadForm")[0]);
// $.ajax({
//         url: your_url,
//         method: "POST",
//         dataType: 'json',
//         data: form,
//         processData: false,
//         contentType: false,
//         success: function(result){},
//         error: function(er){}
// });

loadIndex();
