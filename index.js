//extra functions
function sameLine(value){
    clearLine();
    consoleLog(value);
}
function clearLine(){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
}
function consoleLog(value){
    process.stdout.write(value);
}

//load modules & variables
consoleLog('Loading modules... [1/3]');
const term = require('terminal-kit').terminal;
sameLine('Loading modules... [2/3]');
const fs = require('fs');
sameLine('Loading modules... [3/3]');
const {MongoClient} = require('mongodb');

// REPLACE WITH GIVEN INFO ON MONGO WEBSITE
const password = "PASSWORD"; 
const mongoURI = "URI";

const client = new MongoClient(mongoURI, {useNewUrlParser:true, useUnifiedTopology:true});
clearLine();
//start screen
consoleLog('\x1B[36mWelcome to Mongo Database. [E] SELECT, [ENTER] SUBMIT, [CTRL+C] QUIT.\x1B[00m\n');
consoleLog('>SIGN UP  LOG IN ');
var mode = 0, startmenu = true;
term.grabInput(true);
term.on('key', (name, matches, data) => {
    if(startmenu){
        if(name==='e'){
            if(mode==1){mode=0;sameLine('>SIGN UP  LOG IN ');}
            else{mode=1;sameLine(' SIGN UP >LOG IN ');}
        }
        if(name==='ENTER'){
            clearLine();
            consoleLog('\x1B[1A');
            clearLine();
            term.grabInput(false);
            startmenu = false;
            if(mode==0){createAccount()}
            else{loginAccount()};
        }
        if(name==='CTRL_C'){
            console.log('\nQuit Mongo Database.');
            process.exit();
        }
    }
});
//account handling screens
async function createAccount() {
    consoleLog('Please enter a username: ');
    term.grabInput(true);
    var namemenu=true, passmenu=false, nickmenu=false, cursorposition=25, username=[], userpass=[], nickname=[];
    term.on('key', (name, matches, data) => {
        if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".includes(name)){
            if(namemenu){
                username.push(name);
                consoleLog(name);
            }
            if(passmenu){
                userpass.push(name);
                consoleLog('*');
            }
            if(nickmenu){
                nickname.push(name);
                consoleLog(name);
            }
            if(namemenu || passmenu || nickmenu){
                cursorposition++;
            }
        }
        if("ENTER"===name){
            if(nickmenu){
                nickname = nickname.join('');
                clearLine();
                consoleLog('\x1B[1A');
                clearLine();
                consoleLog('\x1B[1A');
                clearLine();
                nickmenu = false;
                term.grabInput(false);
                sendAccountInfo(username, userpass, nickname);
            }
            if(passmenu){
                userpass = userpass.join('');
                consoleLog('\nPlease enter a nickname: ');
                process.stdout.cursorTo(25);
                cursorposition = 25;
                passmenu = false, nickmenu = true;
            }
            if(namemenu){
                username = username.join('');
                consoleLog('\nPlease enter a password: ');
                process.stdout.cursorTo(25);
                cursorposition = 25;
                namemenu = false, passmenu = true;
            }
        }
        if("BACKSPACE"===name){
            if(cursorposition>25){
                if(namemenu || passmenu || nickmenu){
                    cursorposition--;
                    consoleLog('\x1B[1D');
                    process.stdout.clearLine(1);
                }
                if(namemenu){
                    username.pop();
                }
                if(passmenu){
                    userpass.pop();
                }
                if(nickmenu){
                    nickname.pop();
                }
            }
        }
        if("CTRL_C"===name){
            console.log('\nQuit Mongo Database.');
            process.exit();
        }
    });
    async function sendAccountInfo(username, userpass){
        await client.connect(async (err) => {
            const collection = client.db('nodedatabase').collection("nodecollection");
            clearLine();
            await collection.insertMany([{
                type: 'user',
                username: username,
                password: userpass,
                nickname: nickname
            }])
            client.close();
        });
        console.log(`Account "${nickname}" created, started Mongo CLI.\n\x1B[31mAll information in this database is stored using a third-party company, store sensitive data at your own risk.\x1B[00m`);
        startNode(nickname);
    }
}
function loginAccount(retry){
    consoleLog('Please enter your username: ');
    term.grabInput(true);
    var namemenu=true, passmenu=false, cursorposition=28, maxcursor=28, username=[], userpass=[];
    term.on('key', async (name, matches, data) => {
        if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".includes(name)){
            if(namemenu){
                username.push(name);
                consoleLog(name);
            }
            if(passmenu){
                userpass.push(name);
                consoleLog('*');
            }
            if(namemenu || passmenu){
                cursorposition++;
            }
        }
        if("ENTER"===name){
            if(passmenu){
                clearLine();
                consoleLog('\x1B[1A');
                clearLine();
                if(retry){
                    consoleLog('\x1B[1A');
                    clearLine();
                }
                userpass = userpass.join('');
                passmenu = false,
                term.grabInput(false);
                await verfyAccountInfo(username, userpass);
            }
            if(namemenu){
                username = username.join('');
                consoleLog('\nPlease enter a password: ');
                process.stdout.cursorTo(25);
                namemenu = false, passmenu = true, maxcursor = 25, cursorposition = 25;;
            }
        }
        if("BACKSPACE"===name){
            if(cursorposition>maxcursor){
                if(namemenu || passmenu){
                    cursorposition--;
                    consoleLog('\x1B[1D');
                    process.stdout.clearLine(1);
                }
                if(namemenu){
                    username.pop();
                }
                if(passmenu){
                    userpass.pop();
                }
            }
        }
        if("CTRL_C"===name){
            console.log("\nQuit Mongo Database.")
            process.exit();
        }
    });
    async function verfyAccountInfo(username, userpass){
        await client.connect(async (err) => {
            const collection = client.db('nodedatabase').collection("nodecollection");
            let verified = false;
            let result = await collection.find({username:username}).toArray();
            result = result[0];
            if(result==undefined){result={password:'|'}};
            if(result.password==userpass){verified=true};
            if(verified){
                console.log(`Logged into "${result.nickname}", entered Mongo Database.\n\x1B[31mAll information in this database is stored using a third-party company, store sensitive data at your own risk.\x1B[00m`);
                startNode(result.nickname);
            }else{
                console.log('\x1B[31mInvalid user details.\x1B[0m');
                loginAccount(true);
            }
            client.close();
        });
    }
}
function startNode(nickname){
    consoleLog('\x1B[36mEnter a command.. Type ? for a list of commands. Use Ctrl+C to quit.\x1B[00m \n');
    function commandLoop(){
        consoleLog(`\n${nickname}: `);
        term.inputField({cancelable:false}, function (error, input) {
            inputArray = input.split(' ');
            consoleLog('\n');
            if(!['?', 'log', 'remove', 'removeall', 'read'].includes(inputArray[0])){
                consoleLog('Please enter a valid command. Use ? to get a list of commands.')
                commandLoop();
            ;}
            if(inputArray[0]=='?'){
                consoleLog([
                    '\n\x1B[36m-- Commands List --',
                    '?                   Displays a list of commands',
                    'log [tag] [data]    Logs data into the database with specified info and tag.',
                    'remove [tag]        Removes first item added with specified tag from database.',
                    'removeall [tag]     Removes all items added to database with specified tag.',
                    'read [tag]          Lists all items with specified tag.\x1B[00m\n',
                ].join('\n'))
                commandLoop();
            }
            if(inputArray[0]=='log'){
                if(!inputArray[1]||!inputArray[2]){
                    consoleLog('Please enter valid arguments - log [tag] [data]')
                }else{
                    databaseWrite({
                        tag:inputArray[1],
                        data:inputArray[2]
                    });
                    consoleLog(`\x1B[36mLogged item with tag '${inputArray[1]}'.\x1B[00m`)
                }
                commandLoop();
            }
            if(inputArray[0]=='remove'){
                if(!inputArray[1]){
                    consoleLog('Please enter a valid arugment - remove [tag]');
                }else{
                    databaseRemove(inputArray[1], false);
                    consoleLog(`\x1B[36mRemoved 1 item with tag '${inputArray[1]}'.\x1B[00m`);
                }
                commandLoop();
            }
            if(inputArray[0]=='removeall'){
                if(!inputArray[1]){
                    consoleLog('Please enter a valid arugment - removeall [tag]');
                }else{
                    databaseRemove(inputArray[1], true);
                    consoleLog(`\x1B[36mRemoved all items with tag '${inputArray[1]}'.\x1B[00m`);
                }
                commandLoop();
            }
            if(inputArray[0]=='read'){
                if(!inputArray[1]){
                    consoleLog('Please enter a valid argument - read [tag]');
                    commandLoop();
                }else{
                    async function databaseList(tag){
                        await client.connect(async (err) => {
                            matches = await client.db('nodedatabase').collection("nodecollection").find({tag:tag}).toArray();
                            dataArray = [];
                            matches.forEach((item, i, array) => {
                                dataArray.push(item.data);
                            });
                            consoleLog(`\x1B[36m(${dataArray.length}) Matches have been found: ${dataArray.join(', ')}.\x1B[00m`);
                            client.close();
                            commandLoop();
                        });
                    }
                    databaseList(inputArray[1]);
                }
            }
        })
    }
    async function databaseWrite(object){
        await client.connect(async (err) => {
            await client.db('nodedatabase').collection("nodecollection").insertMany([object]);
            client.close();
        });
    }
    async function databaseRemove(tag, all){
        await client.connect(async (err) => {
            if(all){
                await client.db('nodedatabase').collection("nodecollection").deleteMany({tag:tag});
            }else{
                results = await client.db('nodedatabase').collection("nodecollection").find({tag:tag}).toArray();
                await client.db('nodedatabase').collection("nodecollection").deleteMany({_id:results[0]._id});
            }
            client.close();
        });
    }
    setTimeout(commandLoop, 200);
}
