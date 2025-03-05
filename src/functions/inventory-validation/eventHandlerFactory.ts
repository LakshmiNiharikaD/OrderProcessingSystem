import { EventHandler } from "src/interface/IEventHandler";
import { InventoryValidationHandler } from "./eventHandlers/inventoryValidation.handler";

export class EventHandlerFactory {
  static getHandler(): EventHandler {
    return new InventoryValidationHandler();
  }
}
