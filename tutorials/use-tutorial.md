# Logger
Logger is a very simple logging tool with the bare minimal of functionality. Built in are the following options:
4 different logging levels (Error, Warning, Info, Dev)
Log to the console (with some configuration)
add colour styling
add date
add debug details
Add colours

## Usage
```js
const logger = require('Logger');
logger.configLogger({
    methods:[
        {
            type: 'console',
            colors: true,
            showDate: true,
            isDebug: {
                on: true
            }
        }
    ], 
    level: 4
});

logger.error('database connection dropped');
logger.warning('unauthorised access attempt');
logger.info({
    msg: 'New signup: <username: "alan"',
    ip: '123.123.123.45',
    os: 'windows',
    device: {
        type: 'mobile',
        model: 'iphone6'
    }
});

logger.dev('inside [login]')
```

## Custom Channels
To use other logging channels such as writing to a file, provide a callback function that accepts the data paramater and write your own handler.

```js
// Mongoose
const wrapper = (data) =>LogModel(data).save().catch(err=>console.log(err));

const configMongoose = {
    type: 'function',
    level: 3,
    func: wrapper
};


const configFile = {
    type: 'function',
    onlyLevel: 1,
    func: fileWriter,       //where fileWriter = callback to write to file
    showDate: true,
    fieldOptions:{
        isRaw: false
    }
}

const logger = require('Logger');
logger.configLogger({
    methods:[
        configMongoose,
        configFile
    ], 
    level: 4
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)