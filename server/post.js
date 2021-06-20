const mongoose = require('mongoose');

const { Schema } = mongoose;
const postsSchema = new Schema({
  title: {
    type: String,
    
  },
  link: {
    type: String,
    
  },
  part:{
    type : String,
  }
});
postsSchema.set('collection','tests');


module.exports = mongoose.model('tests', postsSchema);
