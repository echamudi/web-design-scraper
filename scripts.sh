npx eslint ./executor/**/*.ts --fix
npx eslint ./core/**/*.ts --fix
npx eslint ./chrome-ext/**/*.{ts,tsx} --fix

license-report --output=html --config license-report-config.json > licenses.html
