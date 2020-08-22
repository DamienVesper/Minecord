module.exports = {
    calculateMaxExp = level => {
        return Math.floor((100 * Math.E * level) / 2);
    },
    cleanse: str => {
        return str
            .replace(`\`\`\``, `\\\`\\\`\\\``)
            .replace(`\``, `\\\``)
            .replace(`||`, `\\|\\|`)
            .replace(`_`, `\\_`)
            .replace(`***`, `\\*\\*\\*`)
            .replace(`**`, `\\*\\*`)
            .replace(`*`, `\\*`);
    },
    getClosestMatch: (a, b) => {
        const distCalc = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

        for(let i = 0; i <= a.length; i++) distCalc[0][i] = i;
        for(let j = 0; j <= b.length; j++) distCalc[j][i] = j;

        for(let k = 1; k <= b.length; k++) {
            for(let l = 1; l <= a.length; l++) {
                const indicator = (a[l - 1] === b[k - 1]) ? 0: 1;
                distCalc[k][l] = Math.min(
                    distCalc[k][l - 1] + 1,
                    distCalc[k - 1][l] + 1,
                    distCalc[k - 1][l - 1] + indicator
                );
            }
        }
        return distCalc[b.length][a.length];
    },
    rng: (min, max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min); 
    },
    standardize: num => {
        return typeof num === `number` ? 
            Math.abs(Number(num)) >= 1.0e+21 ? (Math.abs(Number(num)) / 1.0e+21).toFixed(2) + "S" :
            Math.abs(Number(num)) >= 1.0e+18 ? (Math.abs(Number(num)) / 1.0e+18).toFixed(2) + "QT" :
            Math.abs(Number(num)) >= 1.0e+15 ? (Math.abs(Number(num)) / 1.0e+15).toFixed(2) + "Q" :
            Math.abs(Number(num)) >= 1.0e+12 ? (Math.abs(Number(num)) / 1.0e+12).toFixed(2) + "T" :
            Math.abs(Number(num)) >= 1.0e+9 ? (Math.abs(Number(num)) / 1.0e+9).toFixed(2) + "B" :
            Math.abs(Number(num)) >= 1.0e+6 ? (Math.abs(Number(num)) / 1.0e+6).toFixed(2) + "M" :
            Math.abs(Number(num)) >= 1.0e+3 ? (Math.abs(Number(num)) / 1.0e+3).toFixed(2) + "K" :
            Math.abs(Number(num)): NaN;
    }
}