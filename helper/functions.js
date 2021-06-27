import cookie from 'cookie';

export const formatRecordsAddress = (records) => {

    const newRecord = records.map(record=>{
        if(record.model){
            return {
                ...record,
                address: JSON.parse(record.address),
                model: JSON.parse(record.model)
            }
        }
        return {
            ...record,
            address: JSON.parse(record.address)
        }
    })
    return newRecord;
}



export const findStatisticsPerMonth = (records) => {
    const months = [1,2,3,4,5,6,7,8,9,10,11,12];
    const staticsData = [0,0,0,0,0,0,0,0,0,0,0,0]; 
    let i=0;
    for(i; i<records.length; i++){
        for(let x=0; x<months.length; x++){
            if(records[i].created_at == null){
                continue;
            }
            if(new Date(records[i].created_at).getMonth() + 1 == months[x]){
                staticsData[x] = staticsData[x] + 1;
            }
        }
    }

    return staticsData;
}


export const validateAccountsInput = (value, isArabic, isEnglish ,isEmail, isPhone, country, city, isPassword) => {
     let error = "";
    if(isEmail){
       if(!value || value.trim() == "" || !value.includes('@')){
            error = "Invalid email format";
       }else if(!value.match("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+")){
           error = "Invalid email format";
       }
    }else if(isArabic){
        if(!value || value.trim()==""){
            error = "Arabic field can not be ignored or empty!";
        }else if(value.length < 2 || value.length > 30){
            error = "Arabic field must be between 2 characters and 30 characters" ;
        }else if(!value.match("[\u0600-\u06FF]")){
            error = "Arabic field must contain only arabic character"
       }
    }else if(isEnglish){
        if(!value || value.trim()==""){
            error = "English field can not be ignored or empty!";
        }else if(value.length < 2 || value.length > 30){
            error = "English field must be between 2 characters and 30 characters" ;
        }else if(!value.match("[a-zA-Z ]+$")){
             error = "English field must contain only english characters"
        }
    }else if(isPhone){
        if(!value || value.trim()==""){
            error = "Phone can not be ignored or empty!";
        }else if(value.length < 10 || value.length > 13){
            error = "Phone must be between 10 numbers and 13 numbers" ;
        }else if(!value.match("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")){
            error = "Phone must contain only numeric values"
       }
    }else if(country){
        if(!value || value.trim()==""){
            error = "Country can not be ignored or empty!";
        }else if(value.length < 3 || value.length > 25){
            error = "Country must be between 2 characters and 25 characters" ;
        }else if(!value.match("[a-zA-Z ]+$")){
             error = "Country must contain only english characters"
        }
    }else if(city){
        if(!value || value.trim()==""){
            error = "City can not be ignored or empty!";
        }else if(value.length < 3 || value.length > 20){
            error = "City must be between 3 characters and 20 characters" ;
        }else if(!value.match("[a-zA-Z ]+$")){
             error = "City must contain only english characters"
        }
    }else if(isPassword){
        if(!value || value.trim()==""){
            error = "Password can not be ignored or empty!";
        }else if(value.length < 7 || value.length > 20){
            error = "Password must be between 7 characters and 20 characters" ;
        }else if(!value.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?).{7,}$")){
             error = "Password must start with at least one uppercase english character";
        }
    }
    return error.trim();    
}

export const parseCookie = (req) => {
    return cookie.parse((req ? req.headers.cookie || "" : document.cookie));
}


export const addToken = async (adminId, token) => {
    const data = await fetch("http://localhost:8000/api/add-token", {
        method:"PATCH",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            adminId: adminId,
            token: token,
        })
    });
    const response = await data.json();
    return response;
}