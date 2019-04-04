// Initalize Firebase 
var config = {
  apiKey: "AIzaSyB70faeS2A1Iihc_lXvJqwUEM2X8fU6kfk",
  authDomain: "test-auth-cdc10.firebaseapp.com",
  databaseURL: "https://test-auth-cdc10.firebaseio.com",
  projectId: "test-auth-cdc10",
  storageBucket: "test-auth-cdc10.appspot.com",
  messagingSenderId: "242923614816"
};
// firebase.initializeApp(config);

var database = firebase.database();


// 1. if the person just click submit without filling out the form he shoulf 
// 2. he should get 5 recipes of certain ingrediants - should be displayed
// 3. if anything is filled out, the
// all the global vars 
var apiId = "bee074ae"
var apiKey = '35f0b53adef2a154fbff9b7a401cc1f7'
var ingrds = ["chicken", "beef", "soup", "lamb", "vegetables"]
var randomIngrd;
var link;
var getRecipesUrl;
var timeInSeconds;
var userIngredient;
var userTime;
var neut;
var def;
var defu;

// the on click function
$("#subBtn").click(function () {
  randomIngrd = ingrds[Math.floor(ingrds.length * Math.random())]
  userTime = $("#cookingtime").val()
  timeInSeconds = userTime * 60
  userIngredient = $("#ingredients").val().trim();
  var userDiet = $("#dietary").val()
  var userHealth = $("#allergy").val()
  def = "FASAT"
  defu = "393^Gluten-Free"
  //the search using the form or no

  getRecipesUrl = `https://api.yummly.com/v1/api/recipes?_app_id=${apiId}&_app_key=${apiKey}&q=${userIngredient ? userIngredient : randomIngrd}&requirePictures=true&maxTotalTimeInSeconds=${timeInSeconds ? timeInSeconds : 2400}&nutrition.${userDiet ? userDiet : def}.max=20&allowedAllergy[]=${userHealth ? userHealth : defu}&maxResult=5&start=5&sourceRecipeUrl`

  // the ajax calls
  $.get(getRecipesUrl)
    .then(function (results) {
      console.log(results)
      // display 5 recipes
      var recipes = results.matches
      console.log(recipes)
      // Empty recipe div before displaying list
      $("#recipeResults").empty();

      for (var i = 0; i < recipes.length; i++) {
        var recipeName = recipes[i].recipeName;
        var recipeId = recipes[i].id;
        var ingredients = recipes[i].ingredients
        var time = (recipes[i].totalTimeInSeconds) / 60
        var calories = 200
        var recipeImage = recipes[i].smallImageUrls[0]
        var getRecipeStepsUrl = `https://api.yummly.com/v1/api/recipe/${recipeId}?_app_id=${apiId}&_app_key=${apiKey}`

        // Build HTML
        var recipeContainer = $("<div class='recipeContainer'>");
        $("#recipeResults").append(recipeContainer);
        var recipeNameContainer = $("<div>")
        recipeContainer.append(recipeNameContainer);
        var recipeNameTag = $("<h1 class='recName'>").text(recipeName)
        recipeNameContainer.append(recipeNameTag);
        var favoriteIcon = $("<i class='favoriteIcon material-icons lime-text'>favorite_border</i>")
        favoriteIcon.attr("data-recipeId", recipeId);
        favoriteIcon.data("recipeId", recipeId);
        recipeNameContainer.append(favoriteIcon);
        var recipeImageDiv = $(`<div> <img class='image' src='${recipeImage}'> </div>`)
        recipeContainer.append(recipeImageDiv);
        var detailsList = $("<ul class='detailsList'>");
        recipeContainer.append(detailsList);
        var cookTimeLi = $("<li class='cookTimeLi grey-text text-darken-2'>  <span class='cookTitle'>Cook Time:</span>  <span class='grey-text text-darken-2 cookTime'></span></li>");
        cookTimeLi.find(".cookTime").text(time);
        detailsList.append(cookTimeLi);
        var caloriesLi = $("<li class='caloriesLi grey-text text-darken-2'>  <span class='caloriesTitle'>Calories:</span>  <span id='" + recipeId + "' class='grey-text text-darken-2 calories'></span></li>");
        caloriesLi.find(".calories").text(calories);
        detailsList.append(caloriesLi);
        var ingredientsDiv = $("<div>");
        recipeContainer.append(ingredientsDiv);
        var ingredientsHead = $("<h1 class='grey-text text-darken-2 ingredientsHead'>Ingredients:</h1>");
        ingredientsDiv.append(ingredientsHead);
        var ingredientsOL = $("<ol class='ingredientsList'>")
        ingredientsDiv.append(ingredientsOL);
        for (var k = 0; k < ingredients.length; k++) {
          var ingredientsLi = $("<li>")
          ingredientsLi.text(ingredients[k]);
          ingredientsOL.append(ingredientsLi);
        };
        var hr = $("<div class='divider'></div>")
        recipeContainer.append(hr);

        //gets the recipe steps
        $.get(getRecipeStepsUrl)
          .then(function (results) {
            link = results.source.sourceRecipeUrl
            for (var i = 0; i < results.nutritionEstimates.length; i++) {
              if (results.nutritionEstimates[i].attribute === "ENERC_KCAL") {

                calories = Math.floor(results.nutritionEstimates[i].value)
                console.log(results)
                $("#" + results.id).text(calories);
              }
            }
          });
      };
    })
  // Scroll to recipe list
  $("html, body").animate({
    scrollTop: $("#recipeResults").offset().top
  }, 700);
});


$(document).on("click", ".favoriteIcon", function () {
  $(this).html("favorite");
  var favoritedRecipe = $(this).data("recipeId")
  console.log("The recipeId is: " + favoritedRecipe);

  // Get user id
  firebase.auth().onAuthStateChanged((user) => {
    console.log('User ID', user.uid)
    user = user.uid

    // Check recipe already exists in favorites - using Firebase exists method
    console.log('user', user)
    let favRef = database.ref(`/users/${user}/`);
    favRef.orderByChild("favorites").equalTo(favoritedRecipe).once("value", function (snapshot) {
      if (snapshot.exists()) {
        console.log('does exists')
      } else {
        console.log("does not exists")
        console.log('new favorite add to list - adding to Firebase database')
        database.ref(`users/${user}/favorites`).push(favoritedRecipe);
      }
    });


    // Check recipe already exists in favorites
    // console.log(user)
    // let favRef = database.ref(`/users/${user}/favorites`)
    // let favArray = [];
    // favRef.once("value", function (snapshot) {
    //   snapshot.forEach((childSnapshot) => {
    //     let favList = childSnapshot.val();
    //     favArray.push(favList);
    //   })
    //   console.log('favArray', favArray)
    //   if (favArray.includes(favoritedRecipe)) {
    //     console.log('Favorite recipe already exsits')
    //     // Message user know recipe already stored in favorites
    //     M.toast({ html: 'Recipe already stored in your favorites' })
    //   } else {
    //     console.log('new favorite add to list - adding to Firebase database')
    //     database.ref(`users/${user}/favorites`).push(favoritedRecipe);
    //     favArray = [];
    //   }
    // });
  })
});

$("#favoriteLink").on("click", function () {
  $("#display-favs").empty();

  // Scroll to favorite recipes
  $("html, body").animate({
    scrollTop: $("#display-favs").offset().top
  }, 1000);

  firebase.auth().onAuthStateChanged((user) => {
    console.log('User ID', user.uid)
    user = user.uid
    $("#display-favs").empty();
    database.ref(`/users/${user}/favorites/`).on("value", function (snapshot) {
      console.log(snapshot.val())
      $("#display-favs").empty();
      snapshot.forEach((childSnapshot) => {
        console.log(childSnapshot.val())

        let favs = childSnapshot.val();

        let favRemove = $("<button>");
        favRemove.attr("data-fav-recipes", childSnapshot.key);
        favRemove.addClass("checkbox");
        favRemove.text("x")

        let favTagText = $("<p>").text(` Favorite: ${favs}`);;
        $(favTagText).prepend(favRemove)
        favTagText.addClass("favItem");

        $("#display-favs").append(favTagText);
      })
    });
  });
})

// Delete favorite recipe
$(document).on("click", ".checkbox", function (event) {
  event.preventDefault();
  $("#display-favs").empty();

  // Select favorite recipe to remove
  let deleteFav = $(this).attr("data-fav-recipes")
  console.log(deleteFav)
  // Get user id
  firebase.auth().onAuthStateChanged((user) => {
    console.log('User ID', user.uid)
    user = user.uid

    // Remove favorite recipe from Firebase database and update HTML page
    database.ref(`users/${user}/favorites/${deleteFav}/`).remove();
  });
});

