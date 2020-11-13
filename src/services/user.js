import api from "./api";
let user = {
    login:(user,pass)=>{
        return api.login(user,pass)
            .then(res=>{
                console.log(res);
            })
    },
    logout:()=>{

    },
    register:(user,pass)=>{

    }
}