module.exports = {
<<<<<<< HEAD
    calculateMaxExp = level => {
=======
    calculateMaxExp: level => {
>>>>>>> 37441649851105541b39cfad8331162e3ff64a20
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
<<<<<<< HEAD
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
=======
        var m = [], i, j, min = Math.min;

            if (!(a && b)) return (b || a).length;

            for (i = 0; i <= b.length; m[i] = [i++]);
            for (j = 0; j <= a.length; m[0][j] = j++);

            for (i = 1; i <= b.length; i++) {
                for (j = 1; j <= a.length; j++) {
                    m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)
                        ? m[i - 1][j - 1]
                        : m[i][j] = min(
                            m[i - 1][j - 1] + 1, 
                            min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
                }
            }

        return m[b.length][a.length];
>>>>>>> 37441649851105541b39cfad8331162e3ff64a20
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
<<<<<<< HEAD
    }
=======
    },
    toCamelCase: array => {
        let result = "";
        for(let i = 0 , len = array.length; i < len; i++) {
          let currentStr = array[i];
          let tempStr = currentStr.toLowerCase();
          if(i != 0) {
              tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
           }
           result +=tempStr;
        }
        return result;
    },
    toCapitalString: string => { return string.toString().replace(/^\w/, f => f.toUpperCase()).split(/(?=[A-Z])/).join(` `) },
    toCapitalStringFromArray: array => { return array.join(``).toString().replace(/^\w/, f => f.toUpperCase()).split(/(?=[A-Z])/).join(` `) },
    addCommaSeparators: num  => { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
>>>>>>> 37441649851105541b39cfad8331162e3ff64a20
}