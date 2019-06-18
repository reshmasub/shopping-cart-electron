const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//Set production environment
process.env.NODE_ENV = 'production';
let mainWindow;
let addWindow;

app.on('ready',function(){
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
        nodeIntegration: true
    }});

    //Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });
    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});
//Handle create add window

//Create Menu template
function createAddWindow(){
     //create new window
     addWindow = new BrowserWindow({
         width: 300,
         height: 200,
         title: 'Add Shopping List Item',
         webPreferences: {
            nodeIntegration: true
        }
     });

     //Load html into window
     addWindow.loadURL(url.format({
         pathname: path.join(__dirname,'addWindow.html'),
         protocol: 'file:',
         slashes: true
     }));
     //GC collection
     addWindow.on('close', function(){
         addWindow = null;
     })
}
//Catch item:add
ipcMain.on('item:add',function(e, item){
    console.log(item)
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
})
//Create Menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [{
            label: 'Add Item',
            click(){
                createAddWindow();
            }
        },
    {
        label: 'Clear Items',
        click(){
            mainWindow.webContents.send('item:clear')
        }
    },{
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
        click(){
            app.quit();
        }
    }]
    }
];

//Add dev tools
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
                click(item, focussedWindow){
                    focussedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}