const express = require('express')
const fs = require('fs') 
const app = express()

app.get("/video", (req, res) => {
    // Range is the position in the video we are currently in example- start , middle , end etc.
    let range = req.headers.range; // It is in a format like:- bytes 68769
    range = toString(range);
    console.log(typeof range)
    // Video file
    const videoPath = "./assets/lecture.mp4";
    
    // Size of the file
    const videoSize = fs.statSync(videoPath).size;
   
    // Chunk size - how much data we want to send using a single chunk
    const chunkSize = 15 * 1e6; //                       1 Megabyte  ===> creating a problem
    
    // Now we are defining the start of the chunk
    const start = Number(range.replace(/\D/g, "")); // "/\D/g" here replaces all the alphabets from the string || so we were extracting the number from the range
    
    // Now we are defining the end of the chunk
    const end = Math.min(start + chunkSize, videoSize - 1); // Min is used here to avoid error which may come at last
    
    // Length of the content being sent using a single chunk
    const contentLength = end - start + 1;
    
    // Now we are writing the headers
    
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers); // Writing headers and 206 means telling the browser that we are sending partial data
        
        // Now reading the part of the video to crate a stream of that part to send
        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res); // sending the response and connection doesn't end and we keep sending the data
});

app.listen(3000, () => console.log('app is running on port 3000'))