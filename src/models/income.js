let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

// 定义一个schema
let incomeSchema = new Schema({ 
    id: {type: String},
    createTime: { type: Date, default: Date.now },
    source: String,
    amount: Number,
    description: String
});

// 自增字段的添加
incomeSchema.pre('save', function(next) {

    // not work now, why??
    if (this.isNew) {
        var doc = this;

        counter.findByIdAndUpdate({_id: 'incomeId'}, {$inc: { seq: 1} }, {new: true, upsert: true}).then(function(count) {
            console.log("...count: "+JSON.stringify(count));
            doc.id = count.seq;
            next();
        })
        .catch(function(error) {
            console.error("counter error-> : "+error);
            throw error;
        });
    } else {
        next();
    }

})

// 返回一个mongo用户库实例
module.exports = mongoose.model('Income', incomeSchema);
