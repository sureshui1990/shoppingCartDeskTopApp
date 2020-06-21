
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow, addWindow;
process.env.NODE_ENV  = 'production';

// Custom Menu creation
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {
                label:'Add Item',
                click(){
                    createAddItemWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    
];

// Space for main menu if device mac
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({label:''});
}

// DevTools enable for development
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tool',
        submenu: [
            {
                label: 'Toggle devTools',
                accelerator: process.platform == 'darwin' ?  'Command+I':'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools(); 
                }
            },
            {
                role  : 'reload'
            }
        ]
    });
}

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

// Mainwindowcreation
const createMainWindow = () => {
    mainWindow =  new BrowserWindow( {
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL( url.format({
        pathname: path.join( __dirname, '/views/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function(){
        app.quit();
    });
    Menu.setApplicationMenu(mainMenu);
}

// Add Item Window creation
const createAddItemWindow = () => {
    addWindow =  new BrowserWindow( {
        width:300,height:200,title:'New Item to be add',
        webPreferences: {
            nodeIntegration: true
        }
    });
    addWindow.loadURL( url.format({
        pathname: path.join( __dirname, '/views/addNewWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage collect process
    addWindow.on('closed', function(){
        addWindow = null;
    })
}

ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add',item);
    console.log('ipcMain / item', item);
    addWindow.close();
})


// App listen
app.on('ready', createMainWindow);


