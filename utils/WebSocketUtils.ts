
export const createConnection = (url:string) => {
    const wsConn =  new WebSocket(url);
    if(!wsConn){
        console.log("error al crear conexion...")
        return
    }
    console.log("Conexion creada: ",wsConn)
return wsConn
}