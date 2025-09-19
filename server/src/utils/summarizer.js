const SummarizerManager = require('node-summarizer').SummarizerManager;

const summarize = async (text, numSentences = 3, maxLength = 500) => {
    const summarizer = new SummarizerManager(text, numSentences);
    let summaryObj =  await summarizer.getSummaryByRank();

    let summary = summaryObj.summary;

    // Trim the summary to a max length
    if (summary.length > maxLength) {
        summary = summary.substring(0, maxLength) + '...';  // Optional: truncate with ellipsis
    }

    // Optionally limit by sentences
    const sentences = summary.split('.').slice(0, numSentences).join('.') + '.';
    return sentences;
};

module.exports = { summarize };