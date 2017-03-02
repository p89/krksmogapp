
$(document).ready(function() {
    
    

    const apiUrl = 'http://powietrze.malopolska.pl/_powietrzeapi/api/dane?act=danemiasta&ci_id=01';
    const prefix = 'https://cors-anywhere.herokuapp.com/';
    const finalUrl = prefix + apiUrl;

    $.getJSON(finalUrl, function(results) {

  var stations = results.dane.actual;
  
  stations.forEach(function(station) {
    $("body").append("<h2>"+ station.station_name +"</h2>");
  });
    }).fail(function() {
    


    //alt token for Waqi bb892cfadf429d1f082713c403d0409f853d9559
    const apiWaqi = "https://api.waqi.info/map/bounds/?latlng=49.906700,20.172406,50.135416, 19.753533&token=116aeb0ae86ca95196f331f9b0333adb0aa95a7b";
    $.getJSON(apiWaqi, function(smogdata) {
        
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
        }

        // function Circle(index, location) {
        //     this.fieldStr = "#station" + index;
        //     this.locationStr = "stationsIDS." + location;
        //     this.map = "stationsIDS.zlotyRog";
        //     $('#station0').on('hover(function() {
        //          Stuff to do when the mouse enters the element 
        //     }, function() {
        //         /* Stuff to do when the mouse leaves the element */
        //     });', displayPMI(stationsIDS.zlotyRog, 0));
        // }   
        // let Circle0 = new Circle('zlotyRog', 0);

        $('#station0').html(displayPMI(stationsIDS.zlotyRog, 0));
        $('#station1').html(displayPMI(stationsIDS.alejKras, 1));
        $('#station2').html(displayPMI(stationsIDS.dietla, 2));
        $('#station3').html(displayPMI(stationsIDS.kurdwanow, 3));
        $('#station4').html(displayPMI(stationsIDS.piastow, 4));
        $('#station5').html(displayPMI(stationsIDS.bulwarowa, 5));

        });
});
});