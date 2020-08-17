(function (root) {
    function rsi(dataObjArr, focusIndex, timePeriods) {
        var result = {
            isSuccess: false,
            msg: null
        };
        try {
            // console.log(dataObjArr.length, timePeriods, focusIndex);
            if (dataObjArr.length > timePeriods && focusIndex >= timePeriods) {
                var avg_gain0 = dataObjArr[timePeriods].gain;
                var avg_loss0 = dataObjArr[timePeriods].loss;

                for (var i = 1; i < timePeriods; i++) {
                    avg_gain0 += dataObjArr[i].gain;
                    avg_loss0 += dataObjArr[i].loss;
                }
                //console.log('|   Date   | Data | Gain | Loss | AVG Gain | AVG Loss | RS | RSI |');
                dataObjArr[timePeriods].avgGain = parseFloat(avg_gain0) / timePeriods;
                dataObjArr[timePeriods].avgLoss = parseFloat(avg_loss0) / timePeriods;
                dataObjArr[timePeriods].rs = parseFloat(dataObjArr[timePeriods].avgGain) / parseFloat(dataObjArr[timePeriods].avgLoss);
                dataObjArr[timePeriods].rsi = 100 - (100 / (1 + dataObjArr[timePeriods].rs));

                var trend = 0;
                for (let i = timePeriods + 1; i < focusIndex; i++) {
                    avg_gain0 = avg_gain0 - dataObjArr[i - timePeriods + 1].gain + dataObjArr[i].gain
                    avg_loss0 = avg_loss0 - dataObjArr[i - timePeriods + 1].loss + dataObjArr[i].loss
                    if (!dataObjArr[i]) console.log(i);
                    dataObjArr[i].avgGain = parseFloat(avg_gain0) / timePeriods;
                    dataObjArr[i].avgLoss = parseFloat(avg_loss0) / timePeriods;
                    dataObjArr[i].rs = parseFloat(dataObjArr[i].avgGain) / parseFloat(dataObjArr[i].avgLoss);
                    dataObjArr[i].rsi = 100 - (100 / (1 + dataObjArr[i].rs));
                    prevAVGGain = dataObjArr[i].avgGain;
                    prevAVGLoss = dataObjArr[i].avgLoss;
                    if (dataObjArr[i - 1].rsi) {
                        if (dataObjArr[i - 1].rsi > dataObjArr[i].rsi) {
                            if (trend >= 0 && dataObjArr[i].rsi >= 70) dataObjArr[i].high_peak = true
                            trend = -1;
                        } else {
                            if (trend <= 0 && dataObjArr[i].rsi <= 30) dataObjArr[i].low_peak = true
                            trend = 1;
                        }
                    }
                }
                return dataObjArr;
                prevAVGGain = null;
                prevAVGLoss = null;
                avg_gain0 = null;
                avg_loss0 = null;
                result.isSuccess = true;
            } else {
                result.isSuccess = false;
                result.msg = "'timePeriods' must less than the amount of data!!!";
            }
        } catch (e) {
            result.isSuccess = false;
            result.msg = e.stack;
        }
        return result;
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = rsi;
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function () {
                return rsi;
            });
        } else {
            root.rsi = rsi;
        }
    }
})(this)