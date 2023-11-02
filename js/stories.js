"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn=false) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser)
  
  return $(`
      <li id="${story.storyId}">
        ${showStar? getStarBtnHTML(story, currentUser):''}
        ${showDeleteBtn? getDeleteBtnHTML():''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, false);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

$storyForm.on('submit',async function(e){
  e.preventDefault();
  let newStoryObj = {
    author:e.target.author.value,
    title:e.target.title.value,
    url:e.target.url.value
  }
  const newStory = await storyList.addStory(currentUser, newStoryObj);
  await $allStoriesList.prepend(generateStoryMarkup(newStory));
  this.reset();
  $(this).slideUp();
  
})

function getDeleteBtnHTML(){
  return (
    `<span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>`
  )
}

function getStarBtnHTML(story, user){
  const isFavorite = user.favorites.includes(story);
  const starType = isFavorite ? "fas" :"far";
  return(
    `<span class="star">
      <i class="${starType} fa-star"></i>
    </span>`
  )
}

function getMyStories(){
  $myStoriesList.empty()
  let userStories = currentUser.ownStories;
  
  if(userStories.length ===0){
    $myStoriesList.append("<h5>You don't have any stories</h5>")
  }else{
    for(let i =0; i < userStories.length; i++){
      $myStoriesList.append(generateStoryMarkup(userStories[i], true));
    }
  }
  $myStoriesList.show();
}

async function removeStory(e){
  const $closestLi = $(e.target).closest('li');
  const storyID = $closestLi.attr("id")
  await storyList.deleteStory(currentUser, storyID);
  await getMyStories();
}

$myStoriesList.on('click', '.trash-can', removeStory);


function getMyFavorites(){
  $favoriteStoriesList.empty()
  let userFavorites = currentUser.favorites;
  if(userFavorites.length ===0){
    $favoriteStoriesList.append("<h5>You don't have any favorite stories</h5>")
  }else{
    for(let i = 0; i < userFavorites.length; i++){
      $favoriteStoriesList.append(generateStoryMarkup(userFavorites[i], false));
    }
  }
  $favoriteStoriesList.show();
}

async function toggleStoryFavorite(e) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(e.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
   
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);
