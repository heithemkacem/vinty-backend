const server = require('./server')

const port= process.env.PORT || 5000

const startServer=  ()=>{
    server.listen(port,()=>{
        console.log(`server running on port ${port}`)
    })
}
startServer()