import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import $ from 'jquery'; 

/*const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
//declare variables
var pageSize= 1;
var currentPage = 2;
var lastPage = 0;
var totalCount = 0;

function basicDataQuery(){

    return {
      
        pageNum: currentPage,
        pageSizing: pageSize
    };
    

}

const basicDataPaginationFunction = {

    gotoFirstPage: function () {
        basicDataQuery['pageNum'] = 1;
       
    },
    changePage: function (delta) {
        basicDataQuery['pageNum'] += parseInt(delta);
    },
    changePageSize: function (newPageSize) {
        console.log(newPageSize);
        basicDataQuery['pageSizing'] = newPageSize;
    },
    gotoLastPage: function () {
        basicDataQuery['pageNum'] = lastPage;
    }

}

//const basicDataUrl = 'http://localhost:3000/basic/data';

function populateBasicDataTable(data) {

    const dataTableHtml = data.map(
      ({ tenderNo, agency, supplierName, yearAwarded, awardedAmt }) => `
      <tr>
          <td>${tenderNo}</td>
          <td>${agency}</td>
          <td>${supplierName}</td>
          <td>${yearAwarded}</td>
          <td>${awardedAmt}</td>
      </tr>
        `,
    );

    $('#basic-data-tbody').html(dataTableHtml);

}

//Get Basic Data from Database
function getBasicDataFromBackend(callback) {
    const basicDataUrl = 'https://morning-hollows-07984.herokuapp.com/api/gov-procurement/procurements?page=2000&pageSize=10';
    //console.log(basicDataQuery());
    $.get(basicDataUrl)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));

}

function refreshBasicDataTable() {

    getBasicDataFromBackend(function (error, data) {

        console.log("Bing bong", data.data);
        totalCount = data['totalCount']; 
        console.log(totalCount);

        pageSize = $("#basic-data-page-size-select option:selected").val();
        console.log(pageSize);

        if (error) return alert("Error, invalid input!");
        populateBasicDataTable(data['data']);

    });

}

/*function searchItem(data) {
  var input, filter, ul, i ;
  input = document.getElementById("searchItem");
  filter = input.value.toUpperCase();
  ul = data;
  
  for(var i = 0; i < ul.length; i++)
{
  if(ul[i] == input.value)
  {
    return ul[i];
  }
}
}*/

function filterBasicData(event) {

    $('#basic-data-filter-form input').not(':input[type = submit]').each((idx, input) => {
        basicDataQuery[$(input).attr('key')] = $(input).val();
    });

    refreshBasicDataTable();

    return false;

}

function registerBasicDataFilterForm() {

    $('#basic-data-filter-form').submit(filterBasicData);

}

//Pagination
function paginateBasicData(event) {

    const fn = $(this).attr('fn');
    const value = $(this).attr('value') || $(this).val();
    pageSize = $("#basic-data-page-size-select option:selected").val();
    lastPage = Math.ceil(totalCount/pageSize);
    console.log(lastPage)

    if(value === 0){
        basicDataQuery['pageNum'] = 1;
        currentPage = 1;
    } else if(value === -2){
        if(currentPage !== lastPage){
            basicDataQuery['pageNum'] = lastPage
            currentPage = lastPage;
        }
    } else if(value === -1){
        if(currentPage !== 1){
            basicDataQuery['pageNum'] -= 1;
            currentPage --;
        }
    } else if(value === 1){
        basicDataQuery['pageNum'] += 1;
        currentPage++;
    } else{

    }
    
    basicDataPaginationFunction[fn](value);
    console.log(fn + ", " + value)
    refreshBasicDataTable();

}

function registerBasicDataPaginationForm() {

    $('#basic-data-first-page').click(paginateBasicData);
    $('#basic-data-previous-page').click(paginateBasicData);
    $('#basic-data-next-page').click(paginateBasicData);
    $('#basic-data-last-page').click(paginateBasicData);
    $('#basic-data-page-size-select').change(paginateBasicData);

}

$(document).ready(function () {

    refreshBasicDataTable();
    //searchItem();
    
    registerBasicDataFilterForm();
    registerBasicDataPaginationForm();

});