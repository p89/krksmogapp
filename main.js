$(document).ready(function() {
    
    function buttonColoring (value, target) {

        switch (true) {
            case value <= 50:       
                $(target).addClass('pm50');
                break;
            case value <= 100:
                $(target).addClass('pm100');
                break;
            case value <= 150:
                $(target).addClass('pm150');
                break;
            case value <= 200:
                $(target).addClass('pm200');
                break;
            case value <= 250:
                $(target).addClass('pm250');
                break;
            case value > 250:
                $(target).addClass('pm251');
                break;    
            }
     };

     function useBackupAPI () {

        // --------- code for api.waqi.info 

    //alt token for Waqi bb892cfadf429d1f082713c403d0409f853d9559
    const apiWaqi = "https://api.waqi.info/map/bounds/?latlng=49.906700,20.172406,50.135416, 19.753533&token=116aeb0ae86ca95196f331f9b0333adb0aa95a7b";
    const backupApi = $.getJSON(apiWaqi, function(smogdata) {
        
        let stationsIDS = {
            zlotyRog:   8691,
            alejKras:   3402,
            dietla:     8689,
            kurdwanow:  3407,
            piastow:    9039,
            bulwarowa:  3403
        };   

        let arr = smogdata.data.filter(function(index) { 
            for (num in stationsIDS) {
                if (index.uid === stationsIDS[num]) {
                    return(index);
                } 
            }
        });


        function displayPMI (stationID, index) { 

            for (let i = 0; i < arr.length; i++) {
                           
                let divNr = `#div${index}`; 

                if (arr[i].uid === stationID) {
                    if (arr[i].uid !== "-") { 
                        buttonColoring(arr[i].aqi, divNr);
                        return arr[i].aqi; 
                    } else {             
                        return "n/a";               
                    }
                }
            }
        };

        $('#station0').html(displayPMI(stationsIDS.alejKras, 0));
        $('#station1').html(displayPMI(stationsIDS.bulwarowa, 1));
        $('#station2').html(displayPMI(stationsIDS.kurdwanow, 2));
        $('#station3').html(displayPMI(stationsIDS.dietla, 3));
        $('#station4').html(displayPMI(stationsIDS.piastow, 4));
        $('#station5').html(displayPMI(stationsIDS.zlotyRog, 5));

        });


     };


    // --------- code for powietrze.malopolska.pl api

    const apiUrl = 'http://powietrze.malopolska.pl/_powietrzeapi/api/dane?act=danemiasta&ci_id=01';
    const prefix = 'https://cors-anywhere.herokuapp.com/';
    const finalUrl = prefix + apiUrl;

    $.getJSON(finalUrl, function(results) {

    // there are several ways the getJSON api download can fail:
    // a) proxy can die  b) api can die  c) api and proxy can live but api can return null
    // & possibly more
    // added additional condition to check whether the random index returns true 
    
    if (results.dane.actual[5].details[0]) {    

    
        let defaultVal =  "n/a";

        function checkForErr (id, position, property, tail) {
            
            if(property === 'station_name' && data[id][property] !== undefined) {
                return data[id][property];

            } else if(property === 'station_hour' && data[id][property] !== undefined) {
                return data[id][property] + ":00";

            } else if(position in data[id][property]){
                
                return data[id][property][position][tail];
            } else {
                return defaultVal;
            }
        }

        var data = results.dane.actual;
        
    // object constructor for each field in which we're going to present the data

        function StatusObject (id) {

            this.fieldName = `#div${id}`;
            this.name = checkForErr(id, null, 'station_name') ;
            this.hour = checkForErr(id, null, 'station_hour');
            this.status = checkForErr(id, 0, 'details', 'g_nazwa');
            this.pm10 = checkForErr(id, 0, 'details', 'o_value');
            this.pm25 = checkForErr(id, 1, 'details', 'o_value');
            this.no2 = checkForErr(id, 2, 'details', 'o_value');
            this.co = checkForErr(id, 3, 'details', 'o_value');
    
            this.getValues = function () {
                return {
                    "Nazwa stacji:"                 : this.name,
                    "Godzina pomiaru:"              : this.hour,
                    "Aktualna jakość powietrza:"    : this.status,
                    "Poziom PM 10:"                 : this.pm10,
                    "Poziom PM 2,5:"                : this.pm25,
                    "Poziom NO2:"                   : this.no2,
                    "Poziom CO:"                    : this.co
                };

            };
        };

        let Station0 = new StatusObject(0);
        let Station1 = new StatusObject(1);
        let Station2 = new StatusObject(2);
        let Station3 = new StatusObject(3);
        let Station4 = new StatusObject(4);
        let Station5 = new StatusObject(5);

console.log(Station0.getValues());
console.log(Station1.getValues());
console.log(Station2.getValues());
console.log(Station3.getValues());
console.log(Station4.getValues());
console.log(Station5.getValues());

    
  
    

    } else {
      useBackupAPI();
    };

}).fail(function() {  

    useBackupAPI();
    
});

});