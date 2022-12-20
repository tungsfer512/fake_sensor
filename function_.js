const bin_Send_Event_status_Auto = (id, status) => {
    return new Promise((resolve, reject) => {
        try {

            const socket = new WebSocket('ws://map-ws-exp.cleverapps.io?id=bin_' + id);
            // Connection opened
            socket.addEventListener('open', function (event) {
                console.log('Connected to WS Server Bin state')
                const sendMessage = () => {
                    //let mess = $('#mess').val();
                    let mess = {
                        id: "bin_" + id,
                        weight: 30,
                        status: status,
                        description: `bin ${status}`
                    }
                    socket.send(JSON.stringify(mess));
                }
                // setInterval(sendMessage,1000*10*60)
                sendMessage()
                resolve(true)
            });
            // Listen for messages
            socket.addEventListener('message', function (event) {
                console.log('Message from server ', event.data);
                $('.chat').append(JSON.parse(event.data));
            });
        } catch (err) {
            reject(err)
        }
    })
}

const vehicle_Send_Event_breakdown_Auto = (id) => {
    const socket = new WebSocket('ws://map-ws-exp.cleverapps.io?id=vehicle_' + id);
    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log('Connected to WS Server Vehicle breakdown')
        const sendMessage = () => {
            //let mess = $('#mess').val();
            let mess = {
                id: "vehicle_break_" + id,
                altitude: 123,
                speed: 123,
                angle: 90,
                fuel: 102,
                trouble: 'car puncture',
                description: 'car puncture',
            }
            socket.send(JSON.stringify(mess));
        }
        // setInterval(sendMessage,1000*5*60)
        sendMessage()
    });
    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        $('.chat').append(JSON.parse(event.data));
    });
}

const gps_Send__Auto = (id, dataTemporary, startTime) => {
    // return new Promise((resolve, reject) => {
        // try {
            dataTemporary = dataTemporary.filter((item, index) => dataTemporary.indexOf(item) === index);
            // const base_url = 'ws://map-ws-exp.cleverapps.io?id=gps_' +id
            const base_url = 'ws://map-ws-exp.cleverapps.io?id=gps_' + id
            // const base_url = 'ws://192.168.1.86:3000/2'
            // const base_url = 'ws://172.20.10.3:3000/2'
            const ws = new WebSocket(base_url)
            let connection_resolvers = [];
            let checkConnection = () => {
                return new Promise((resolve, reject) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        resolve();
                    }
                    else {
                        connection_resolvers.push({ resolve, reject });
                    }
                });
            }
            function updateService() {
                for (let i = 0; i < dataTemporary.length; i++) {
                    setTimeout(function () {
                        const gps = {
                            id: "gps_" + id,
                            lat: dataTemporary[i][0],
                            long: dataTemporary[i][1]
                        }
                        ws.send(JSON.stringify(gps));
                    }, 1000 * i + startTime);
                }
            }
            ws.addEventListener('open', () => {
                console.log('Connected to WS Server GPS')
                connection_resolvers.forEach(r => r.resolve())
                const sendMessage = () => {
                    checkConnection().then(() => {
                        updateService();
                    });
                }
                sendMessage()
                // resolve(1000 * dataTemporary.length)
            });
            // setInterval(sendMessage,1000*5*60)
    //     } catch (err) {
    //         reject(err)
        // }
    // })
}