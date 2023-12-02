
async function loadVideos() {
    let videos = [];
    // insert youtube api data key here
    let apiKey = ""
    let popURL = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&key=' + apiKey;
    let response = await fetch(popURL);
    let data = await response.json();
    videos = videos.concat(data.items);
    while (data.nextPageToken != null){
        popURL = popURL + "&pageToken=" + data.nextPageToken;
        response = await fetch(popURL);
        data = await response.json();
        videos = videos.concat(data.items);
    }
    for (let i=0; i<videos.length; i++){
        videos[i].trending = i+1;
        let title = videos[i].snippet.title;
        videos[i].snippet.title = '"' + title + '"';
        // if (!('maxres' in videos[i].snippet.thumbnails)){
        //     videos[i].snippet.thumbnails.maxres = {url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg"}
        // }
        let max = -1
        let tUrl = null
        for (var key in videos[i].snippet.thumbnails){
            let res = videos[i].snippet.thumbnails[key].width * videos[i].snippet.thumbnails[key].height
            if (res > max){
                max = res
                tUrl = videos[i].snippet.thumbnails[key].url
            }
        }
        videos[i].snippet.thumbnails.maxres = {
            url: tUrl
        }
    }
    // old shuffle algo
    // let shuffledVideos = unshuffledVideos
    //     .map(value => ({ value, sort: Math.random() }))
    //     .sort((a,b) => a.sort - b.sort)
    //     .map(({ value }) => value)

    // durstenfeld shuffle
    for (let i = videos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [videos[i], videos[j]] = [videos[j], videos[i]];
    }

    console.log("loaded!")
    return videos;
}

module.exports = {
    loadVideos
}