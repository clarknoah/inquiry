import GraphNode from "../GraphNode";
import api from "../../services/api";


class User extends GraphNode{
    constructor(data, id=undefined, properties=undefined){
        super(data, id, properties);
        this.defaultQueryKey = "email";
        if(id!==undefined){
            this.login();
        }
    }

    login= user => {
         let jsonData = {};
        Object.keys(this.properties).forEach(key => {
          let value = this.properties[key].value;
          localStorage.setItem(`activeUser_${key}`, value);
          jsonData[key] = value;
        });
        localStorage.setItem("activeUser_id", this.id);
        localStorage.setItem("activeUser_json", JSON.stringify(jsonData));

      }
    logout= () => {
        Object.keys(this.properties).forEach(key => {
            let value = this.properties[key].value;
            localStorage.removeItem(`activeUser_${key}`);
          });
          localStorage.removeItem("activeUser_id");
      }
    


}

export default User