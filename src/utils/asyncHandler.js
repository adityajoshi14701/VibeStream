const asyncHandler=(requestHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err));
    }
}

export {asyncHandler}

/*
this is one of the way to make a wrapper function fo rvarious other functionality

const asyncHandler =()={}
passing a fun which have another call back in it 
const asyncHandler =(fun)=>{()=>{}} ---> const asyncHandler =(fun)=>()=>{}

    const asyncHandler =(fun)=>(req,res,next)=>{
        try{
                await fun(req,res,next)
        }
        catch(err){
             res.send(err.code || 500).sjon({
             success:false,
             message:err.message
             });

            }
        }
*/