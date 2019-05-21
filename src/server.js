const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Income = require('./models/income');
const logger = require('./utils/logger');
const env_config = require('./config/environment');
const cors = require('./middlewares/cors');
const bodyParser = require('body-parser');

mongoose.connect(env_config.database.mongodb);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.get('/income', (req, res) => {
    logger.log(`get /income req.query: ${JSON.stringify(req.body)}`);

    Income.find((err, incomeInfo) => {
        if (err) throw err;
        if (incomeInfo) {
            logger.log(JSON.stringify(incomeInfo));
            res.send({'msg': '成功获取数据', 'income': incomeInfo});
        } else {
            res.send({'msg': '没有数据', 'income': incomeInfo});
        }
    })
});

app.post('/income', (req, res) => {
    logger.log(`post /income req.body: ${JSON.stringify(req.body)}`);

    if (req.body.source && req.body.amount) {
        let tmpIncome = new Income({
            createTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
            source: req.body.source,
            amount: req.body.amount,
            description: req.body.description
        });

        tmpIncome.save((err, result) => {
            if (err) throw err;
            logger.log(result);
            res.send(result);
        })
    }

});

app.post('/delete', (req, res) => {
    logger.log(`delete /delete req.body: ${JSON.stringify(req.body)}`);

    Income.findOneAndRemove({createTime: req.body.createTime}, (err, result) => {
        if (err) throw err;

        logger.log(result);

        if (result) {
            logger.log('删除成功！')
            res.send(result);
        } else {
            res.send({'ok': 0, 'msg': '删除失败'});
        }
    })
})

app.listen(3000, () => console.log('app listening on port 3000'));
