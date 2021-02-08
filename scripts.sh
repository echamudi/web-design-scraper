npx eslint ./executor/**/*.ts --fix
npx eslint ./core/**/*.ts --fix
npx eslint ./chrome-ext/**/*.{ts,tsx} --fix

license-report --output=csv --csvHeaders --config license-report-config.json > licenses.csv
