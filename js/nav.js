"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navLinkGroup.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
/** Shows the form to create a new story.*/
$('#nav-submit-story').on('click', submitStoryClick);

function submitStoryClick(e){
  hidePageComponents();
  $storyForm.show();
  $storiesLists.show();
}

$('#nav-my-stories').on('click', function(){
 hidePageComponents();
 $myStoriesList.empty();
 getMyStories();
  
})

$('#nav-favorites').on('click', function(){
 hidePageComponents();
 $favoriteStoriesList.empty();
 getMyFavorites();
})