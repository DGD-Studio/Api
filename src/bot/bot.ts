import { ManagerClient } from "./lib/ManagerClient";

export function startBot(){
    return new ManagerClient().start()
}