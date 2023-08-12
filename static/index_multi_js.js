window.onload = function() {
  var input = document.getElementById("table_schema").focus();
}

let schema_select = document.getElementById('table_schema');
let tablename_select = document.getElementById('table_name');
let columnname_select = document.getElementById('column_name');
let columnnamedelete_select = document.getElementById('column_name_delete');
//let result_select = document.getElementById('result');
let operation_select = document.getElementById('operation');
var count = 0;
var verify_dict = {};
var issue_dict = {}

var option_list = `<option value="character varying(2)">character varying(2)</option>
        <option value="character varying(50)">character varying(50)</option>
        <option value="character varying(500)">character varying(500)</option>
        <option value="character varying(65535)">character varying(65535)</option>
        <option value="numeric(18,5)">numeric(18,5)</option>
        <option value="numeric(38,10)">numeric(38,10)</option>
        <option value="bigint">bigint</option>
        <option value="timestamp without time zone">timestamp without time zone</option>
        <option value="boolean">boolean</option>
        </select>`
//    data_type_select.onchange = function(){
//         data_type_val = data_type_select.value;
//        console.log(data_type_val);
//      };

schema_select.onchange = async function(){
    let ex_flag = 1;
    loader(ex_flag);
    schema = schema_select.value;

    if (schema == ''){
        console.log('No Schema is selected');
        document.getElementById('table-div').style.display = "none";
        document.getElementById('operation-div').style.display = "none";
        document.getElementById('column-block').style.display = "none";
        document.getElementById('new-column-block').style.display = "none";
        document.getElementById('delete-column-block').style.display = "none";
    }
    else{
        let schema_await = await fetch('/'+schema+'/table_name');
        let data = await schema_await.json();
    //    console.log(schema_await);

        console.log('Schema change detected!: '+schema);
        let optionHTML = '';
        for (let tablename of data.tablenames){
            optionHTML += '<option value = "' + tablename.index + '">' + tablename.table_name + '</option>';
        }
        tablename_select.innerHTML = optionHTML;
        console.log('fetching completed table list of the schema: '+ schema);
        let tnames = data.tablenames[0]['table_name'];
        // console.log(tnames);
        document.getElementById('table_name').value = tnames;
//        document.getElementById('Add').style.display = "none";
        document.getElementById('column-block').style.display = "none";
        document.getElementById('delete-column-block').style.display = "none";
    //    document.getElementById('operation-div').style.display = "none";
        columnname_select.innerHTML = '';
        columnnamedelete_select.innerHTML = '';

        operation_select.options[1].setAttribute('selected','selected');
        operation_select.value = 'ADD';
        document.getElementById('operation-div').style.display = "block";
        document.getElementById('new-column-block').style.display = "block";
        document.getElementById('table-div').style.display = "block";
    }
    ex_flag = 0;
    loader(ex_flag);
}

tablename_select.onchange = async function(){
    ex_flag = 0;
    loader(ex_flag);

    schema = schema_select.value;
    tablename = tablename_select.value;
    let tablename_await = await fetch('/'+schema+'/'+tablename+'/column_name');
    let data = await tablename_await.json();
//    alert(schema+'.'+tablename);
    console.log('Table change detected!: ' + tablename);
    let optionHTML_ = '';
    for (let columnname of data.columnnames){
        optionHTML_ += '<option value = "' + columnname.index + '">' + columnname.column_name + '</option>';
    }
    columnname_select.innerHTML = optionHTML_;
    columnnamedelete_select.innerHTML = optionHTML_;
    console.log('fetching completed column list of table: '+ tablename);
//    console.log(data)
    let cnames = data.columnnames[0]['column_name'];
    document.getElementById('column_name').value = cnames;
    document.getElementById('column_name_delete').value = cnames;
    document.getElementById('Add').style.display = "block";
    document.getElementById('column-block').style.display = "block";

    document.getElementById('operation-div').style.display = "block";
    if (operation_select.value!='EDIT'){
        document.getElementById('new-column-block').style.display = "none";
        document.getElementById('delete-column-block').style.display = "none";
    }
    operation_select.options[0].setAttribute('selected','selected');
    operation_select.value = 'EDIT';

    ex_flag = 0;
    loader(ex_flag);
}

operation_select.onchange = async function(){
    let ex_flag = 1;
    loader(ex_flag);
    schema = schema_select.value;
    tablename = tablename_select.value;
    op_choice = operation_select.value;

    if (op_choice == 'EDIT'){
        console.log('Operation: EDIT');
//        if (window.getComputedStyle(document.querySelector('#column-block')).display == "none"){
        if (columnname_select.options.length < 1){
            schema = schema_select.value;
            tablename = tablename_select.value;
            console.log('Fetching Column list of table: ', tablename);
            let tablename_await = await fetch('/'+schema+'/'+tablename+'/column_name');
            let data = await tablename_await.json();
            let optionHTML_ = '';
            for (let columnname of data.columnnames){
                optionHTML_ += '<option value = "' + columnname.index + '">' + columnname.column_name + '</option>';
            }
            columnname_select.innerHTML = optionHTML_;
            columnnamedelete_select.innerHTML = optionHTML_;
            let cnames = data.columnnames[0]['column_name'];
        }


        document.getElementById('column-block').style.display = "block";
        document.getElementById('new-column-block').style.display = "none";
        document.getElementById('delete-column-block').style.display = "none";
        operation_select.options[0].setAttribute('selected','selected');
        operation_select.value = 'EDIT';
    }
    else if (op_choice == 'ADD'){
        console.log('Operation: ADD');
        document.getElementById('column-block').style.display = "none";
        document.getElementById('new-column-block').style.display = "block";
        document.getElementById('delete-column-block').style.display = "none";
        operation_select.options[1].setAttribute('selected','selected');
        operation_select.value = 'ADD';
    }
    else if (op_choice == 'DELETE'){
        console.log('Operation: DELETE');
        if (columnnamedelete_select.options.length < 1){
            schema = schema_select.value;
            tablename = tablename_select.value;
            console.log('Fetching Column list of table: ', tablename);
            let tablename_await = await fetch('/'+schema+'/'+tablename+'/column_name');
            let data = await tablename_await.json();
            let optionHTML_ = '';
            for (let columnname of data.columnnames){
                optionHTML_ += '<option value = "' + columnname.index + '">' + columnname.column_name + '</option>';
            }
            columnname_select.innerHTML = optionHTML_;
            columnnamedelete_select.innerHTML = optionHTML_;
            let cnames = data.columnnames[0]['column_name'];
        }
        document.getElementById('column-block').style.display = "none";
        document.getElementById('new-column-block').style.display = "none";
        document.getElementById('delete-column-block').style.display = "block";
        operation_select.options[2].setAttribute('selected','selected');
        operation_select.value = 'DELETE';
    }
    else{
        alert('Something went wrong! Try again!');
    }
    ex_flag = 0;
    loader(ex_flag);
}


var column_list_select = document.getElementById('column_list');
async function clickcolumns() {
    let ex_flag = 1;
    loader(ex_flag);
    schema = schema_select.value;
    tablename = tablename_select.value;
    columnname = columnname_select.value;
    select_column_id = schema+'_'+tablename+'_'+columnname
    select_column_id = select_column_id.replace(/\//g,'').replace(/ /g, '__').replace(/-/g,'_');
    var selectEle = document.getElementById(select_column_id);
    if(selectEle) {
//        var myEleValue= myEle.value;
        alert('Already added in the operation list!')
    }
    else{
        columnname_selects = document.getElementById('column_name');
        columnname_selects_val = columnname_selects.value;
        schema = schema_select.value;
        tablename = tablename_select.value;
        columnname = columnname_selects_val;

        console.log('/'+schema+'/'+tablename+'/'+encodeURIComponent(columnname).split('%2F').join('%2g'));
        let fetch_columnDtype = await fetch('/'+schema+'/'+tablename+'/'+encodeURIComponent(columnname).split('%2F').join('%2g'));

        var datatype_value = await fetch_columnDtype.text();
        count = count + 1;
        removeemptycolumntable(count);
        let html_select = `
        <select id="`+select_column_id+`_changedtype" name="data_type" onchange="verifychanges(`+select_column_id+`_changedtype)">
        <option value="` + datatype_value + `">` + datatype_value + `</option>
        ` + option_list
    //    console.log(test);
        column_list_select.innerHTML = column_list_select.innerHTML + `
        <td id="`+select_column_id+`_description" colspan="5" style="color:black; font-size:10px;"> Edit Operation will be performed over "<b>`+columnname+`"(`+ datatype_value +`)</b> of "`+ schema+`" . "`+tablename +`"</td>
        <tr id = "`+ select_column_id + `">
          <th scope="row" style="color:orange;">`+`EDIT`+`</th>
          <td>`+schema_select.value+`</td>
          <td>`+tablename+`</td>
          <td>`+`<input id="`+select_column_id+`_edit-column`+`" type="text" placeholder="`+columnname+`" value = "`+columnname+`"  onkeyup="verifynamechanges('`+select_column_id+`_edit-column`+`')">`+`</td>
          <td>`+html_select+`</td>
          <td class="delete-button" id=""`+select_column_id+`_delete_button`+` onclick = delete_select("`+select_column_id+`_delete_button`+`")>`+"❌"+`</td>
        </tr><td colspan=5 id=`+select_column_id+`_issue></td>`;

        let single_column_dict = {};
        single_column_dict["oldcolumnname"] = columnname;
        single_column_dict["schema"] = schema;
        single_column_dict["table"] = tablename;
        single_column_dict["columnname"] = columnname;
        single_column_dict["datatype"] = datatype_value;
        single_column_dict["lastchangedatatype"] = datatype_value;
        single_column_dict["operation"] = 'edit';

        verify_dict[select_column_id] = single_column_dict;
        document.getElementById("return_dict").value = JSON.stringify(verify_dict);
        document.getElementById("return_dict_validate").value = JSON.stringify(verify_dict);

        console.log(verify_dict);
        console.log(select_column_id);
        issue_alert(verify_dict, select_column_id);
    };
    ex_flag = 0;
    loader(ex_flag);
}
var addnewcount = 0;
async function clicknewcolumns(){
    let ex_flag = 1;
    loader(ex_flag);
    addnewcount = addnewcount+1;
    schema = schema_select.value;
    tablename = tablename_select.value;
    select_new_add_id = 'newcolumnplus'+'_'+schema+'_'+tablename + addnewcount;
    select_new_add_id = select_new_add_id.replace(/\//g,'').replace(/ /g, '**').replace(/-/g,'_');
    count = count + 1;
    removeemptycolumntable(count);
    let html_select = `
        <select id="`+select_new_add_id+`_changedtype" name="data_type" onchange="verifychanges(`+select_new_add_id+`_changedtype)">
        ` + option_list

        column_list_select.innerHTML = column_list_select.innerHTML + `
        <td id="`+select_new_add_id+`_description" colspan="5" style="color:black; font-size:10px;"> Add Column Operation will be performed over <b>"`+ schema+`" . "`+tablename +`"</b></td>
        <tr id = "`+ select_new_add_id + `">
          <th scope="row" style="color:green;">`+`ADD`+`</th>
          <td>`+schema_select.value+`</td>
          <td>`+tablename+`</td>
          <td>`+`<input id="`+select_new_add_id+`_plus-column`+`" type="text" onkeyup="verifynamechanges('`+select_new_add_id+`_plus-column`+`')">`+`</td>
          <td>`+html_select+`</td>
          <td class="delete-button" id=""`+select_new_add_id+`_delete_button`+` onclick = delete_select("`+select_new_add_id+`_delete_button`+`")>`+"❌"+`</td>
        </tr> <td colspan=5 id=`+select_new_add_id+`_issue></td>`;

        document.getElementById(select_new_add_id+"_plus-column").focus();

        let single_column_dict = {};
        single_column_dict["oldcolumnname"] = '';
        single_column_dict["schema"] = schema;
        single_column_dict["table"] = tablename;
        single_column_dict["columnname"] = document.getElementById(select_new_add_id+"_plus-column").value;
        single_column_dict["datatype"] = "";
        single_column_dict["lastchangedatatype"] = document.getElementById(select_new_add_id+"_changedtype").value;;;
        single_column_dict["operation"] = 'add';

        verify_dict[select_new_add_id] = single_column_dict;
        document.getElementById("return_dict").value = JSON.stringify(verify_dict);
        document.getElementById("return_dict_validate").value = JSON.stringify(verify_dict);

        issue_alert(verify_dict, select_new_add_id);

//    alert('Already added in the operation list!');
    ex_flag = 0;
    loader(ex_flag);
 }

async function clickdeletecolumns(){
    let ex_flag = 1;
    loader(ex_flag);

    schema = schema_select.value;
    tablename = tablename_select.value;
    columnname = columnnamedelete_select.value;

    select_column_id = schema+'_'+tablename+'_'+columnname;
    select_column_id = select_column_id.replace(/\//g,'').replace(/ /g, '**').replace(/-/g,'_');


    var selectEle = document.getElementById(select_column_id);
    if(selectEle) {
        alert('Already added in the operation list!')
    }
    else{
//        alert("Valid");
        columnname_selects = document.getElementById('column_name_delete');
        columnname_selects_val = columnname_selects.value;
        schema = schema_select.value;
        tablename = tablename_select.value;
        columnname = columnname_selects_val;

        let fetch_columnDtype = await fetch('/'+schema+'/'+tablename+'/'+columnname);
        var datatype_value = await fetch_columnDtype.text();
        count = count + 1;
        removeemptycolumntable(count);
    column_list_select.innerHTML = column_list_select.innerHTML + `
    <td id="`+select_column_id+`_description" colspan="5" style="color:black; font-size:10px;"> Delete Operation will be performed over "<b>`+columnname+`"(`+ datatype_value +`)</b> of "`+ schema+`" . "`+tablename +`"</td>
        <tr id = "`+select_column_id+ `">
          <th scope="row" style="color:red;">`+`DELETE`+`</th>
          <td>`+schema_select.value+`</td>
          <td>`+tablename+`</td>
          <td>`+columnname+`</td>
          <td>`+datatype_value+`</td>
          <td class="delete-button" id=""`+select_column_id+`_delete_button`+` onclick = delete_select("`+select_column_id+`_delete_button`+`")>`+"❌"+`</td>
        </tr> <td colspan=5 id=`+select_column_id+`_issue></td>`;
    let single_column_dict = {};
    single_column_dict["oldcolumnname"] = '';
    single_column_dict["schema"] = schema;
    single_column_dict["table"] = tablename;
    single_column_dict["columnname"] = columnname;
    single_column_dict["datatype"] = datatype_value;
    single_column_dict["lastchangedatatype"] = '';
    single_column_dict["operation"] = 'delete';

    verify_dict[select_column_id] = single_column_dict;
    document.getElementById("return_dict").value = JSON.stringify(verify_dict);
    document.getElementById("return_dict_validate").value = JSON.stringify(verify_dict);

    issue_alert(verify_dict, select_column_id);
    };
    ex_flag = 0;
    loader(ex_flag);
}
async function delete_select(delete_id){
    let ex_flag = 1;
    loader(ex_flag);

    schema = schema_select.value;
    tablename = tablename_select.value;
    columnname = columnname_select.value;
    count = count - 1;
    removeemptycolumntable(count);
    delete_id = delete_id.substring(0, delete_id.length - 14);
    console.log(delete_id + 'Object is Successfully removed: '+ schema +' -> '+ tablename +' -> '+ columnname);
    delete_select_element = document.getElementById(delete_id);
    delete_select_element.remove();

    issue_delete_element = document.getElementById(delete_id+'_issue');
    issue_delete_element.remove();

    description_delete_element = document.getElementById(delete_id+'_description');
    description_delete_element.remove();
    delete verify_dict[delete_id];
    document.getElementById("return_dict").value = JSON.stringify(verify_dict);
    document.getElementById("return_dict_validate").value = JSON.stringify(verify_dict);

    ex_flag = 0;
    loader(ex_flag);
}

async function verifychanges(changedatatype){
    let ex_flag = 1;
    loader(ex_flag);
//    console.log(changedatatype);
    let changedatatype_id_ = changedatatype.id;
//    console.log(changedatatype_id_);
    let changedtype_select_val = changedatatype.value;

    console.log('change detected in Column Data Type!: '+changedtype_select_val);
    changedatatype_id = changedatatype_id_.substring(0, changedatatype_id_.length - 12);
    verify_dict[changedatatype_id]["lastchangedatatype"] = changedtype_select_val;
    document.getElementById(changedatatype_id_).setAttribute("value", changedtype_select_val);

//    setTimeout(() => {}, 1000);
    setSelectedValue(document.getElementById(changedatatype_id_), changedtype_select_val);

    issue_alert(verify_dict, changedatatype_id);
    document.getElementById("return_dict").value = JSON.stringify(verify_dict);
    document.getElementById("return_dict_validate").value = JSON.stringify(verify_dict);

    ex_flag = 0;
    loader(ex_flag);

}

async function verifynamechanges(newname){
    function timer(){
        let ex_flag = 1;
        loader(ex_flag);

        console.log(newname);
        newname_id = newname.substring(0, newname.length - 12);
        let newname_val = document.getElementById(newname).value;
    //    let oldname_val = document.getElementById(newname).value;
        console.log('Column Name change detected: '+ newname_val);
        verify_dict[newname_id]["columnname"] = newname_val;
        console.log('newname_id: '+newname_id);
        document.getElementById(newname).setAttribute("value", newname_val);

        if (verify_dict[newname_id]["operation"] == "edit" && verify_dict[newname_id]["columnname"] == ""){
            placeholder_val = document.getElementById(newname).getAttribute("placeholder");
            console.log(placeholder_val)
            verify_dict[newname_id]["columnname"] = placeholder_val;
            document.getElementById(newname).setAttribute("value", placeholder_val);
        }

        issue_alert(verify_dict, newname_id);
        document.getElementById("return_dict").value = JSON.stringify(verify_dict);
        document.getElementById("return_dict_validate").value = JSON.stringify(verify_dict);

        ex_flag = 0;
        loader(ex_flag);
    } setTimeout(timer,1000);
}

async function setSelectedValue(selectObj, valueToSet) {
    let ex_flag = 1;
    loader(ex_flag);
//    console.log(selectObj.options.length);
//    console.log(valueToSet);
    for (var i = 0; i < selectObj.options.length; i++) {
//        console.log('in loop: '+selectObj.options[i].text);
        if (selectObj.options[i].text== valueToSet) {
            selectObj.options[i].selected = true;
            selectObj.options[i].setAttribute('selected','selected');
            return;
        }
    }
    ex_flag = 0;
    loader(ex_flag);
}

async function removeemptycolumntable(c_count){
    let ex_flag = 1;
    loader(ex_flag);
    if (c_count == 0){
        document.getElementById('column-table').style.display = 'none';
        document.getElementById('perform-operation').style.display = 'none';
        document.getElementById('validate-operation').style.display = 'none';
    }
    else if (c_count > 0){
        document.getElementById('column-table').style.display = 'block';
        document.getElementById('perform-operation').style.display = 'block';
        document.getElementById('validate-operation').style.display = 'block';
    }
    console.log('No changes detected!');

    ex_flag = 0;
    loader(ex_flag);
}

async function issue_alert(v_dict, v_id){
    let ex_flag = 1;
    loader(ex_flag);
//    console.log('/verify_dict/'+encodeURIComponent('{"'+v_id+'":'+JSON.stringify(v_dict[v_id])+'}'));
    let issue_await = await fetch('/verify_dict/'+encodeURIComponent('{"'+v_id+'":'+JSON.stringify(v_dict[v_id])+'}').split('%2F').join('%2g'));
    var data = await issue_await.json();

    issue_dict[v_id] = data[v_id];

//    console.log(data);
    console.log(data[v_id]);
    console.log(v_id+'_issue');
    if (data[v_id]){
//        console.log(document.getElementById(v_id+'_issue').innerHTML);
//        document.getElementById(v_id+'_issue').style.display = 'block';
        document.getElementById(v_id+'_issue').innerHTML = '<tr> <div class="critical-issue" role="alert">'+data[v_id]+'</div></tr>';
    }
    else{
        document.getElementById(v_id+'_issue').innerHTML = '<tr>'+data[v_id]+'</tr>';
//        document.getElementById(v_id+'_issue').style.display = 'none';
    }
    let issue_count = 0;
    for (const [key, value] of Object.entries(issue_dict)) {
        if (value != ''){
            issue_count++;
        }
    }
    if(issue_count == 0){
        document.getElementById('perform-operation').style.display = 'block';
        document.getElementById('validate-operation').style.display = 'block';
    }
    else{
        document.getElementById('perform-operation').style.display = 'none';
        document.getElementById('validate-operation').style.display = 'none';
    }
    ex_flag = 0;
    loader(ex_flag);
}


function result_popup_func(){
    let ex_flag = 1;
    loader(ex_flag);
    document.getElementById('result-popup').style.display = 'none';
    document.getElementById('row').classList.remove("row-post");
    document.getElementById('row').classList.remove("row");
    ex_flag = 0;
    loader(ex_flag);
}


const formVal = document.querySelector('.formVal');

formVal.addEventListener('submit', event => validate_ddl() );

var return_val_text_copy = ''
async function validate_ddl(){
    let ex_flag = 1;
    loader(ex_flag);
    event.preventDefault();

    var formValData = new FormData(formVal);
    const fData = Object.fromEntries(formValData);

    var return_val = await fetch('/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fData)
    });
    var return_val_text = await return_val.text()
    return_val_text_copy = return_val_text;

    console.log(return_val_text);

    document.getElementById('result-popup').style.display = 'block';
    document.getElementById('return_text').innerHTML = return_val_text;
    //document.getElementById('row').classList.remove("row-post");
    document.getElementById('result-popup').classList.add("page-post");
    document.getElementById('result-popup').classList.remove("page-get");;

    document.getElementById('copy-dml').style.display = 'block';
    document.getElementById('dml-copied').style.display = 'none';

    console.log('validated');

    ex_flag = 0;
    loader(ex_flag);
};



function copy_dml(){
var inp =document.createElement('textarea');
document.body.appendChild(inp);
//let return_val_text_copy_ = return_val_text_copy.replace(/<br\s*[\/]?>/gi, "\r\n");
inp.value = document.getElementById('return_text').innerText.replace("Edit Datatype Operation:", "--Edit Datatype Operation:")
            .replace("Rename Column Name Operation:", "--Rename Column Name Operation:")
            .replace("Rename Column Name and Edit Datatype Operation:", "--Rename Column Name and Edit Datatype Operation:")
            .replace("Add New Column Operation:","--Add New Column Operation:")
            .replace("Delete Column Operation:", "--Delete Column Operation:");

inp.select();
document.execCommand('copy',false);
inp.remove();
document.getElementById('copy-dml').style.display = 'none';
document.getElementById('dml-copied').style.display = 'block';

setTimeout(function() {
document.getElementById('copy-dml').style.display = 'block';
document.getElementById('dml-copied').style.display = 'none';

}, 2000);
}

async function loader(v_ex_flag){
    if (v_ex_flag == 1){
        document.getElementById('loader').style.display = 'block';
        document.getElementById("container").style.pointerEvents = "none";
        document.getElementById("container").style.opacity = "0.5";
    }
    else{
        document.getElementById('loader').style.display = 'none';
        document.getElementById("container").style.pointerEvents = "";
        document.getElementById("container").style.opacity = "1";
    }
}
