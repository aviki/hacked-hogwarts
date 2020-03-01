"use strict";

window.addEventListener("DOMContentLoaded", start);

const modal = document.querySelector(".modalbg");
var studentArray = [];
var displayedStudents = [];
var studentJson;
var familyJson;
var systemHacked = false;
var prefects = {
  Ravenclaw: [],
  Slytherin: [],
  Gryffindor: [],
  Hufflepuff: []
}

const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "",
  photo: "",
  theHouse: "",
  fullName: "",
  prefect: false,
  squad: false,
  expelled: false,
  bloodStatus: ""
};

function start() {
  if (document.querySelector("#student")) {
    getData();
  }
}

function prepareObjects(jsonData) {
  studentArray = jsonData.map(prepareObject);
  displayedStudents = studentArray;
  displayedStudents.forEach(element => {
    displayList(element);
  });
  updateAbout();
}

function prepareObject(jsonObject) {
  console.log(familyJson);
  const student = Object.create(Student);
  student.firstName = getFirstName(cleanName(jsonObject.fullname));
  student.middelName = getMiddleName(cleanName(jsonObject.fullname));
  student.lastName = getLastName(cleanName(jsonObject.fullname));
  student.nickName = getNickName(cleanName(jsonObject.fullname));
  student.photo = getPhotoName(cleanName(jsonObject.fullname));
  student.theHouse = cleanHouseName(jsonObject.house);
  student.fullName = cleanName(jsonObject.fullname);
  student.prefect = false;
  student.squad = false;
  student.expelled = false;
  student.bloodStatus = getBloodStatus(cleanName(jsonObject.fullname), familyJson);
  return student;
}

function cleanName(inputText) {
  inputText = inputText.trim();
  var outputString = inputText.charAt(0).toUpperCase();
  for (var i = 1; i < inputText.length; i++) {
    if (inputText.charAt(i - 1) == "-") {
      outputString += inputText.charAt(i).toUpperCase();
    } else if (inputText.charAt(i - 1) == " ") {
      outputString += inputText.charAt(i).toUpperCase();
    } else {
      outputString += inputText.charAt(i).toLowerCase();
    }
  }
  return outputString;
}

function cleanHouseName(uglyHouseName) {
  uglyHouseName = uglyHouseName.trim();
  return uglyHouseName.charAt(0).toUpperCase() + uglyHouseName.substr(1, uglyHouseName.length - 1).toLowerCase();
}
function getFirstName(fullName) {
  return fullName.split(" ")[0];
}

function getLastName(fullName) {
  return fullName.split(" ")[fullName.split(" ").length - 1];
}

function getMiddleName(fullName) {
  if (fullName.split(" ").length > 2) {
    return fullName.split(" ")[1];
  } else {
    return "";
  }
}

function getNickName(fullName) {
  if (fullName.split(" ").length > 2) {
    if (fullName.split(" ")[1].substr(0, 2) == '\\"') {
      return fullName.split(" ")[1].substr(2, fullName.split(" ")[1].length - 4);
    } else {
      return "";
    }
  } else {
    return "";
  }
}

function getPhotoName(fullName) {
  return (
    "images/" +
    getLastName(fullName).toLowerCase() +
    "_" +
    getFirstName(fullName)
      .charAt(0)
      .toLowerCase() +
    ".png"
  );
}

//Calculating the BLOOD STATUS from the family name json file
function getBloodStatus(fullName, familiesJson) {
  console.log(familiesJson);
  if (getLastName(fullName).split("-").length > 1) {
    let canBePure = false;
    let canBeMuggle = false;
    getLastName(fullName)
      .split("-")
      .forEach(family => {
        if (familiesJson.half.includes(family)) {
          return "half";
        } else if (familiesJson.pure.includes(family)) {
          if (canBePure) {
            return "pure";
          } else {
            canBePure = true;
            canBeMuggle = false;
          }
        } else {
          if (canBeMuggle) {
            return "muggle";
          } else {
            canBeMuggle = true;
          }
        }
      });
  } else {
    let family = getLastName(fullName);
    if (familiesJson.half.includes(family)) {
      return "half";
    } else if (familiesJson.pure.includes(family)) {
      return "pure";
    } else {
      return "muggle";
    }
  }
}

//Fetching the data from the json files
function getData() {
  var prom1 = fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(handleData);
  var prom2 = fetch("https://petlatkea.dk/2020/hogwarts/families.json")
    .then(res => res.json())
    .then(handleFamily);
  Promise.all([prom1, prom2]).then(function(values) {
    prepareObjects(studentJson, familyJson);
  });
}

//Save student data
function handleData(myData) {
  studentJson = myData;
  console.log(studentJson);
}

//About the student list --> display the number of students on the page
function updateAbout() {
  let ravenclawCount = studentArray.filter(e => e.theHouse == "Ravenclaw").length;
  document.getElementById("ravenclawCount").innerText = ravenclawCount;

  let gryffindorCount = studentArray.filter(e => e.theHouse == "Gryffindor").length;
  document.getElementById("gryffindorCount").innerText = gryffindorCount;

  let slytherinCount = studentArray.filter(e => e.theHouse == "Slytherin").length;
  document.getElementById("slytherinCount").innerText = slytherinCount;

  let hufflepuffCount = studentArray.filter(e => e.theHouse == "Hufflepuff").length;
  document.getElementById("hufflepuffCount").innerText = hufflepuffCount;

  let numberOfNotExpelledStudents = studentArray.filter(e => !e.expelled).length;
  document.getElementById("studentCount").innerText = numberOfNotExpelledStudents;
  let numberOfExpelledStudents = studentArray.filter(e => e.expelled).length;
  document.getElementById("expelledStudentCount").innerText = numberOfExpelledStudents;
  let numberOfDisplayedStudents = displayedStudents.length;
  document.getElementById("displayedStudentCount").innerText = numberOfDisplayedStudents;


}

//Save family data
function handleFamily(family) {
  familyJson = family;
  console.log(familyJson);
}

function hackTheSystem() {
  if(!systemHacked){
    systemHacked = true;
    let me = Object.create(student);
    me.firstName = "Viktoria";
    me.middelName = "";
    me.lastName = "Toldi";
    me.nickName = "";
    me.photo = "";
    me.theHouse = "Ravenclaw";
    me.fullName = "Viktoria Toldi";
    me.prefect = false;
    me.squad = false;
    me.expelled = false;
    me.bloodStatus = "pure";
    studentArray.forEach(element => {
      if (element.bloodStatus == "half" || element.bloodStatus == "muggle") {
        element.bloodStatus = "pure";
      } else if (element.bloodStatus == "pure") {
        let bloodStatuses = ["half", "pure", "muggle"];
        element.bloodStatus = bloodStatuses[Math.floor(Math.random() * 3)];
      }
    });
    studentArray.push(me);
    displayedStudents = studentArray;
    document.querySelector("#student").innerHTML = "";
    displayedStudents.forEach(displayList);
    updateAbout();
  }

}

function displayList(student) {
  console.log(student);
  const template = document.querySelector("template").content;
  const studentCopy = template.cloneNode(true);
  const article = studentCopy.querySelector("article");

  /*Student Photo in the list */
  console.log(student.photo);
  const photo = studentCopy.querySelector(".photo");
  photo.src = student.photo;
  /*Student Name in the list */
  const name = studentCopy.querySelector(".name");
  name.textContent = student.fullName;
  /*Student house in the list */
  const house = studentCopy.querySelector(".house");
  house.textContent = student.theHouse;
  const container = studentCopy.querySelector("container");
  const content = studentCopy.querySelector("content");
  if(student.expelled){
      article.style.backgroundColor = "gray";
  }
  /*Clickable X for expell option */
  const x = studentCopy.querySelector(".expelled");
  x.addEventListener("click", expellStudent);

  if(student.squad == true){
    const inquisitorial = studentCopy.querySelector(".inquisitorial");
    inquisitorial.style.display = "block";
  }

  if(student.prefect == true){
    const prefect = studentCopy.querySelector(".prefect");
    prefect.style.display = "block";
  }

  //Creating the modal for single student
  photo.addEventListener("click", openModal);
  name.addEventListener("click", openModal);
  document.querySelector("#student").appendChild(studentCopy);

  function openModal() {
    var element = document.querySelector(".modalcontainer");
    const modal = document.querySelector(".modalbg");
    modal.style.display = "block";
    /*Student Photo */
    const modalphoto = document.querySelector(".modalphoto");
    modalphoto.src = student.photo;
    /*House Crest */
    const crest = document.querySelector(".crest");
    crest.src = "images/" + student.theHouse.toLowerCase() + ".png";
    /*Name*/
    const modalname = document.querySelector(".modalname");
    modalname.textContent = student.fullName;
    /*House*/
    const modalhouse = document.querySelector(".modalhouse");
    modalhouse.textContent = student.theHouse;
    /*Blood Status*/
    const modalblood = document.querySelector(".modalblood");
    modalblood.textContent = student.bloodStatus;
    /*Perfect Status*/
    const modalprefect = document.querySelector(".modalprefect");
    modalprefect.textContent = student.prefect;
    /*Expelled Status*/
    const modalexpelled = document.querySelector(".modalexpelled");
    modalexpelled.textContent = student.expelled;
    
    const inquisitorialButton = document.querySelector(".addToInquisitorialSquadButton");
    
    function addToInquisitorialSquad(){
      student.squad = true;
      document.querySelector("#student").innerHTML = "";
      displayedStudents.forEach(displayList);
      updateAbout();
    }

    function removeFromInquisitorialSquad(){
      student.squad = false;
      document.querySelector("#student").innerHTML = "";
      displayedStudents.forEach(displayList);
      updateAbout();
    }
    
    const prefectButton = document.querySelector(".makePrefectButton");

    function addToPrefects(){
      if(prefects[student.theHouse].length < 2 ){
        prefects[student.theHouse].push(student.fullName);
        student.prefect = true;
      } else {
        alert("There are already two prefects from this house. Please remove one of them from the prefects first.");
      }
      document.querySelector("#student").innerHTML = "";
      displayedStudents.forEach(displayList);
      updateAbout();
    }

    function removeFromPrefects(){
      //https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
      var index = prefects[student.theHouse].indexOf(student.fullName);
      if (index !== -1) prefects[student.theHouse].splice(index, 1);
      student.prefect = false;
      document.querySelector("#student").innerHTML = "";
      displayedStudents.forEach(displayList);
      updateAbout();
    }

    if(student.squad){
      inquisitorialButton.textContent = "Remove from inquisitorial squad";
      inquisitorialButton.style.display = "block";
      //https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
      let old_element =  inquisitorialButton;
      let new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      new_element.addEventListener("click", removeFromInquisitorialSquad);
    } else if(student.theHouse == "Slytherin" || student.bloodStatus == "pure"){
      inquisitorialButton.textContent = "Add to inquisitorial squad"
      inquisitorialButton.style.display = "block";
      //https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
      let old_element =  inquisitorialButton;
      let new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      new_element.addEventListener("click", addToInquisitorialSquad);
    } else {
      inquisitorialButton.style.display = "none";
    }

    if(student.prefect){
      prefectButton.textContent = "Remove from prefects";
      //https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
      let old_element = prefectButton;
      let new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      new_element.addEventListener("click", removeFromPrefects);
    } else {
      prefectButton.textContent = "Make prefect"
      //https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
      let old_element = prefectButton;
      let new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      new_element.addEventListener("click", addToPrefects);
    }

    const body = document.querySelector("body");
    body.classList.add("modalopen");
    const exit = document.querySelector(".exit");
    console.log(student.theHouse.toLowerCase());
    element.classList.add(student.theHouse.toLowerCase());
    exit.addEventListener("click", function() {
      modal.style.display = "none";
      body.classList.remove("modalopen");
      element.classList.remove(...element.classList);
      element.classList.add("modalcontainer");
    });
  }
  function expellStudent() {
    student.expelled = true;
    document.querySelector("#student").innerHTML = "";
    displayedStudents.forEach(displayList);
    updateAbout();
  }
}

function filter() {
  let select = document.getElementById("filterSelector");
  switch (select.value) {
    case "1":
      displayedStudents = studentArray.filter(s => s.theHouse == "Gryffindor");
      break;
    case "2":
      displayedStudents = studentArray.filter(s => s.theHouse == "Slytherin");
      break;
    case "3":
      displayedStudents = studentArray.filter(s => s.theHouse == "Hufflepuff");
      break;
    case "4":
      displayedStudents = studentArray.filter(s => s.theHouse == "Ravenclaw");
      break;
    case "5":
      displayedStudents = studentArray.filter(s => s.expelled);
      break;
    case "6":
      displayedStudents = studentArray.filter(s => !s.expelled);
      break;
    case "7":
      displayedStudents = studentArray;
      break;
    default:
      alert("please select a style!yo");
  }
  document.querySelector("#student").innerHTML = "";
  displayedStudents.forEach(displayList);
  updateAbout();

}

function sort() {
  let select = document.getElementById("sortingSelector");
  switch (select.value) {
    case "1":
      displayedStudents.sort(compareFirstNameAscend);
      break;
    case "2":
      displayedStudents.sort(compareFirstNameDescend);
      break;
    case "3":
      displayedStudents.sort(compareLastNameAscend);
      break;
    case "4":
      displayedStudents.sort(compareLastNameDescend);
      break;
    case "5":
      displayedStudents.sort(compareHouseAscend);
      break;
    case "6":
      displayedStudents.sort(compareHouseDescend);
      break;
    default:
      alert("please select a style!yo");
  }
  document.querySelector("#student").innerHTML = "";
  displayedStudents.forEach(displayList);
  updateAbout();
}

//Implementing sort function//
function compareFirstNameDescend(a, b) {
  if (a["firstName"] > b["firstName"]) {
    return -1;
  }
  if (a["firstName"] < b["firstName"]) {
    return 1;
  }
  return 0;
}

function compareFirstNameAscend(a, b) {
  if (a["firstName"] < b["firstName"]) {
    return -1;
  }
  if (a["firstName"] > b["firstName"]) {
    return 1;
  }
  return 0;
}

function compareLastNameDescend(a, b) {
  if (a["lastName"] > b["lastName"]) {
    return -1;
  }
  if (a["lastName"] < b["lastName"]) {
    return 1;
  }
  return 0;
}

function compareLastNameAscend(a, b) {
  if (a["lastName"] < b["lastName"]) {
    return -1;
  }
  if (a["lastName"] > b["lastName"]) {
    return 1;
  }
  return 0;
}

function compareHouseDescend(a, b) {
  if (a["theHouse"] > b["theHouse"]) {
    return -1;
  }
  if (a["theHouse"] < b["theHouse"]) {
    return 1;
  }
  return 0;
}

function compareHouseAscend(a, b) {
  if (a["theHouse"] < b["theHouse"]) {
    return -1;
  }
  if (a["theHouse"] > b["theHouse"]) {
    return 1;
  }
  return 0;
}

function search() {
  let text = document.getElementById("searchText");
  let searchingProperty = document.getElementById("searchingProperty");
  if (searchingProperty.value == "1") {
    displayedStudents = studentArray.filter(s => s.firstName.includes(text.value));
  } else {
    displayedStudents = studentArray.filter(s => s.lastName.includes(text.value));
  }
  document.querySelector("#student").innerHTML = "";
  displayedStudents.forEach(displayList);
  updateAbout();
}
