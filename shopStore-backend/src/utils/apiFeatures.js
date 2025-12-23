class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //price=20
  filter() {
    const queryObj = { ...this.queryString };
    console.log(queryObj.sort);
    const excludedQueries = ["sort", "limit", "page", "fields"];
    excludedQueries.forEach((el) => {
      delete queryObj[el];
    });
    this.query = this.query.find(queryObj);
    return this;
  }
  //sort=price
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("price");
    }
    return this;
  }
  //fields=title,price
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  //page=2,limit=12
  paginate() {
    const page = this.queryString.page * 1 || 0;
    const limit = this.queryString.limit * 1 || 12;
    this.query = this.query.skip(limit * page).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
