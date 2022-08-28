import api from "./api";
import InquiryModel from "../models/GraphModel";
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

    },
    getUser:()=>{
        if(localStorage.activeUser_json!=null){
            let props = JSON.parse(localStorage.activeUser_json);
            let activeUser = InquiryModel.getExistingModelClass("User",parseInt(localStorage.activeUser_id), props);
            return activeUser;
        }else{
            return false;
        }
    }
} 

export default user;