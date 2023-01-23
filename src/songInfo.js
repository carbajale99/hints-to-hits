

var token_url = 'https://accounts.spotify.com/api/token';


function getRandomSearch() {
    // A list of all characters that can be chosen.
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    
    // Gets a random character from the characters string.
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
    
    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
        case 0:
            randomSearch = randomCharacter + '%';
            randomSearch = '?query=' + randomSearch + '25'
            break;
        case 1:
            randomSearch = '?q=%25' + randomCharacter + '%25';
            break;
        }
        
    return randomSearch;
}

    
function createSearchLink(){
    return 'https://api.spotify.com/v1/search' + getRandomSearch() + "&type=track&limit=1&offset=" + (Math.floor(Math.random() * 1000));
}

function convertMillisToMin(milli){
    var secs = parseInt(milli/1000);
    var init_mins = secs/60;
  
    var min = Math.floor(Math.abs(init_mins));
    var min_string = min < 10 ? '0' + min.toString() : min.toString();
    var sec = Math.floor((Math.abs(init_mins) * 60) % 60);
    var sec_string = sec < 10 ? '0' + sec.toString() : sec.toString();
   
    var final_time = min_string + ":" + sec_string;
  
  
    return final_time;
  };
    
    

var authOptions = {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + window.btoa(process.env.SPOTIFY_CLIENT_ID.toString() + ':' + 
        process.env.SPOTIFY_CLIENT_SECRET.toString()),
        'Accept': 'application/json'
    },
    body: 'grant_type=client_credentials'
};

var hintList = [];

export async function getSongData(){
    try{
        const tokenResponse = await fetch(token_url, authOptions);
        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;
        var randomTrackResponse = await fetch(createSearchLink(),
        {  
            headers:{
                'Authorization' : 'Bearer ' + token,
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
            responseType : 'json'
        }    
        );

        //this is to keep it to popular songs
        var songData = await randomTrackResponse.json();
        while(songData.tracks.items[0].popularity < 50){
            randomTrackResponse = await fetch(createSearchLink(),
            {  
                headers:{
                    'Authorization' : 'Bearer ' + token,
                    'Content-Type' : 'application/x-www-form-urlencoded',
                },
                responseType : 'json'
            }    
            );
            songData = await randomTrackResponse.json();
        }
        
        hintList.push({id : 'trackName', data : songData.tracks.items[0].name});
        hintList.push({id : 'duration', data : convertMillisToMin(songData.tracks.items[0].duration_ms)});
        // hintList.push({id : 'type', data : songData.tracks.items[0].album.album_type});
        hintList.push({id : 'releaseDate', data : songData.tracks.items[0].album.release_date.split("-")[0]});
        hintList.push({id : 'artistName', data : songData.tracks.items[0].artists[0].name});
        hintList.push({id : 'album', data : songData.tracks.items[0].album.name});
        
        const artistGenreResponse = await fetch(
            'https://api.spotify.com/v1/albums/' + songData.tracks.items[0].album.id,{
                headers:{
                    'Authorization' : 'Bearer ' + token,
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json'
                }
            }
            );
            
        const albumData = await artistGenreResponse.json();

        hintList.splice(1,0, {id : 'trackArt', data : albumData.images[1]});

        
        return hintList;
    } catch(error){console.log(error);}
}

export default getSongData;