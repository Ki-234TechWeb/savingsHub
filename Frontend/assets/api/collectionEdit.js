// Open modal when collectionEdit is clicked
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("collectionEdit")) {
    const editCollection = document.getElementById("recordCollectionModalEdit");
    if (!editCollection) return;

    editCollection.style.display = "flex"; 

    // Get attributes from clicked button
    let collect_id = e.target.getAttribute("data-collect-id"); 
    let collectUserId  = e.target.getAttribute("data-collect-userid");
    let collectAgent_id = e.target.getAttribute("data-collect-agentid");
    let collectUserName = e.target.getAttribute("data-collect-username");
    let collectUserDate = e.target.getAttribute("data-collect-userdate");
    let collectUserAmount = e.target.getAttribute("data-collect-useramount");
     
   

    // Fill modal fields
    let select = editCollection.querySelector(".usersplanEdit");
    let option = select.querySelector(".optionEdit");
    option.value = collectUserName; // better to use value
    option.textContent = collectUserName;

    document.querySelector(".amountEdit").value = collectUserAmount;
    document.querySelector(".dateEdit").value = collectUserDate;

    // Store values for later submit
    editCollection.dataset.collectId = collect_id;
    editCollection.dataset.collectOption = collectUserName;
    editCollection.dataset.collectAgent = collectAgent_id;
     editCollection.dataset.collectUserId = collectUserId;
  }
});
const loadingSpinnerEditColl = document.getElementById("loadingSpinnerEditColl");
const recordCollectionEditBtn = document.querySelector(".recordCollectionEdit");
// Handle submit when recordCollectionEdit is clicked
document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("recordCollectionEdit")) {
    const editCollection = document.getElementById("recordCollectionModalEdit");
    if (!editCollection) return;
   recordCollectionEditBtn.style.display = "none" ;
   loadingSpinnerEditColl.style.display = "block";
    // Get values from modal
    let collect_id = editCollection.dataset.collectId;
      let collect_agentid = editCollection.dataset.collectAgent;
    let collectOption = editCollection.dataset.collectOption;
    let amountEdit = document.querySelector(".amountEdit").value;
    let dateEdit = document.querySelector(".dateEdit").value;
    let collectUserId =  editCollection.dataset.collectUserId ;
    // Validation
    if (!amountEdit || !dateEdit || !collectOption ) {
      showNotification("Required fields cannot be empty", "error");
        recordCollectionEditBtn.style.display = "block" ;
           loadingSpinnerEditColl.style.display = "none";
      return;
      
    }

    const collectForm = {  collectOption, amountEdit, dateEdit, collect_id , collect_agentid, collectUserId };

    try {
      const res = await fetch(`/savinghub/backend/api/staff/updateCollection.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectForm)
      });

      const dataEdit = await res.json();
      console.log("Update response:", dataEdit);

      if (dataEdit.status === "success") {
        showNotification(dataEdit.message, "success");
         setTimeout(() => {
        window.location.href = '';
      }, 2000);
      } else {
        showNotification(dataEdit.message, "error");
           recordCollectionEditBtn.style.display = "block" ;
           loadingSpinnerEditColl.style.display = "none";
      }
    } catch (err) {
      console.error("Error updating collection:", err);
      showNotification("Server error: " + err.message, "error");
       recordCollectionEditBtn.style.display = "block" ;
           loadingSpinnerEditColl.style.display = "none";
    }
}
});


// next update Collection in updatecollection.php