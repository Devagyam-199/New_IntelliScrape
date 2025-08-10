const mongoose = require('mongoose');
const scrapeSchema = new mongoose.Schema({
    searchHistoryId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "SearchHistory",
        required: true
    },
    rawHTML: {
        type: String,
    },
    cleanData:{
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
},{timestamps: true});
export const ScrapeResult = mongoose.model('ScrapeResult', scrapeSchema);