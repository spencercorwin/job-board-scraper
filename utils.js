exports.copyToClipboard = data => {
    const proc = require('child_process').spawn('pbcopy');
    proc.stdin.write(data);
    proc.stdin.end();
};

exports.filterByTitle = object => {
    // Object should be the obj containing title, id, link
    // Return boolean
    const acceptableTitles = [
        'frontend engineer',
        'front end engineer',
        'front-end engineer',
        'frontend developer',
        'front-end developer',
        'front end developer',
        'software engineer',
        'software developer',
        'front end software engineer',
        'frontend software engineer',
        'front-end software engineer',
        'front end software developer',
        'frontend software developer',
        'front-end software developer',
        'full-stack developer',
        'full stack developer',
        'fullstack developer',
        'full stack engineer',
        'full-stack engineer',
        'fullstack engineer',
        'web engineer',
        'web developer',
        'junior',
        'jr',
        'jr.',
    ];
    const unacceptableTitles = [
        'sr.',
        'sr',
        'senior',
        'lead',
        'principal',
        'manager',
        'qa',
        'android',
        'partner',
        'sales',
        'architect',
        'test',
        'co-founder',
        'founder',
        'designer',
        'ios',
        'director',
        'netsuite',
        'mobile',
        '.net',
    ]

    const array = object.title.toLowerCase().split(' ');
    for (let i = 0; i < array.length; i++) {
        if (unacceptableTitles.includes(array[i])) {
            return false;
        }
    }
    return true;

}

// Function to sift through actual posting page
exports.builtInLaPosting = async (url) => {
    // Get title and body info
    // Have it ask me yes or no to continue based on body (possibly open html file in Chrome?)
    // If it passes test then save info to DB/Excel/test and open the job post in Chrome
    // Open a new MS Word window with the text ready
    // Save title, company, ID to DB, text file, CSV file, Excel
    // Save to saved jobs
    const postingTitle = $('span.field--name-title').text();
}