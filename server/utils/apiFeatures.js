class APIFeatures {

    constructor(query, queryString) {

        this.query = query;
        this.queryString = queryString;

    }


    filter() {

        const queryObj = { ...this.queryString };

        const removeFields = [
            "page",
            "limit",
            "sort",
            "search"
        ];

        removeFields.forEach(field => delete queryObj[field]);


        this.query = this.query.find(queryObj);

        return this;

    }


    search(field = "title") {

        if(this.queryString.search){

            this.query = this.query.find({

                [field]: {
                    $regex: this.queryString.search,
                    $options: "i"
                }

            });

        }


        return this;

    }


    sort(){

        const sortBy =
        this.queryString.sort || "-createdAt";


        this.query = this.query.sort(sortBy);


        return this;

    }


    paginate(){

        const page =
        Number(this.queryString.page) || 1;


        const limit =
        Number(this.queryString.limit) || 10;


        const skip =
        (page - 1) * limit;


        this.query =
        this.query.skip(skip).limit(limit);


        return this;

    }

}


module.exports = APIFeatures;