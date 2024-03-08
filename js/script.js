// Get elements from DOM
const $company = document.getElementById("company");
const $city = document.getElementById("city");
const $phone = document.getElementById("phone");
const $email = document.getElementById("email");
const $dialog = document.getElementById("dialog");
const $dialogButton = document.getElementById("dialog-button");
const $pdfButton = document.getElementById("pdf-button");
const $excelButton = document.getElementById("excel-button");
const $exportButton = document.getElementById("export-button");
const $exportContent = document.getElementById("export-content");
const $exportTable = document.getElementById("export-table");

// Function to populate the content of the page
function populatePageContent() {
    // Loading JSON file
    fetch("../data.json").then((response) => {
        response.json().then((data) => {
            $company.innerHTML = "<span>Company: </span>" + data.Company;
            $city.innerHTML = "<span>City: </span>" + data.City;
            $phone.innerHTML = "<span>Phone: </span>" + data.Phone;
            $email.innerHTML = "<span>Email: </span>" + data.Email;

            // Iterating on the JSON file
            for(let obj in data.Plans) {
                // Creating tr element
                var tr = document.createElement("tr");
                // Assigning values to each table body cell
                tr.innerHTML = "<td>" + data.Plans[obj].Name + "</td>" +
                    "<td>" + data.Plans[obj].Price.toFixed(2) + "</td>";
                // Adding tr element created inside tbody
                $exportTable.appendChild(tr);
            }           
        })
    });  
}

// Calling function
populatePageContent();

// Show modal
$exportButton.onclick = function() {
    $dialog.showModal();
}

// Close modal
$dialogButton.onclick = function() {
    $dialog.close();
}

// Generating PDF by clicking the pdf button
function pdfFormat() {
    // Features of PDF
    const pdf = {
        margin: [0, 10, 10, 10],
        filename: "list-student.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    }
    // Saving PDF
    html2pdf().set(pdf).from($exportContent).save();
    // Close modal
    $dialog.close();
}

// Generating Excel by clicking the excel button
function excelFormat() {
    // Defining data type
    let dataType = "application/vnd.ms-excel";
    // Setting up the table
    let tableHTML = $exportTable.outerHTML.replace(/ /g, "%20");
    // Defining file name and extension
    let filename = "list-student.xlsx";

    // Creating a element to generate a link to the Excel file
    let downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    // In modern browsers, the msSaveOrOpenBlob function creates or saves a file using data
    if(navigator.msSaveOrOpenBlob) {
        let blob = new Blob(["\ufeff", tableHTML], { type: dataType });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // In older browsers, you must generate a link to the file and then download it by adding the download attribute in the anchor tag
        downloadLink.href = "data:" + dataType + ", " + tableHTML; 
        downloadLink.download = filename;    
        downloadLink.click();  
    }
    // Close modal
    $dialog.close();
}

// Calling functions
$pdfButton.addEventListener("click", pdfFormat);
$excelButton.addEventListener("click", excelFormat);