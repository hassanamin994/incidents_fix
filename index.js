const mongoose = require('mongoose');
const moment = require('moment');
var Schema = mongoose.Schema;

//url - creation
//sample - mongodb://<dbuser>:<dbpassword>@ds011459.mlab.com:11459/ilist-puma-db
var mongoURL = 'mongodb://localhost:27017/test-simplestatus-db'


var conn = mongoose.connect(mongoURL, {
	  useMongoClient: true,
});

conn.then(function(db) {

});


var incidentSchema = new mongoose.Schema({

  incident_start_date: { type: mongoose.Schema.Types.Mixed, required: true },
  incident_start_time: { type: mongoose.Schema.Types.Mixed, required: true },

  incident_end_date: { type: mongoose.Schema.Types.Mixed },
  incident_end_time: { type: mongoose.Schema.Types.Mixed },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const incidentsModel = mongoose.model('incidents', incidentSchema);

incidentsModel.find({}, (err, incidents) => {
  console.log(err,)
  if (incidents) {
    incidents.forEach(function(incident) {
      incident = incident.toObject()
      const update = {};
      if (incident.incident_start_date && typeof incident.incident_start_date !== 'number') {
        const startDate = moment(new Date(incident.incident_start_date)).startOf('day').toDate().getTime();
        update.incident_start_date = startDate;
      }
      if (incident.incident_end_date && typeof incident.incident_end_date !== 'number') {
        const endDate = moment(new Date(incident.incident_end_date)).startOf('day').toDate().getTime();
        update.incident_end_date = endDate;
      }
      if ( update.incident_start_date || update.incident_end_date) {
        incidentsModel.findByIdAndUpdate(incident._id, {$set: update}, (err, r) => {
          console.log(err)
          if (!err) {
            console.log('updated icident', update, incident._id);
          }
        })
      }
    })
  }
})