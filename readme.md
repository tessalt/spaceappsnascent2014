# Spaceapps Nascent Project 2014

To run locally: 

## Dependencies

- npm
- node
- mongo

```
git clone https://github.com/tessalt/spaceappsnascent2014.git
cd spaceappsnascent2014
npm install
mongod
node app
```

Will start a local server at localhost:3000

## API

### `GET /sensorkits`

list all sensorkits

    [
        {        
            "id": ObjectID,
            "name": String,
            "location": String
        }
    ]

### `POST /sensorkits`

Create new sensorkit

    {
        name: String,
        location: String
    }

### `PUT /sensorkits/:id`

Update sensorkit 
  
    {
        name: String,
        location: String
    }

### `DELETE /sensorkits/:id`

Destroy sensorkit

### `GET /sensorkits/measurements`

list all measurements for all sensorkits in reverse chronological order

    [
        {
            "temperature": Number,
            "humidity": Number,
            "pressure": Number,
            "timestamp" Date,
            "id": ObjectID,
            "sensorId": ObjectID
        }
    ]

### `GET /sensorkits/:id/measurements`

List all measurements from specific sensorkit

### `POST /sensorkits/:id/measurements`

    {
        "temperature": Number,
        "humidity": Number,
        "pressure": Number,
        "timestamp" Date,
        "id": ObjectID,
        "sensorId": ObjectID
    }

### `GET /sensorkits/:id/measurements/:mid`

Get a specific measurement

### `DELETE /sensorkits/:id/measurements/:mid`

Delete a specific measurement
