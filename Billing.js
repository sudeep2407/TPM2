const url = "https://script.google.com/macros/s/AKfycbw9zxby4LcOmFM04DDRy0a6qoagKZO2MyDPnZ1CuzI1Y4L7Yfqp5QjgsUEfHlUyqrff/exec";

// new data entry button
const newEntry = document.getElementById("newEntry");
newEntry.addEventListener('click', function() {
    let x = document.getElementById("bookingDetails");
    x.style.display = "block";
    document.getElementById("utilityButtons").style.display = "none";
    document.getElementById("billingForm").reset();
    let saveButton = document.getElementById("save");
    let updateButton = document.getElementById("update");
    saveButton.style.display = "block";
    updateButton.style.display = "none";
    document.getElementById("bookingIdHeading").style.display = "none";
})

// close display panel button
const closeButton = document.getElementById("close");
closeButton.addEventListener('click', function() {
    let x = document.getElementById("bookingDetails");
    x.style.display = "none";
})

// search button
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener('click', function() {
    let searchBookingId = document.getElementById("searchBooking");
    displayBookingDetails(searchBookingId.value)
})

// close notification div
const notificationClose = document.getElementById("notificationClose");
notificationClose.addEventListener('click', function() {
    let notificationDiv = document.getElementById("notification");
    notificationDiv.style.display = "none";
})

// update a specific entry
let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function(event) {
    let bookingId = document.getElementById("bookingIdHeading").textContent.substring(13);
    event.preventDefault();
    if (billingForm.checkValidity()) {
        console.log("updating : "+bookingId);
        submitBillingData(url+`?update=true&BookingId=${bookingId}`, bookingId);    
    }
    billingForm.classList.add('was-validated');
})

//get all booking data
let responseJson = null;
async function readBillingData() {
    const response = await fetch(url);
    responseJson = await response.json();    
    responseJson.sort((a, b) => new Date(a.TripStartDate) - new Date(b.TripStartDate));
    displayData(responseJson);
}

// display all booking details
function displayData(responseJson) {
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML="";
    responseJson.forEach(element => {
        let tableRow = document.createElement("tr");
        let tableHeading = document.createElement("th");
        tableHeading.scope = "row";

        let bookingIdLink = document.createElement("a");
        bookingIdLink.href = "#";
        bookingIdLink.onclick = function(){
            displayBookingDetails(element.BookingId);
        };
        bookingIdLink.textContent = element.BookingId
        tableHeading.appendChild(bookingIdLink);

        //tableHeading.textContent = element.BookingId;
        let guestName =  document.createElement("td");
        guestName.textContent = element.GuestName;
        let startDate =  document.createElement("td");
        startDate.textContent = new Date(element.TripStartDate).toLocaleDateString();
        let endDate =  document.createElement("td");
        endDate.textContent = new Date(element.TripEndDate).toLocaleDateString();
        let bookingStatus =  document.createElement("td");
        bookingStatus.textContent = element.BookingStatus;
        if(bookingStatus.textContent === "AllComplete") {
            bookingStatus.style.color = "green";
        }
        else {
            bookingStatus.style.color = "red";
        }
        tableRow.appendChild(tableHeading);
        tableRow.appendChild(guestName);
        tableRow.appendChild(startDate);
        tableRow.appendChild(endDate);
        tableRow.appendChild(bookingStatus);
        tableBody.appendChild(tableRow);
    });
}

// display particular booking data
function displayBookingDetails(bookingId){
    
    let dataFound = false;
    let data = null;
    console.log(bookingId);
    responseJson.forEach(element=> {
        if(element.BookingId == bookingId) {
            data = element;
            dataFound = true;
            return;
        }
    })
    if(dataFound) {   
        let x = document.getElementById("bookingDetails"); 
        x.style.display = "block";
        
        document.getElementById("bookingIdHeading").style.display = "block";
        document.getElementById("bookingIdHeading").textContent = "Booking Id : "+bookingId;
        document.getElementById("guestName").value = data.GuestName;
        document.getElementById("guestNumber").value = data.GuestNumber;
        document.getElementById("guestEmail").value = data.GuestEmail;
        document.getElementById("tripDescription").value = data.TripDescription;
        document.getElementById("accommodationType").value = data.AccommodationType;
        document.getElementById("adultCount").value = data.AdultCount;
        document.getElementById("childCount").value = data.ChildCount;
        document.getElementById("roomCount").value = data.RoomCount;
        document.getElementById("mealPlan").value = data.MealPlan;
        document.getElementById("cabType").value = data.CabType;
        document.getElementById("bookingDate").value = formatDate(data.BookingDate);
        document.getElementById("tripStartDate").value = formatDate(data.TripStartDate);
        document.getElementById("tripEndtDate").value = formatDate(data.TripEndDate);
        document.getElementById("guestTotalCost").value = data.GuestTotalCost;
        document.getElementById("guestAdvance").value = data.GuestAdvance;
        document.getElementById("hotelName").value = data.HotelName;
        document.getElementById("hotelTotalCost").value = data.HotelTotalCost;
        document.getElementById("hotelAdvance").value = data.HotelAdvance;
        document.getElementById("cabVendor").value = data.CabVendor;
        document.getElementById("cabTotalCost").value = data.CabTotalCost;
        document.getElementById("cabAdvance").value = data.CabAdvance;
        document.getElementById("bookinStatus").value = data.BookingStatus;
        document.getElementById("comments").value = data.Comments;
        let saveButton = document.getElementById("save");
        let updateButton = document.getElementById("update");
        saveButton.style.display = "none";
        updateButton.style.display = "block";
        document.getElementById("utilityButtons").style.display = "flex";
        let pdfView = document.getElementById("pdfView");
        pdfView.onclick = function(){
            modal = document.getElementById("pdfPreview");
            modal.style.display = "block";
            displayPdfPreview(data);
        };
    }
    else {
        displayNotification("No Booking found for given Id ! ", "failure");
    }   
}

modal = document.getElementById("pdfPreview");
let span = document.getElementsByClassName("close")[0];
let pdfCloseButton = document.getElementById("closePdfViewer");
span.onclick = function() {
  modal.style.display = "none";
}
pdfCloseButton.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function displayPdfPreview(currentData) {
    //let pdfPreviewDiv = document.getElementById("pdfPreviewDiv");
    document.getElementById("pdfBookingId").innerText = currentData.BookingId;
    document.getElementById("pdfGuestName").innerText = currentData.GuestName;
    document.getElementById("pdfGuestNumber").innerText = currentData.GuestNumber;
    document.getElementById("pdfAdultCount").innerText = currentData.AdultCount;
    document.getElementById("pdfChildCount").innerText = currentData.ChildCount;
    document.getElementById("pdfRoomCount").innerText = currentData.RoomCount;
    document.getElementById("pdfAccommodationType").innerText = currentData.AccommodationType;
    document.getElementById("pdfMealPlan").innerText = currentData.MealPlan;
    document.getElementById("pdfCabType").innerText = currentData.CabType;
    document.getElementById("pdfTripStartDate").innerText = formatDatePDF(currentData.TripStartDate)
    document.getElementById("pdfTripEndDate").innerText = formatDatePDF(currentData.TripEndDate)
    document.getElementById("pdfGuestTotalCost").innerText = currentData.GuestTotalCost;
    document.getElementById("pdfGuestAdvance").innerText = currentData.GuestAdvance;
    document.getElementById("pdfTripDescription").innerText = currentData.TripDescription;

    let generatePdf = document.getElementById("generatePdf");
    generatePdf.onclick = function () {
        const { jsPDF } = window.jspdf;
 
            let doc = new jsPDF('p', 'px', [1240, 1540]);
            let pdfjs = document.querySelector('#pdfPreviewDiv');
 
            doc.html(pdfjs, {
                callback: function(doc) {
                    doc.save(currentData.BookingId+".pdf");
                },
                x: 12,
                y: 1
            });              
    };
}

// form validation check before saving
const billingForm = document.getElementById("billingForm");
const saveButton = document.getElementById("save");
saveButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (billingForm.checkValidity()) {
        const currentDate = new Date();
        const bookingId = 'TPM' + currentDate.getTime().toString();
        submitBillingData(url, bookingId);    
    }
    billingForm.classList.add('was-validated');
});

// save form data
function submitBillingData(url, bookingId) {

    const guestName = document.getElementById("guestName").value;
    const guestNumber = document.getElementById("guestNumber").value;
    const guestEmail = document.getElementById("guestEmail").value;
    const tripDescription = document.getElementById("tripDescription").value;
    const accommodationType = document.getElementById("accommodationType").value;
    const adultCount = document.getElementById("adultCount").value;
    const childCount = document.getElementById("childCount").value;
    const roomCount = document.getElementById("roomCount").value;
    const mealPlan = document.getElementById("mealPlan").value;
    const cabType = document.getElementById("cabType").value;
    const bookingDate = document.getElementById("bookingDate").value;
    const tripStartDate = document.getElementById("tripStartDate").value;
    const tripEndtDate = document.getElementById("tripEndtDate").value;
    const guestTotalCost = document.getElementById("guestTotalCost").value;
    const guestAdvance = document.getElementById("guestAdvance").value;
    const hotelName = document.getElementById("hotelName").value;
    const hotelTotalCost = document.getElementById("hotelTotalCost").value;
    const hotelAdvance = document.getElementById("hotelAdvance").value;
    const cabVendor = document.getElementById("cabVendor").value;
    const cabTotalCost = document.getElementById("cabTotalCost").value;
    const cabAdvance = document.getElementById("cabAdvance").value;
    const bookinStatus = document.getElementById("bookinStatus").value;
    const comments = document.getElementById("comments").value;

    let obj = {
        BookingId: bookingId,
        GuestName: guestName,
        GuestNumber: guestNumber,
        GuestEmail: guestEmail,
        TripDescription: tripDescription,
        AccommodationType : accommodationType,
        AdultCount: adultCount,
        ChildCount: childCount,
        RoomCount: roomCount,
        MealPlan: mealPlan,
        CabType: cabType,
        BookingDate: bookingDate,
        TripStartDate: tripStartDate,
        TripEndtDate: tripEndtDate,
        GuestTotalCost: guestTotalCost,
        GuestAdvance: guestAdvance,
        HotelName: hotelName,
        HotelTotalCost: hotelTotalCost,
        HotelAdvance: hotelAdvance,
        CabVendor: cabVendor,
        CabTotalCost: cabTotalCost,
        CabAdvance: cabAdvance,
        BookinStatus: bookinStatus,
        Comments: comments
    }
    console.log("URL : "+ url)
    fetch(url,{
        
        redirect: "follow",
        method:'POST',
        //mode: 'cors',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
    })
    .then(readBillingData)
    .then(displayNotification("Data saved successfully ! ", "success"));
}

// view pdf
document.getElementById("pdfView").addEventListener('click', function() {

})

// display success/ failure notification
function displayNotification(message, status) {
    if(status == "failure") {
        let notificationDiv = document.getElementById("notification");
        notificationDiv.style.backgroundColor = "red";
        notificationDiv.style.display = "flex";
        document.getElementById("notoficationMessage").innerText = message;
    }
    else {
        let notificationDiv = document.getElementById("notification");
        notificationDiv.style.backgroundColor = "green";
        notificationDiv.style.display = "flex";
        document.getElementById("notoficationMessage").innerText = message;
    }
}

// format date to dd-mm-yyyy before setting in date input
function formatDate(anyDate) {
    let d = new Date(anyDate);
    let year = d.getFullYear().toString();
    let month = (d.getMonth()+1).toString().padStart(2,0);
    let date = d.getDate().toString().padStart(2,0);
    let formattedDate = year+"-"+month+"-"+date;
    return formattedDate;
}

function formatDatePDF(anyDate) {
    let d = new Date(anyDate);
    let year = d.getFullYear().toString();
    let month = (d.getMonth()+1).toString().padStart(2,0);
    let date = d.getDate().toString().padStart(2,0);
    let formattedDate = date+"-"+month+"-"+year;
    return formattedDate;
}

// get all booking details while page loads
readBillingData();