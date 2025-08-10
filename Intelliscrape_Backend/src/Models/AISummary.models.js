const mongoose = require('mongoose');
const summarySchema = new mongoose.Schema({
    scraperesultId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "ScrapeResult",
        required: true
    },
    summaryData: {
        type: String
    },
    summaryModel: {
        type: String
    },
    
},{timestamps: true});
export const AISummary = mongoose.model('AISummary', summarySchema);