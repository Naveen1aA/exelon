const express = require('express');
const mongoose = require('mongoose');
const Cities = require('./model');


const app = express();

app.use(express.json());

//connecting the mongoose database
mongoose.connect("mongodb+srv://naveenmallireddi1919:7997880013@cluster0.s35ms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> {console.log("db connected...")})

//post api to send the data to backend
app.post('/cities', async (req, res) => {
    const {name, population, country, latitude, longitude} = req.body;
    try{
        //creating an object that contains sevaral fields
        const city = new Cities ({name, population, country, latitude, longitude});
        await city.save();
        // returning the response
        return res.json(await Cities.find());
    }catch(err){
        console.log(err.message)
    }
})

app.get('/getcities', async (req, res) => {
    try {
        // Extract query parameters
        const { page = 1, limit = 10, filter, sort, search, projection } = req.query;

        // Build the query object
        const query = {};

        // Search: If a search term is provided, perform a case-insensitive search by city name
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search on the name field
        }

        // Filter: Parse the filter JSON string if provided
        if (filter) {
            Object.assign(query, JSON.parse(filter));
        }

        // Projection: Convert comma-separated fields into an object
        const projectionFields = projection
            ? projection.split(',').reduce((acc, field) => {
                  acc[field.trim()] = 1;
                  return acc;
              }, {})
            : {};

        // Sort: Convert comma-separated sort fields into an object
        const sortFields = sort
            ? sort.split(',').reduce((acc, field) => {
                  const [key, order] = field.trim().split(':');
                  acc[key] = order === 'desc' ? -1 : 1;
                  return acc;
              }, {})
            : {};

        // Pagination: Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Execute the query with sorting, projection, and pagination
        const allCities = await Cities.find(query)
            .select(projectionFields)
            .sort(sortFields)
            .skip(skip)
            .limit(parseInt(limit));

        // Get the total count for pagination purposes
        const totalCount = await Cities.countDocuments(query);

        // Return the results with pagination info
        return res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            cities: allCities,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Error retrieving cities', error: err.message });
    }
});


//put api to update the cities
app.put('/updatecity/:id', async (req, res)=> {
    try{
        //updating the cities based on the object id
       const updateCity = await Cities.findByIdAndUpdate(req.params.id,req.body)
       //returning the updated city
       return res.json(updateCity)
    }catch(err){
      console.log(err.message)
    }
})

//delete api to delete specific city
app.delete('/deletecity/:id', async (req, res)=> {
    try{
      //deleting the city based on the id
      await Cities.findByIdAndDelete(req.params.id)
      return res.json(await Cities.find())
    }catch(err){
        console.log(err.message)
    }
})

const PORT = 3001
//creating an sever th
app.listen(PORT, ()=> {
    console.log("serevr running")
})

