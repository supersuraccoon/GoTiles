// helper.js

// array
Array.prototype.swapArrayElements=function(index_a, index_b) {
    var temp = this[index_a];
    this[index_a] = this[index_b];
    this[index_b] = temp;
};

Array.prototype.clear=function() {
    this.length=0;
};

Array.prototype.insertAt=function(index,obj){
    this.splice(index,0,obj);
};

Array.prototype.removeAt=function(index){
    this.splice(index,1);
};

Array.prototype.remove=function(obj){
    var index=this.indexOf(obj);
    if (index>=0){
        this.removeAt(index);
    }
};

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

function newFilledArray(length, val) {
    var array = [];
    for (var i = 0; i < length; i++) {
        array[i] = val;
    }
    return array;
};

// string
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.prototype.beginsWith = function (string) {
    return (this.substring(0, string.length) == string)
    //return(this.indexOf(string) === 0);
};

// object
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    } return size;
};

// return days in a given month + year
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
};

// return the weekday of the first in a given month + year
function getFirstDay (month, year) {

    var dateObj =  new Date();
    dateObj.setFullYear(year);
    dateObj.setMonth(month - 1);
    dateObj.setDate(1);
    return dateObj.getDay();
};

// return a date string from give second
function stringFromTime(sec) {
    var d = new Date(sec * 1000);
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    return year + "." + month + "." + date
};

// returns a date string of now
function nowStringDate() {
    return stringFromTime(new Date().getTime() / 1000);
};
