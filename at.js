/**
 * @author David V. Lu!! - davidvlu@gmail.com
 */

var buttons = {"start":"GO_TO_START", "left":"PLAY_BACKWARD", "rwnd":"STEP_BACKWARD", "right":"PLAY_FORWARD", "ffwd":"STEP_FORWARD", "pause":"PAUSE", "end": "GO_TO_END"};

/** 
 * @constructor
 */
function AffordanceTemplateInterface(options) {
    options = options || {};
    var ros = options.ros;
    var robot = options.robot || 'r2'
    var that = this;
    
    this.make_buttons();
    
    this.add_template_client = new ROSLIB.Service({
      ros : ros,
      name : '/affordance_template_server/add_template',
      serviceType : 'affordance_template_msgs/AddAffordanceTemplate'
    });
    
    this.get_running_client = new ROSLIB.Service({
      ros : ros,
      name : '/affordance_template_server/get_running',
      serviceType : 'affordance_template_msgs/GetRunningAffordanceTemplates'
    });
    
    this.get_templates_client = new ROSLIB.Service({
       ros : ros,
       name : '/affordance_template_server/get_templates',
       serviceType : 'affordance_template_msgs/GetAffordanceTemplateConfigInfo'
     });    
     
     
    var request = new ROSLIB.ServiceRequest({name : robot});
   
    this.get_templates_client.callService(request, function(result) {
      that.populate_affordances('affordance_list', result.templates);
    });
};

AffordanceTemplateInterface.prototype.make_buttons = function() 
{
    var path = "affordance_template_js/images/"
    
    var s = "";
    for(b in buttons){
        s += "<img src=\"" + path + b + ".png\" width=\"50px\" onclick=\"button('" + buttons[b] + "')\" />\n";

    }
    document.getElementById("controls").innerHTML = s;
}

AffordanceTemplateInterface.prototype.on_check = function(name, value)
{
  if(value){
    var request = new ROSLIB.ServiceRequest({class_type: name});
    add_template_client.callService(request, function(result) {
        update_all();
      
        //setup_ee_box(result.ids, result.end_effectors, result.num_points);
    });
  }
}

AffordanceTemplateInterface.prototype.update_all = function()
{
    var request = new ROSLIB.ServiceRequest({});
    console.log(request);
    get_running_client.callService(request, function(result) {
        console.log(result);
        for(i in result.templates){
            alert( result.templates[i] );
        }
    });
}

AffordanceTemplateInterface.prototype.populate_affordances = function(id, elements)
{
    document.getElementById(id).innerHTML = '';
    for(i in elements){
        var element = elements[i];
        var name = element.type;
        // create the necessary elements
        var label= document.createElement("label");
        var description = document.createTextNode(name);
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = name;          // give it a name we can check on the server side
        checkbox.value = name;         // make its value element
        checkbox.onclick=function() { on_check(this.name, this.checked); };

        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        // add the label element to your div
        document.getElementById(id).appendChild(label);
    }
}
