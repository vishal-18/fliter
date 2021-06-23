var fetchData = (function() {
    let tableBody, loader, totalDataCount, nextArrow, prevArrow, currentData, selectDropDown, displayCountryName;
    const covidDataUrl = "https://api.covid19api.com";

    function _setSelector() {
        tableBody = document.querySelector(".js-table-data");
        loader = document.querySelector('.js-table-loader-wrapper');
        totalDataCount = document.querySelector(".js-total-pages");
        totalDataCount = document.querySelector(".js-total-pages");
        nextArrow = document.querySelector('.js-pagination-arrow-next');
        prevArrow = document.querySelector(".js-pagination-arrow-previous");
        currentData = document.querySelector('.js-current-pages');
        selectDropDown = document.querySelector('.js-select-dropdown');
        displayCountryName = document.querySelector('.js-country-name');
    }

    function showTable() {

        dropDown();

        function dropDown() {
            const apiUrl = `${covidDataUrl}/countries`;

            async function getCountryData(url) {

                // Storing response
                const api_response = await fetch(url);

                // Storing data in form of JSON
                const data = await api_response.json();

                showCountries(data);

                //call Search filter
            }
            getCountryData(apiUrl);
        }


        function showCountries(data) {
            let itemData, countryName;
            // Loop to access rows
            let optionRow = `<option class="dropdown-option js-dropdown-option" value="india">India</option>`;
            for (itemData = 0; itemData < data.length; itemData++) {
                optionRow += `<option class="dropdown-option js-dropdown-option" value="${data[itemData].Slug}">${data[itemData].Country}</option>`
            }

            // Setting innerHTML as optionRow variable
            selectDropDown.innerHTML = optionRow;

            if (selectDropDown) {
                selectDropDown.addEventListener("click", function() {   //Change Data on select Dropdown
                    countryName = this.value;
                    showtableData(countryName);
                    displayCountryName.innerHTML = `${countryName}`;
                });
            }

            function showtableData(countryName) {
                const api_url = `${covidDataUrl}/live/country/${countryName}`;
                async function getCovidData(url) {

                    // Storing response
                    const response = await fetch(url);

                    // Storing data in form of JSON
                    const data = await response.json();

                    if (response) {
                        hideLoader();
                    }
                    show(data);

                    //call Search filter
                }
                getCovidData(api_url);
            }
            showtableData("india");


            // Function to hide the loader
            function hideLoader() {
                loader.classList.add("hide");
            }

            // Function to define innerHTML for HTML table
            function show(data) {

                function dataShownFunction(inputValueData) {
                    let dataToBeShown = inputValueData; //Number of data Enteries to be shown on one page
                    let items, numberOfDataShown = dataToBeShown,
                        intialValue = 0;

                    nextArrow.addEventListener("click", function() { //next arrow click 
                        numberOfDataShown += dataToBeShown;
                        intialValue += dataToBeShown;
                        printData(intialValue, numberOfDataShown);
                    });

                    prevArrow.addEventListener("click", function() { ////previous arrow click 
                        if (intialValue > 0 && numberOfDataShown > dataToBeShown) { //change value only if not the first page
                            numberOfDataShown -= dataToBeShown;
                            intialValue -= dataToBeShown;
                            printData(intialValue, numberOfDataShown);
                        }

                    });

                    function printData(intialValue, numberOfDataShown) {

                        // Loop to access rows
                        let tableRow = "";
                        for (items = intialValue; items < numberOfDataShown; items++) {
                            tableRow += `<tr class="table-row"> 
                                    <td class="table-data">${data[items].Active}</td>
                                    <td class="table-data">${data[items].Confirmed}</td>
                                    <td class="table-data">${data[items].Deaths}</td> 
                                    <td class="table-data">${data[items].Recovered}</td>
                                    <td class="table-data">${data[items].Lat}</td>
                                    <td class="table-data">${data[items].Lon}</td>
                                    <td class="table-data">${data[items].Date}</td>       
                                    </tr>`;
                        }

                        // Setting innerHTML as tableRow variable
                        tableBody.innerHTML = tableRow; //table data
                        totalDataCount.innerHTML = data.length; //Total Data Count
                        currentData.innerHTML = `${intialValue} - ${numberOfDataShown}`; //Current data

                    }
                    printData(intialValue, numberOfDataShown);

                }
                dataShownFunction(6);
            }
        }
    }

    function registerEvent() {
        _setSelector();
        showTable();
    }
    return {
        registerEvent: registerEvent
    }

})();

window.addEventListener("load", function() {
    var wrapper = document.querySelector(".wrapper");
    if (wrapper) {
        fetchData.registerEvent();
    }
})