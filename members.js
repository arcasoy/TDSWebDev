import wixLocation from 'wix-location';

let possibleSocials = [
	{"name":"Twitch", "icon":"https://static.wixstatic.com/media/ab0623_50d56d1bc2b2415fbdb3376aba075cb5~mv2.png"},
 	{"name":"Twitter", "icon":"https://static.wixstatic.com/media/ab0623_e9ccf89d1d6343f5a8d3dba0d0b31e60~mv2.png"}, 
	{"name":"YouTube", "icon":"https://static.wixstatic.com/media/ab0623_088454cf92374dd4986e05313f005c6e~mv2.png"},
	{"name":"Instagram", "icon":"https://static.wixstatic.com/media/ab0623_8b7c406f6abf42d4bfabc4fa3aa3ea48~mv2.png"}
 ];

let socialColumns = [{
	"id": "socialColumn",
	"dataPath": "soc_column",
	"label": "Social Column",
	"width": 100,
	"visible": true,
	"type": "image"
}];

$w.onReady(function () {
	$w("#table1").columns = socialColumns;
	$w("#dynamicDataset").onReady( () => {
		$w("#repeater1").onItemReady( ($item, itemData, index) => {
			let itemTableRowImg = [];
			let itemTableRowLink = [];
			possibleSocials.forEach( (social) => {
				if (eval(`itemData.link${social.name}`) !== undefined) { //this is the error
					//for table squares
					itemTableRowImg.push({"soc_column": social.icon})
					itemTableRowLink.push({"link": eval(`itemData.link${social.name}`)})
				}
			})

			//if there are no socials listed, don't show the table
			if (itemTableRowImg.length === 0) {
				$item("#table1").collapse();
				$item("#table1").hide();
			} else { //otherwise, continue to show the table
				$item("#table1").rows = itemTableRowImg; //not printing out since the link value is trying to fit into a column. Need to do a onCellSelect function or something
				$item("#table1").onCellSelect( (event) => {
					console.log(event.cellRowIndex);
					wixLocation.to(itemTableRowLink[event.cellRowIndex].link);
				})
			}

			if(itemData.description === undefined) {
				$item("#text12").text = `Learn more about ${itemData.ign} by following them!`;
			}
		});
	});
});
