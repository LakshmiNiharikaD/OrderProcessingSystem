export interface EventHandler {
    handleMessage(event: any): Promise<any>;
}
