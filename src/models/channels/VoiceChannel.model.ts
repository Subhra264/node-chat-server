const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoiceChannelSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },

  parentGroup: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
});

export = mongoose.model('VoiceChannel', VoiceChannelSchema);
