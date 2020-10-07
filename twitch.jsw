// Filename: backend/Twitch.jsw (web modules need to have a .jsw extension)

//import Wix functions
import {fetch} from 'wix-fetch';
import wixData from 'wix-data';
import {getSecret} from 'wix-secrets-backend';

//database info
let dbID = "LiveStreamers";

export async function Twitch() {
   const TWITCH_CLIENT_ID = await twitchClientID();
   const TWITCH_SECRET = await twitchSecret();

	fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_SECRET}&grant_type=client_credentials`, {"method": "post"})
	.then( (httpResponse) => {
		if (httpResponse.ok) {
			//console.log("Authentication Fetch Succeeded");
			return httpResponse.json();
		} else {
			return Promise.reject("Authentication Fetch did not Succeed");
		}
	})
	.then( (authJSON) => {
      fetch('https://api.twitch.tv/kraken/teams/tds', {
				"method": "get",
				"headers": {'Accept': 'application/vnd.twitchtv.v5+json', "Client-ID": `${TWITCH_CLIENT_ID}`, "Authorization": `OAuth ${authJSON.access_token}`}
			})
			.then( (httpResponse) => {
				if (httpResponse.ok) {
					//console.log("Connect Fetch Succeeded");
					return httpResponse.json();
				} else {
					return Promise.reject("Connect Fetch did not Succeed");
				}
			} )
			.then(async twitchResponseJSON => {
            var url ='https://api.twitch.tv/helix/streams';

            await twitchResponseJSON.users.forEach(e => {
               if (e === twitchResponseJSON.users[0]) {
                  url = url.concat(`?user_id=${e._id}`)
               } else {
                  url = url.concat(`&user_id=${e._id}`)
               }
            })
            
            //clear database
            await clearDatabase(dbID);

            fetch(url, {
               "method": "get",
               "headers": {"Client-ID": `${TWITCH_CLIENT_ID}`, "Authorization": `Bearer ${authJSON.access_token}`}
            })
            .then( (httpResponse) => {
               if (httpResponse.ok) {
                  //console.log("checkLive Fetch Succeeded");
                  //console.log('httpResponse.json(): ', httpResponse.json())
                  return httpResponse.json();
               } else {
                  return Promise.reject("checkLive Fetch did not Succeed");
               }
            } )
            .then(async json => {
               if (json.data.length > 0) {
                  await json.data.forEach(element => {
                     element.thumbnail_url = element.thumbnail_url.replace(/{height}/, '380')
                     element.thumbnail_url = element.thumbnail_url.replace(/{width}/, '622')
                     //img = new Image;
                  });
                  
                  await wixData.bulkInsert(dbID, json.data)
                  .then( (results) => {let item = results})
                  .catch( (err) => {let errorMsg = err});
               } else {
                  let emptyValue = {
                     'user_name': 'No Live TDS Members!',
                     'viewer_count': '0',
                     'title': 'Check the TDS Twitch Team below and follow our members to be notified when they go live!',
                     'thumbnail_url': 'https://static.wixstatic.com/media/ab0623_e2b1a03fba8e4d0b88c90222e240491a~mv2.jpg'
                  }
                  await wixData.insert(dbID, emptyValue)
               }
            })
            .catch(err => console.log("checkLive fetch err: ", err))
			})
			.catch(err => console.log(err))
		})
	.catch(err => console.log(err))
}

async function twitchClientID() {
   let result = await getSecret("twitchAPI_client_id");
   return(result);
}

async function twitchSecret() {
   let result = await getSecret("twitchAPI_secret");
   return(result);
}

export function clearDatabase(databaseName) {
   wixData.aggregate(databaseName).skip(0).limit(500).run()
   .then( (results) => {
      if (results.items.length > 0) {
         results.items.forEach(element => {
            wixData.remove(databaseName, element._id)
            .catch( (err) => {
               console.log(databaseName, " Clear Error: ", err);
            });
         })
      } else {
      return console.log('No Items in ', databaseName, 'Database');
      }
   })
   .catch( (error) => {
      console.log("wixData Aggregate Error: ", error);
   } );
}
