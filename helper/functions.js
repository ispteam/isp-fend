import cookie from 'cookie';
import ENDPOINT from 'helper/ENDPOINT';

export const formatRecordsAddress = (records) => {

    const newRecord = records.map(record=>{
        if(record.model){
            return {
                ...record,
                address: JSON.parse(record.address),
                model: JSON.parse(record.model),
                year: record.year? JSON.parse(record.year) : null,
                amounts: record.amounts != null ? JSON.parse(record.amounts) : null
            }
        }
        return {
            ...record,
            address: record.address ? JSON.parse(record.address) : null
        }
    })
    return newRecord;
}

export const formatSingleAddress = (record) => {
    if(record.model){
        return {
            ...record,
            address: JSON.parse(record.address),
            model: JSON.parse(record.model),
            year: record.year? JSON.parse(record.year) : null,
            amounts: record.amounts != null ? JSON.parse(record.amounts) : null
        }
    }
    return {
        ...record,
        address: record.address ? JSON.parse(record.address) : null
    }
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


export const validateAccountsInput = (value, isArabic, isEnglish ,isEmail, isPhone, country, city, isPassword, isMix, isYear, isImage, isNumber, isShipper, isTracking, field, carsPref, enteryId) => {
     let error = "";
    if(isEmail){
       if(!value || value.trim() == "" || !value.includes('@')){
            error = "Email can not be ignored or empty!";
       }else if(!value.match("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+")){
           error = "Invalid email format";
       }
    }else if(isArabic){
        if(!value || value.trim()==""){
            error = "Arabic field can not be ignored or empty!";
        }else if(value.length < 2 || value.length > 70){
            error = "Arabic field must be between 2 characters and 70 characters" ;
        }else if(!value.match("[\u0600-\u06FF]")){
            error = "Arabic field must contain only arabic character"
       }
    }else if(isEnglish){
        if(!value || value.trim()==""){
            error = "English field can not be ignored or empty!";
        }else if(value.length < 2 || value.length > 60){
            error = "English field must be between 2 characters and 60 characters" ;
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
        }else if(!value.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[0-9])(?=.*?).{7,}$")){
             error = "Password must contains uppercase, lowercase and numbers";
        }
    }else if(isMix){
        if(!value || value.trim()==""){
            error = "Model Name/PartNo/Description can not be ignored or empty!";
        }else if(value.length < 2 || value.length > 20){
            error = "Model NamePartNo/Description must be between 3 characters and 20 characters" ;
        }else if(!value.match("[A-Za-z0-9]+$")){
             error = "Model NamePartNo/Description must contain only english characters and numbers"
        }
    }else if(isYear){
        if(!value || value.trim()==""){
            error = "Year can not be ignored or empty!";
        }else if(value.length < 4 || value.length > 4){
            error = "Year length is four characters" ;
        }else if(!value.match("[0-9]+$")){
             error = "Year must contain only numeric characters"
        }
    }else if(isImage){
      if(value == null){
          error = "Certificate can not be ignored or empty!"
      }
    }else if(isNumber){
        if(!value || value.trim()==""){
            error = "Number field can not be ignored or empty!";
        }else if(value <= 0){
             error = "Number must be greater than zero"
        }else if(!value.match("[0-9]+$")){
             error = "Number must contain only numeric characters"
        }
    }else if(isShipper){
        if(!value || value.trim()==""){
            error = "Shipper name can not be ignored or empty!";
        }else if(value.length <= 2 || value.length > 15){
            error = "Shipper must be between 3 characters and 15 characters" ;
        }else if(!value.match("[a-zA-Z ]+$")){
             error = "Shhipper must contain only english characters"
        }
    }else if(isTracking){
        if(!value || value.trim()==""){
            error = "Tracking Number can not be ignored or empty!";
        }else if(value.length < 10 || value.length > 12){
            error = "Tracking Number length is between 10 and 12 characters" ;
        }else if(!value.match("[0-9]+$")){
             error = "Tracking Number must contain only numeric characters"
        }
    }else if(field){
        if(!value || value.trim()==""){
            error = "Field can not be ignored or empty!";
        }
    }else if(carsPref){
        if(!value || value <= 1){
            error = "Cars pref can not be ignored or empty!";
        }
    }else if(enteryId){
        if(!value || value.trim() == ""){
            error = "Entery Id can not be ignored or empty!";
        }else if(value.length < 9 || value.length > 9){
            error = "Entery Id can should be 9 characters"
        }else if(!value.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[0-9])(?=.*).{9,9}$")){
            error = "Entery Id must contains upper case, lower case, symbol and numeric characters";
        }
    }
    return error.trim();    
}

export const validateAccountsInputArabic = (value, isArabic, isEnglish ,isEmail, isPhone, country, city, isPassword, isMix, isYear, isImage, isNumber, isShipper, isTracking, field, carsPref) => {
    let error = "";
   if(isEmail){
      if(!value || value.trim() == "" || !value.includes('@')){
           error = "البريد الالكتروني ضروري";
      }else if(!value.match("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+")){
          error = "صيغة الايميل غير صحيحة";
      }
   }else if(isArabic){
       if(!value || value.trim()==""){
           error = "الخانات العربية ضرورية";
       }else if(value.length < 2 || value.length > 70){
           error = "الخانات العربية بين كلمتين الى 70 كلمة" ;
       }else if(!value.match("[\u0600-\u06FF]")){
           error = "الخانات العربية يجب ان تحتوي على حروف عربية"
      }
   }else if(isEnglish){
       if(!value || value.trim()==""){
           error = "الخانات الانجليزية ضرورية";
       }else if(value.length < 2 || value.length > 60){
           error = "الخانات الانجليزية بين كلمتين الى 60 كلمة" ;
       }else if(!value.match("[a-zA-Z ]+$")){
            error = "الخانات الانجليزية يجب ان تحتوي على حروف عربية"
       }
   }else if(isPhone){
       if(!value || value.trim()==""){
           error = "رقم الجوال ضروري";
       }else if(value.length < 10 || value.length > 13){
           error = "رقم الجوال بين 10 الى 13 خانة" ;
       }else if(!value.match("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")){
           error = "رقم الهاتف يجب ان يحتوي على ارقام فقط"
      }
   }else if(country){
       if(!value || value.trim()==""){
           error = "خانة الدولة ضرورية";
       }else if(value.length < 3 || value.length > 25){
           error = "خانة الدولة بين 3 كلمات الى 25 كلمة" ;
       }else if(!value.match("[\u0600-\u06FF]")){
            error = "خانة الدولة يجب ان تحتوي على حروف عربية فقط"
       }
   }else if(city){
       if(!value || value.trim()==""){
           error = "خانة المدينة ضرورية";
       }else if(value.length < 3 || value.length > 20){
           error = "خانة المدينة بين 3 كلمات الى 25 كلمة" ;
       }else if(!value.match("[\u0600-\u06FF]")){
            error = "خانة المدينة يجب ان تحتوي على حروف عربية فقط"
       }
   }else if(isPassword){
       if(!value || value.trim()==""){
           error = "خانة الرقم السري ضرورية";
       }else if(value.length < 7 || value.length > 20){
           error = "خانة الرقم السري بين 7 كلمات الى 20 كلمة" ;
       }else if(!value.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[0-9])(?=.*?).{7,}$")){
            error = "خانة الرقم السري يجب ان تبدأ بحرف كبير على الاقل";
       }
   }else if(isMix){
       if(!value || value.trim()==""){
           error = "الموديل/القطعة/الوصف ضروري";
       }else if(value.length < 2 || value.length > 20){
           error = "الموديل/القطعة/الوصف بين 3 كلمات الى 20 كلمة" ;
       }else if(!value.match("[A-Za-z0-9\u0600-\u06FF]+$")){
            error = "الموديل/القطعة/الوصف يجب ان تحتوي على حروف وارقام فقط"
       }
   }else if(isYear){
       if(!value || value.trim()==""){
           error = "خانة السنة ضرورية";
       }else if(value.length < 4 || value.length > 4){
           error = "خانة السنة 4 ارقام فقط" ;
       }else if(!value.match("[0-9]+$")){
            error = "خانة السنة يجيب ان تحتوي على ارقام فقط"
       }
   }else if(isImage){
        if(value == null){
            error = "الشهادة ضرورية"
        }
    }else if(isNumber){
        if(!value || value.trim()==""){
            error = "خانة الرقم ضرورية";
        }else if(value <= 0){
             error = "خانة الرقم يجب ان تكون اكبر من صفر"
        }else if(!value.match("[0-9]+$")){
             error = "خانة الرقم يجب ان تحتوي على ارقام فقط"
        }
    }else if(isShipper){
        if(!value || value.trim()==""){
            error = "شركة الشحن ضرورية";
        }else if(value.length <= 2 || value.length > 15){
            error = "شركة الشحن يجب ان تكون من 3 الى 15 حرف" ;
        }else if(!value.match("[a-zA-Z ]+$")){
             error = "شركة الشحن يجب ان يكون احرف انجليزية"
        }
    }else if(isTracking){
        if(!value || value.trim()==""){
            error = "رقم التتبع ضروري";
        }else if(value.length < 10 || value.length > 12){
            error = "رقم التتبع يجب ان يكون بين 10 الى 12 رقم" ;
        }else if(!value.match("[0-9]+$")){
             error = "رقم التتبع يجب ان تحتوي على ارقام فقط"
        }
    }else if(field){
        if(!value || value.trim()==""){
            error = "مجال العمل ضروري";
        }
    }else if(carsPref){
        if(!value || value <= 0){
            error = "تفضيلات السيارات ضرورية";
        }
    }
   return error.trim();    
}

export const parseCookie = (req) => {
    return cookie.parse((req ? req.headers.cookie || "" : document.cookie));
}



export const addToken = async (uid, token) => {
    const data = await fetch(`${ENDPOINT}/add-token`, {
        method:"PATCH",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            uid: uid,
            token: token,
        })
    });
    const response = await data.json();
    return response;
}


export const validateCreditCard = (value, isName, isNumber, isYear, isMonth, isCVC) => {
    let error = '';
    if(isName){
        if(!value || value.trim()==""){
            error = "Name field can not be ignored or empty!";
        }else if(value.length < 7){
            error = "Name field must be More than 7 characters" ;
        }else if(!value.match("[a-zA-Z ]+$")){
             error = "Name field must contain only english characters"
        }
    }else if(isNumber){
        if(!value || value.trim()==""){
            error = "Credit card field can not be ignored or empty!";
        }else if(value.length < 16 || value.length > 16){
            error = "Credit card field must be 16 characters" ;
        }else if(!value.match("[0-9]+$")){
            error = "Credit card must contain only numbers"
        }
    }else if(isYear){
        if(!value || value.trim()==""){
            error = "Year can not be ignored or empty!";
        }else if(value.length < 2 || value.length > 2){
            error = "Year length is two characters" ;
        }else if(!value.match("[0-9]+$")){
            error = "Credit card must contain only numbers"
        }
    }else if(isMonth){
        if(!value || value.trim()==""){
            error = "Month can not be ignored or empty!";
        }else if(value.length < 2 || value.length > 2){
            error = "Month length is two characters" ;
        }else if(!value.match("[0-9]+$")){
             error = "Month must contain only numeric characters"
        }
    }else if(isCVC){
        if(!value || value.trim()==""){
            error = "CVC can not be ignored or empty!";
        }else if(value.length < 3 || value.length > 3){
            error = "CVC length is three characters" ;
        }else if(!value.match("[0-9]+$")){
            error = "CVC contain only numbers"
        }
    }
    return error.trim();
}


export const validateCreditCardArabic = (value, isName, isNumber, isYear, isMonth, isCVC) => {
    let error = '';
    if(isName){
        if(!value || value.trim()==""){
            error = "الاسم ضروري";
        }else if(value.length < 7){
            error = "خانة الاسم يجب ان تكون اكثر من 7 حروف" ;
        }else if(!value.match("[a-zA-Z ]+$")){
             error = "خانة الاسم يجب ان تحتوي على حروف انجليزية فقط"
        }
    }else if(isNumber){
        if(!value || value.trim()==""){
            error = "رقم البطاقة ضروري";
        }else if(value.length < 16 || value.length > 16){
            error = "رقم البطاقة يجب ان يتكون من 16 رقم" ;
        }else if(!value.match("[0-9]+$")){
            error = "رقم البطاقة يجب ان يحتوي على ارقام فقط"
        }
    }else if(isYear){
        if(!value || value.trim()==""){
            error = "سنة الانتهاء ضرورية";
        }else if(value.length < 2 || value.length > 2){
            error = "خانة السنة يجب ان يتكون من رقمين" ;
        }else if(!value.match("[0-9]+$")){
             error = "خانة السنة يجب ان تحتوي على ارقام فقط"
        }
    }else if(isMonth){
        if(!value || value.trim()==""){
           error = "شهر الانتهاء ضرورية";
        }else if(value.length < 2 || value.length > 2){
            error = "خانة الشهر يجب ان يتكون من رقمين" ;
        }else if(!value.match("[0-9]+$")){
             error = "خانة الشهر يجب ان تحتوي على ارقام فقط"
        }
    }else if(isCVC){
        if(!value || value.trim()==""){
            error = "رقم الامان ضروري";
        }else if(value.length < 3 || value.length > 3){
            error = "رقم الامان يجب ان يتكون من 3 خانات" ;
        }else if(!value.match("[0-9]+$")){
             error = "رمز الامان يجب ان يحتوي على ارقام فقط"
        }
    }
    return error.trim();
}


export const sendEmail = async (recepient, method, user, arabic, rememberToken, requestNum, shipperName, trackingNumber, reason) => {
    await fetch("/api/send-email", {
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          recepient,
          method,
          user,
          arabic: arabic ? arabic : false,
          rememberToken: rememberToken? rememberToken : null,
          requestNum: requestNum ? requestNum : null,
          shipperName: shipperName? shipperName : null,
          trackingNumber: trackingNumber ? trackingNumber : null,
          reason: reason ? reason : null
        })
      })
}