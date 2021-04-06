registerPlugin({
    name: 'Anti Channel Hopping',
    version: '0.1',
    description: 'Automatically kicks users for channelhopping',
    author: '13ace37 <a@github.com>',
    vars: [{
        name: 'count',
        title: 'Max channel switches.',
        type: 'number',
        placeholder: '5'
    },{
        name: 'time',
        title: 'Time in which max switches resets (seconds)',
        type: 'number',
        placeholder: '5'
    },{
        name: 'msg',
        title: 'Kick message',
        type: 'string',
        placeholder: 'Channel Hopping'
    }]
}, (sinusbot, config) =>  {
    
	const event = require('event');
	const backend = require('backend');

	var Clients = {}; // Client object to store channel switches

	event.on("clientMove", (data) => { // get clientMove event

		if (data.client.isSelf()) return; // ignore the bot itself
		if (data.invoker) return; // ignore moves from other clients

		if (!Clients[data.client.uid()]) { // check if local user data alread exists
			Clients[data.client.uid()] = { // create local user data
				count: 0, // set count to int and 0
				clearCount: () => delete Clients[data.client.uid()] // create clear count function
			};
			Clients[data.client.uid()].timeout = setTimeout(Clients[data.client.uid()].clearCount, config.time * 1000 || 5000); // create timeout clear function
			// needs to be created after the intitial creation of the object. otherwise it throws errors due to undefined .clearCount() function.
		} 
		
		Clients[data.client.uid()].count++; // increase channel switch count of the user

		if (Clients[data.client.uid()].count >= (config.count || 5)) { // check if the switch count exceeds the given value
			delete Clients[data.client.uid()]; // delete local user data
			data.client.kickFromServer(config.msg || "Channel Hopping"); // kick the user from the server
		}

	});

});