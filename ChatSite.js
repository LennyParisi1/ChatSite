Messages = new Mongo.Collection("messages");
var name="guest";
var rawDate, refinedDate;

if (Meteor.isClient) {
    name = prompt("Username","Enter a Username");
    Meteor.subscribe("messages");
    Template.body.helpers({
        messages:function(){
            return Messages.find();    
        }
    });
    
    Template.message.helpers({
        message:function(){
            return this.message;    
        },
        date:function(){
            return this.date;    
        },
        name:function(){
            return this.name;    
        }
    });
    Template.sendMessage.events({
        "submit form":function(){
            event.preventDefault();
            message = event.target.message.value;
            document.getElementById('message').value = "";
            rawDate = new Date();
            refinedDate = moment(rawDate).format("MM/DD");
            Meteor.call("insertData",refinedDate,name,message);
            var objDiv = document.getElementById("msgsDiv");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    });
    
    Template.message.events({
        "click #remove":function(){
            Meteor.call("removeData",this._id);   
        }
    });
}

if (Meteor.isServer) {
    Meteor.publish("messages", function(){
        return Messages.find();    
    });
    
    Meteor.methods({
        "insertData":function(date, name, message){
            console.log("inserting");
            Messages.insert({
                date: date,
                name: name,
                message: message
            });    
        },
        "removeData":function(id){
            console.log("deleting");
            Messages.remove(id); 
        }
    });
}
