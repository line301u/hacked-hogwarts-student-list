"use trict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const expelledStudents = [];

let studentData = [];
let bloodData = [];

const Student = {
  firstName: "undefined",
  lastName: "undefined",
  middleName: "undefined",
  nickName: "undefined",
  house: "undefined",
  image: null,
  prefect: false,
  expelled: false,
  blood: "undefined",
  squad: false,
};

const settings = {
  filter: "all",
  sortBy: "name",
};

let filterBy = "all";

let hasBeenHacked = false;

function hackTheSystem() {
  if (!hasBeenHacked) {
    hasBeenHacked = true;
    console.log(hasBeenHacked);
    document.querySelector("#studentlist_container").classList.add("shake");
    CreateMe();
  }
}

function CreateMe() {
  allStudents.unshift({ firstName: "Linea", lastName: "Lindebjerg", middleName: "", house: "Hufflepuff", blood: "muggle" });
  console.log(allStudents);
  buildList();
}

async function start() {
  listenToButtonClicks();

  studentData = await loadJSON("https://petlatkea.dk/2021/hogwarts/students.json");
  bloodData = await loadJSON("https://petlatkea.dk/2021/hogwarts/families.json");
  prepareObjects(studentData);

  document.querySelector("#filter").addEventListener("click", toggleFilter);
  document.querySelector("#sort").addEventListener("click", toggleSort);
}

function listenToButtonClicks() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

function toggleFilter() {
  document.querySelector("#filter_options").classList.toggle("hidden");
}

function toggleSort() {
  document.querySelector("#sort_options").classList.toggle("hidden");
}

async function loadJSON(url) {
  const JSONData = await fetch(url);
  const result = await JSONData.json();

  return result;
}

function prepareObjects(jsonData) {
  //console.table(jsonData);
  jsonData.forEach((jsonObject) => {
    const student = Object.create(Student);

    let studentFullName = jsonObject.fullname.trim().split(" ");

    // First name of student
    let studentFirstName = studentFullName[0];
    const FirstNameFirstLetter = studentFirstName.substring(0, 1).toUpperCase();
    const FirstNameRemainingLetters = studentFirstName.substring(1).toLowerCase();
    const finalFirstName = `${FirstNameFirstLetter}${FirstNameRemainingLetters}`;
    student.firstName = finalFirstName;

    // Last name of student
    const arrLength = studentFullName.length;
    let studentLastName = studentFullName[arrLength - 1];

    const LastNameFirstLetter = studentLastName.substring(0, 1).toUpperCase();
    const LastNameRemainingLetters = studentLastName.substring(1).toLowerCase();
    const finalLastName = `${LastNameFirstLetter}${LastNameRemainingLetters}`;
    student.lastName = finalLastName;

    // Middlename of student
    const studentFullName2 = jsonObject.fullname.trim();
    const firstSpace = studentFullName2.indexOf(" ");
    const lastSpace = studentFullName2.lastIndexOf(" ");
    const studentMiddleName = studentFullName2.substring(firstSpace, lastSpace);

    if (studentMiddleName.includes('"') == false) {
      const MiddleNameFirstLetter = studentMiddleName.substring(1, 2).toUpperCase();
      const MiddleNameRemainingLetters = studentMiddleName.substring(2).toLowerCase();
      const finalMiddleName = `${MiddleNameFirstLetter}${MiddleNameRemainingLetters}`;
      student.middleName = finalMiddleName;
    }

    // Nickname of student (NOT WORKING)
    if (studentMiddleName.includes('"') == true) {
      const MiddleNameFirstLetter = studentMiddleName.substring(1, 2).toUpperCase();
      const MiddleNameRemainingLetters = studentMiddleName.substring(2).toLowerCase();
      const finalNickName = `${MiddleNameFirstLetter}${MiddleNameRemainingLetters}`;
      student.nickName = finalNickName;
    }

    // Student house
    let studentHouse = jsonObject.house.trim();
    const HouseFirstLetter = studentHouse.substring(0, 1).toUpperCase();
    const HouseNameRemainingLetters = studentHouse.substring(1).toLowerCase();
    const finalHouse = `${HouseFirstLetter}${HouseNameRemainingLetters}`;
    student.house = finalHouse;

    allStudents.push(student);
    // Student picture
    // find lastname
    // do lastname in lowercase
    // find first letter of firstname
    // do letter in lowercase
    // lastname + underscore + firstletter in firstname + .png
  });

  displayList(allStudents);
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudents;
  } else if (settings.filterBy === "non_expelled") {
    filteredList = allStudents.filter(isNotExpelled);
  } else if (settings.filterBy === "squad_member") {
    filteredList = allStudents.filter(isSquadMember);
  }

  // show number of students displayed
  document.querySelector("[data-field=studentsDisplayedNumber]").textContent = filteredList.length;

  return filteredList;
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  setSort(sortBy);
}

function setSort(sortBy) {
  settings.sortBy = sortBy;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allAnimals;

  if (settings.sortBy === "firstname") {
    sortedList = sortedList.sort(compareFirstname);
  } else if (settings.sortBy === "lastname") {
    sortedList = sortedList.sort(compareLastname);
  } else if (settings.sortBy === "house") {
    sortedList = sortedList.sort(compareHouses);
  }

  return sortedList;
}

function buildList() {
  // Filter and sort currentList before displaying
  const currentList = filterList(allStudents);
  const sortedCurrentList = sortList(currentList);
  displayList(sortedCurrentList);
}

function displayList(allStudents) {
  // clear the list
  document.querySelector("#studentlist_container").innerHTML = "";

  //show number of all students dispayed
  document.querySelector("[data-field=studentsDisplayedNumber]").textContent = allStudents.length;

  allStudents.forEach(showStudentList);
}

function showStudentList(student) {
  let container = document.querySelector("#studentlist_container");
  let temp = document.querySelector("template");

  const clone = temp.cloneNode(true).content;

  clone.querySelector(".student_name").textContent = student.firstName + " " + student.lastName;
  clone.querySelector(".student_house").textContent = student.house;
  clone.querySelector(".student_image").addEventListener("click", () => showStudentDetails(student));

  //get student images
  if (student.lastName == "Patil") {
    clone.querySelector(".student_image").src = `student_images/${student.lastName}_${student.firstName}.png`;
  } else if (student.lastName.includes("-")) {
    const hyphenIndex = student.lastName.indexOf("-") + 1;
    const fLastName = student.lastName.slice(hyphenIndex, student.lastName.lengths);

    clone.querySelector(".student_image").src = `student_images/${fLastName}_${student.firstName.charAt(0)}.png`;
    console.log(fLastName);
  } else if (student.firstName == "Leanne" || student.firstName == "Linea") {
    clone.querySelector(".student_image").src = `student_images/undefined.png`;
  } else {
    clone.querySelector(".student_image").src = `student_images/${student.lastName}_${student.firstName.charAt(0)}.png`;
  }

  //hacked system blood status
  if (hasBeenHacked === true && bloodData.half.includes(student.lastName)) {
    student.blood = "pure-blood";
  } else if (hasBeenHacked === true && bloodData.pure.includes(student.lastName)) {
    const bloodTypes = ["muggle", "half-blood", "pure-blood"];
    const randomBloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];

    student.blood = randomBloodType;
  } else if (hasBeenHacked === true && !bloodData.pure.includes(student.lastName)) {
    student.blood = "pure-blood";
  }

  //check blood status
  if (hasBeenHacked === false && bloodData.half.includes(student.lastName)) {
    student.blood = "half-blood";
  } else if (hasBeenHacked === false && bloodData.pure.includes(student.lastName)) {
    student.blood = "pure-blood";
  } else if ((hasBeenHacked === false && !bloodData.pure.includes(student.lastName)) || (hasBeenHacked === false && !bloodData.half.includes(student.lastName))) {
    student.blood = "muggle";
  }

  console.log(allStudents);
  //make member of squad
  if (student.squad === true) {
    clone.querySelector("[data-field=squad_button]").textContent = "Remove as Inquisitorial Squad member";
  } else {
    clone.querySelector("[data-field=squad_button]").textContent = "Add as Inquisitorial Squad member";
  }

  clone.querySelector("[data-field=squad_button]").addEventListener("click", clickSquad);

  function clickSquad() {
    if (hasBeenHacked === false) {
      toggleSquad(student);
    } else if (hasBeenHacked === true) {
      toggleSquadHacked(student);
    }
  }

  //Make a prefect
  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect_button]").textContent = "Remove as a prefect";
  } else {
    clone.querySelector("[data-field=prefect_button]").textContent = "Add as a prefect";
  }

  clone.querySelector("[data-field=prefect_button]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    togglePrefect(student);
  }

  //expell student
  if (student.expelled === true) {
    clone.querySelector("[data-field=expel_button]").textContent = "expelled";
  } else {
    clone.querySelector("[data-field=expel_button]").textContent = "expell student";
  }

  clone.querySelector("[data-field=expel_button]").addEventListener("click", clickExpel);

  function clickExpel() {
    if (hasBeenHacked === true && student.firstName === "Linea") {
      document.querySelector("#cantExpel").classList.remove("hidden");
      document.querySelector("#cantExpel .closebutton").addEventListener("click", closeCantExpelDialog);

      function closeCantExpelDialog() {
        document.querySelector("#cantExpel").classList.add("hidden");
      }
    } else {
      toggleExpel(student);
    }
  }

  container.appendChild(clone); //klones til DOM
}

function toggleSquadHacked(student) {
  if (student.squad === true) {
    student.squad = false;
  } else {
    makeMemberLimitedTime(student);
  }
  buildList();
}

function toggleSquad(student) {
  if (student.squad === true) {
    student.squad = false;
  } else {
    checkIfCanbeSquadMember(student);
  }
  buildList();
}

function togglePrefect(student) {
  if (student.prefect === true) {
    student.prefect = false;
  } else {
    checkIfCanbePrefect(student);
  }
  buildList();
}

function toggleExpel(student) {
  if (student.expelled === false) {
    student.expelled = true;
    let expelledIndex = allStudents.indexOf(student);
    let expelledStudent = allStudents.splice(expelledIndex, 1);
    expelledStudents.push(expelledStudent[0]);
  }

  buildList();
}

function checkIfCanbeSquadMember(student) {
  if (student.house === "slytherin" || student.blood === "pure-blood") {
    student.squad = true;
  } else {
    document.querySelector("#cannotBeMember").classList.remove("hidden");
    document.querySelector("#cannotBeMember .closebutton").addEventListener("click", closeSquadDialog);
  }

  function closeSquadDialog() {
    document.querySelector("#cannotBeMember").classList.add("hidden");
    document.querySelector("#cannotBeMember .closebutton").removeEventListener("click", closeSquadDialog);
  }
}

function makeMemberLimitedTime(student) {
  student.squad = true;

  buildList();

  setTimeout(function () {
    student.squad = false;
    buildList();
  }, 5000);
}

function checkIfCanbePrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const other = prefects.filter((student) => student.house === selectedStudent.house);

  //if there is another of the same type
  if (other.length >= 2) {
    console.log("there can only be two of each house");
    removeAorB(other[0], other[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(otherA, otherB) {
    document.querySelector("#onlytwoofeachhouse").classList.remove("hidden");
    //ask user to ignore, or remove a or b
    document.querySelector("#onlytwoofeachhouse .closebutton").addEventListener("click", closeABDialog);
    document.querySelector("#onlytwoofeachhouse .remove1").addEventListener("click", clickRemoveA);
    document.querySelector("#onlytwoofeachhouse .remove2").addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector("button.remove1").textContent = "Remove " + otherA.firstName + " " + otherA.lastName;
    document.querySelector("button.remove2").textContent = "Remove " + otherB.firstName + " " + otherB.lastName;

    //if ignore - do nothing
    function closeABDialog() {
      document.querySelector("#onlytwoofeachhouse").classList.add("hidden");
      document.querySelector("#onlytwoofeachhouse .remove1").removeEventListener("click", clickRemoveA);
      document.querySelector("#onlytwoofeachhouse .remove2").removeEventListener("click", clickRemoveB);
    }

    //if removeA
    function clickRemoveA() {
      removePrefect(otherA);
      makePrefect(selectedStudent);
      buildList();
      closeABDialog();
    }

    //else - if removeB
    function clickRemoveB() {
      removePrefect(otherB);
      makePrefect(selectedStudent);
      buildList();
      closeABDialog();
    }
  }

  function removePrefect(student) {
    student.prefect = false;
    buildList();
  }

  function makePrefect(student) {
    student.prefect = true;
    buildList();
  }
}

function showStudentDetails(student) {
  let showdetails;

  if (student.house == "Gryffindor") {
    showdetails = document.querySelector("#student_popup_gryffindor");
  } else if (student.house == "Hufflepuff") {
    showdetails = document.querySelector("#student_popup_hufflepuff");
  } else if (student.house == "Ravenclaw") {
    showdetails = document.querySelector("#student_popup_ravenclaw");
  } else if (student.house == "Slytherin") {
    showdetails = document.querySelector("#student_popup_slytherin");
  }

  showdetails.classList.remove("hidden");

  //get student images
  if (student.lastName == "Patil") {
    showdetails.querySelector(".student_image_popup").src = `student_images/${student.lastName}_${student.firstName}.png`;
  } else if (student.lastName.includes("-")) {
    const hyphenIndex = student.lastName.indexOf("-") + 1;
    const fLastName = student.lastName.slice(hyphenIndex, student.lastName.lengths);

    showdetails.querySelector(".student_image_popup").src = `student_images/${fLastName}_${student.firstName.charAt(0)}.png`;
  } else if (student.firstName == "Leanne" || student.firstName == "Linea") {
    showdetails.querySelector(".student_image_popup").src = `student_images/undefined.png`;
  } else {
    showdetails.querySelector(".student_image_popup").src = `student_images/${student.lastName}_${student.firstName.charAt(0)}.png`;
  }

  showdetails.querySelector(".student_fullname").textContent = student.firstName + " " + student.lastName;
  showdetails.querySelector(".student_firstname").textContent = student.firstName;
  showdetails.querySelector(".student_middlename").textContent = student.middleName;
  showdetails.querySelector(".student_lastname").textContent = student.lastName;
  showdetails.querySelector(".house_crest").textContent = student.house;
  showdetails.querySelector(".prefect").textContent = "Prefect: " + student.prefect;
  showdetails.querySelector(".blood_status").textContent = student.blood;

  document.querySelector(".close_button_gryffindor").addEventListener("click", () => showdetails.classList.add("hidden"));
  document.querySelector(".close_button_hufflepuff").addEventListener("click", () => showdetails.classList.add("hidden"));
  document.querySelector(".close_button_ravenclaw").addEventListener("click", () => showdetails.classList.add("hidden"));
  document.querySelector(".close_button_slytherin").addEventListener("click", () => showdetails.classList.add("hidden"));
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isSquadMember(student) {
  if (student.squad === true) {
    return true;
  } else {
    return false;
  }
}

function isNotExpelled(student) {
  if (student.prefect === false) {
    return true;
  } else {
    return false;
  }
}

function compareFirstname(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function compareLastname(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function compareHouses(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}
