const { INTRASTATE_REGIONS, INTERSTATE_REGIONS, HOT_OPERATORS, LOCO_TYPES, DOW_MAPPING, COAL_LOADING_POINTS, MAINT_REGIONS, MAINT_TYPES } = require('./consts');

const {
    getIntrastateOperator,
    getLightLocoOperator,
    isEvenDigit
} = require('./helpers');

const nswRunNumberParser = (runNumber) => {
    let operator = undefined;
    let up = undefined;
    let trainType = undefined;

    let commenceRegion = undefined;
    let finishRegion = undefined;
    let serviceName = undefined;

    // 7.4. Passenger trains – heritage operator tours (HOT)
    // 7.5. Light locomotives – heritage operators
    if(runNumber.match(/^[56789][ELRSZDX][0-9]{2}$/)){
        const operatorKey = runNumber[0];
        operator = HOT_OPERATORS[operatorKey];

        const trainTypeKey = runNumber[1];
        trainType = LOCO_TYPES[trainTypeKey];

        up = isEvenDigit(runNumber[3]);

        serviceName = `${trainType} heritage service operated by ${operator}`

    // 7.6. Intrastate trains
    }else if(runNumber.match(/^[0-9]{4}$/)){
        const commenceRegionKey = runNumber[0];
        const finishRegionKey = runNumber[1];
        
        commenceRegion = INTRASTATE_REGIONS[commenceRegionKey];
        finishRegion = INTRASTATE_REGIONS[finishRegionKey];

        operator = getIntrastateOperator(runNumber);

        up = isEvenDigit(runNumber[3]);

        trainType = 'Intrastate train';
        serviceName = `Intrastate service from ${commenceRegion} to ${finishRegion} region operated by ${operator}`;

        // 7.8. Interstate trains – freight and passenger
    }else if(runNumber.match(/^[0-9][A-Z]{2}[0-9]$/)){
        const dowKey = runNumber[0];
        const dow = DOW_MAPPING[dowKey];

        const commenceRegionKey = runNumber[1];
        const finishRegionKey = runNumber[2];
        commenceRegion = INTERSTATE_REGIONS[commenceRegionKey];
        finishRegion = INTERSTATE_REGIONS[finishRegionKey];

        up = isEvenDigit(runNumber[3]);

        trainType = 'Interstate train';
        serviceName = `${dow} service from ${commenceRegion} region to ${finishRegion} region`;
        

        // 7.9. Coal trains – (South and West) (in conjunction with ARTC)
    }else if(runNumber.match(/^(AR|BB|CA|CB|CG|GL|IH|LS|LG|MC|TM)[0-9]{2}$/)){
        const coalLoadingPointKey = runNumber.substr(0, 2);
        
        commenceRegion = COAL_LOADING_POINTS[coalLoadingPointKey];

        const operatorInt = parseInt(runNumber.substr(2, 2));
        if(operatorInt <= 10){
            operator = 'Southern Shorthaul Railroad'
        }else if(operatorInt <= 30){
            operator = 'Pacific National'
        }else if(operatorInt <= 40){
            operator = 'Freightliner Australia'
        }else if(operatorInt <= 99){
            operator = 'Pacific National'
        }

        up = isEvenDigit(runNumber[3]);
        trainType = 'Coal train';
        serviceName = `Coal train from ${commenceRegion} operated by ${operator}`;


        // 7.11. Light locomotives
        // 7.12. Light locomotives between Woodville Junction – Cardiff Workshops – Woodville Junction
        // 7.13. Trip trains Sydney area bounded by Botany / Minto / Clyde Yard and Yennora
        // 7.14. Trip trains Newcastle area bounded by Woodville Junction / Broadmeadow / Sulphide Junction
    }else if(runNumber.match(/^[DXZ][0-9]{3}$/)){
        const trainTypeKey = runNumber[0];
        trainType = LOCO_TYPES[trainTypeKey];
        
        const regionKey = runNumber[1];
        commenceRegion = INTRASTATE_REGIONS[regionKey];

        if(trainTypeKey === 'D'){
            operator = getLightLocoOperator(runNumber)
        }

        if(!operator){
            operator = getIntrastateOperator(`1${runNumber.substr(1, 3)}`)
        }

        up = isEvenDigit(runNumber[3]);

        serviceName = `${trainType} service from ${commenceRegion} region${operator ? ` operated by ${operator}`: ''}`;
    }else if(runNumber.match(/^[T][0-9]{3}$/)){
        const trainTypeKey = runNumber[0];
        trainType = LOCO_TYPES[trainTypeKey];

        operator = getLightLocoOperator(runNumber);

        if(!operator){
            operator = getIntrastateOperator(`1${runNumber.substr(1, 3)}`)
        }

        up = isEvenDigit(runNumber[3]);

        serviceName = `${trainType} service${operator ? ` operated by ${operator}`: ''}`;
    }else if(runNumber.match(/^[ME][0-9]{3}$/)){
        const trainTypeKey = runNumber[2];
        trainType = MAINT_TYPES[trainTypeKey];

        const locationKey = runNumber[1];
        origin = MAINT_REGIONS[locationKey];

        serviceName = `${trainType} maintenance train`;
    }

    return {
        operator,
        up,
        trainType,

        commenceRegion,
        finishRegion,
        serviceName
    }
}

module.exports = nswRunNumberParser;