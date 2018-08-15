module.exports = {
  "{src,tests,examples}/**/*.{ts,js}": [
    "prettier --write",
    "tslint --fix",
    "git add"
  ]
}
