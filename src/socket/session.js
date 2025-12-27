//creating a global session store 

export let activeSession={}

export let startSession=(classId)=>{
    activeSession={
        classId,
        createdAt:new Date().toISOString(),
        attendance:{}
    }
}

export const clearSession=()=>{
    activeSession=null
}