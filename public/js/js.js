$(document).ready(function(){

      var signingUp = false;
      var loggingIn = false;

      $('#signup').click(function(){
        if(signingUp){

          var userID = $('#signupUsername').val();
          var myUsername = $('#signupName').val();
          var myEmail = $('#signupEmail').val();
          if(userID != '' && myUsername != '' && myEmail != ''){
            writeUserProfile(userID, myUsername, myEmail ,'https://www.arcadia.edu/sites/default/files/default-user.png');
            $('#signupForm').hide();
            $('#login').hide();
            $('#signup').hide();
          }else {
            alert('you need to fill out all the fields!');
          }

        }else{
          signingUp = true;
          loggingIn = false;
          $('#signupForm').show();
          $('#loginForm').hide();
          $('#signupUsername').focus();
        }
      });
        

      $('#login').click(function(){
        if(loggingIn){

          console.log('user clicked login...');
          var userID = $('#loginUsername').val();

          if(userID != ''){
            login(userID);
            $('#loginForm').hide();
            $('#login').hide();
            $('#signup').hide();
          }else {
            alert('you need to fill out your username!');
          }

        }else{
          $('#loginUsername').focus();
          signingUp = false;
          loggingIn = true;
          $('#loginForm').show();
          $('#signupForm').hide();
        }
      });



       $('#uploadCurrentSong').click(function(){
        var mySongLink = $('#currentSong').val();
        setANewSong(mySongLink);
       });





    });

    //writeUserData('007','Zoe Rogers', 'zoeRogers@email.com','https://scontent.xx.fbcdn.net/v/t1.0-1/c0.0.130.130/p130x130/15327488_10154747310503908_6968614292008202244_n.jpg?oh=9f7e5f0dbb693d0d69df2d63ee0d66c7&oe=594511BB');





      //EVERYTHING BELOW THIS IS RE-USABLE FUNCTIONS -----------------------------------

      function writeUserProfile(userId, name, email, imageUrl) {

        window.username = userId;
        window.name = name;
        window.email = email;
        window.imageUrl = imageUrl;

        firebase.database().ref('users/' + userId).set({
          username: name,
          email: email,
          profile_picture : imageUrl
        });
        getLocation();
      }


      function updateUserLocation(userId, location) {
        firebase.database().ref('users/' + userId).update({
          lat:location.coords.latitude,
          lon:location.coords.longitude
        });
      }


      function setANewSong(songLink) {
        var userId = window.username;
        firebase.database().ref('users/' + userId).update({
          currentSong:songLink
        });
      }



        //var userId = firebase.auth().currentUser.uid;
        //var userId = '007';

        function login(userId){

          window.username = userId;

          console.log('starting the login function...');
          firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {

            //get back some data:
            var username = snapshot.val().username;
            var profile_picture = snapshot.val().profile_picture;
            var email = snapshot.val().email;

            window.name = username;
            window.email = email;
            window.imageUrl = profile_picture;

            //after we get that data, we do some stuff with it:
            $('#profilePic').css('background','url('+profile_picture+') center center no-repeat').css('background-size','cover').fadeIn();
            $('#username').html(username).attr('title',email).fadeIn();

            console.log('about to get the user location..');
            getLocation();
            

          // ...
          });

          $('#currentSongForm').fadeIn();
        }

        function getAllUserLocations(){
          firebase.database().ref('/users').once('value').then(function(snapshot) {

            console.log(snapshot.val());

            var data = snapshot.val();

            var myLat = window.myPosition.coords.latitude;
            var myLong = window.myPosition.coords.longitude;

            /*for(key in obj){
                if(key)
                // The key is key
                // The value is obj[key]
            }*/
            var thisDistance = 0;
            var peopleCloseBy = [];
            $('#people').html('');
            for (var key in data){

                console.log(data[key]);

                var thisLong = data[key].lon;
                var thisLat = data[key].lat;
                thisDistance = distance(myLat, myLong, thisLat, thisLong);
                console.log('distance: '+thisDistance);
                //console.log(key);
                //console.log(value);

                if(thisDistance < 0.1){
                  //alert("there's someone close by! "+thisDistance);

                  var songHtml = '';
                  if(data[key].currentSong){
                    songHtml = '<a href = "' + data[key].currentSong + '">Listen to my song!</a>';
                  }

                  peopleCloseBy.push(data[key].username);
                  $('#people').append('<br><div>'+data[key].username+' : ' + thisDistance + '<br>'+songHtml+'</div><br>');
                }

            }



            

            /*//get back some data:
            var username = snapshot.val().username;
            var profile_picture = snapshot.val().profile_picture;
            var email = snapshot.val().email;


            //after we get that data, we do some stuff with it:
            $('#profilePic').css('background','url('+profile_picture+') center center no-repeat').css('background-size','cover').fadeIn();
            $('#username').html(username).attr('title',email).fadeIn();

            console.log('about to get the user location..');
            getLocation();*/
            


          // ...
          });
        }


            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            }
            function showPosition(position) {
                //alert("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude); 

                var userID = window.username;
                window.myPosition = position;

                updateUserLocation(userID,position);
                getAllUserLocations();
            }




            function distance(lat1, lon1, lat2, lon2, unit) {
              var radlat1 = Math.PI * lat1/180
              var radlat2 = Math.PI * lat2/180
              var theta = lon1-lon2
              var radtheta = Math.PI * theta/180
              var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
              dist = Math.acos(dist)
              dist = dist * 180/Math.PI
              dist = dist * 60 * 1.1515
              if (unit=="K") { dist = dist * 1.609344 }
              if (unit=="N") { dist = dist * 0.8684 }
              return dist;
            }