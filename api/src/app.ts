import 'reflect-metadata';
import {App} from '@deepkit/app';
import {FrameworkModule} from '@deepkit/framework';
import {UserController} from "./controllers/user";
import {database} from "./config/database";
import {Database} from "@deepkit/orm";
import {CORSHTTPListener} from "./middlewares/CORS";
import {RPCSecurity, TokenChecker} from "./middlewares/token";
import {httpMiddleware} from "@deepkit/http";
import {RpcKernelSecurity} from "@deepkit/rpc";
import {AuthController} from "./controllers/auth";
import {InventoryController} from "./controllers/inventory";
import {BlackmarketController} from "./controllers/blackmarket";
import {BankController} from "./controllers/bank";
import {IPScannerController} from "./controllers/ipscanner";
import {ItemController} from "./controllers/item";
import {Config} from "./config/general";
import {WebSocketService} from "./middlewares/websocket";


const app = new App({
    config: Config,
    listeners: [
        RPCSecurity,
        CORSHTTPListener,
        UserController,
        BlackmarketController,
        BankController,
        IPScannerController,
        ItemController,
        WebSocketService
    ],
    providers: [
        {provide: Database, useValue: database},
        {provide: RpcKernelSecurity, useClass: RPCSecurity, scope: 'rpc'},
        TokenChecker,
        RPCSecurity
    ],
    controllers: [
        RPCSecurity,
        AuthController,
        UserController,
        InventoryController,
        BlackmarketController,
        BankController,
        IPScannerController,
        ItemController,
        WebSocketService
    ],
    middlewares: [
        httpMiddleware.for(TokenChecker),
    ],
    imports: [new FrameworkModule({
        migrateOnStartup: true,
        debug: true
    })]
});
app.run();
