# MealFlip

The app's mission is No decisions. No guilt. No worries. MealFlip's purpose is:

- To provide users with a solution to problems surrounding dinner
- Choose at random whether to eat in or eat out
- Help users by providing a limited list of options for either

## About the Project

A four-person team project. Beginning with a collaboration effort using Agile MVP (Minimum Viable Product) to create user stories, discuss functionality, and break-down tasks. Kanban was utilized to assign responsibility and measure work progress.

## Technology

- Materialize CSS library
- Firebase Authentication
  - used for user login
- Firebase Database
  - used for user information and save favorite recipes
- Google Maps
  - used for address autofill and restaurant map
- Yelp API
  - used to call 5 random restaurants based on location and optional parameters such as cost and cuisine type
- Yummly API
  - used to generate 5 random recipes based on optional parameters such as ingredients, cook time, allergies, and diet

## My Contribution

- Google Firebase Authentication – setup the backend service and FirebaseUI to allow users to signup/login through an email address or Google account

- Google Maps API – built interactive map that displayed the location of five restaurants based on the search result

- Google Place Autocomplete Address Form – setup the feature to autocomplete an address when a user starts typing an address

- AJAX Request – fetch data (based on the user’s choices) from the Yelp API
