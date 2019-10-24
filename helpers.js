const {
    OPERATOR_TABLE,
    LIGHTLOCO_RUNS
} = require('./consts');

const getIntrastateOperator = (runNumber) => {
    const runNumberInt = parseInt(runNumber);
    for(const [runNumberRange, operator] of OPERATOR_TABLE){
        if(typeof runNumberRange === 'number'){
            if(runNumberInt === runNumberRange){
                return operator;
            }
        }else if(runNumberInt >= runNumberRange[0] && runNumberInt <= runNumberRange[1]){
            return operator;
        }
    }
}

const getLightLocoOperator = (runNumber) => {
    const runNumberInt = parseInt(runNumber.substr(1, 3));
    for(const [runNumberRange, operator] of LIGHTLOCO_RUNS){
        if(typeof runNumberRange === 'number'){
            if(runNumberInt === runNumberRange){
                return operator;
            }
        }else if(runNumberInt >= runNumberRange[0] && runNumberInt <= runNumberRange[1]){
            return operator;
        }
    }
}

const isEvenDigit = digit => {
    return ['0', '2', '4', '6', '8'].includes(digit);
}

module.exports = {
    getIntrastateOperator,
    getLightLocoOperator,
    isEvenDigit
}